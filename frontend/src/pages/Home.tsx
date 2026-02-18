import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../AuthContext";
import { fetchReports, fetchUsername } from "../services/authService";
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
} from "recharts";

type Report = {
	date: string;
	total: number;
	expense1: number;
	expense2: number;
	expense3: number;
	expense4: number;
	expense5: number;
};

const Home = () => {
	const { isAuthenticated } = useAuth();

	const [username, setUsername] = useState<string | null>(null);
	const [reports, setReports] = useState<Report[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const [rangeDays, setRangeDays] = useState<30 | 60 | 90>(30);

	// Fetch once
	useEffect(() => {
		const fetchData = async () => {
			if (!isAuthenticated) return;

			try {
				setLoading(true);
				const name = await fetchUsername();
				setUsername(name);

				const data = await fetchReports();
				setReports(
					data.map((r) => ({
						...r,
						date:
							r.date instanceof Date
								? r.date.toISOString().split("T")[0]
								: r.date,
					})),
				);
			} catch {
				setError("Failed to load data.");
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [isAuthenticated]);

	// Reports in selected range
	const rangeReports = useMemo(() => {
		const now = new Date();
		const pastDate = new Date();
		pastDate.setDate(now.getDate() - rangeDays);

		return reports.filter((r) => {
			const d = new Date(r.date);
			return d >= pastDate && d <= now;
		});
	}, [reports, rangeDays]);

	// Range stats with expense breakdown
	const stats = useMemo(() => {
		let income = 0;
		let expense1 = 0;
		let expense2 = 0;
		let expense3 = 0;
		let expense4 = 0;
		let expense5 = 0;

		rangeReports.forEach((r) => {
			income += r.total;
			expense1 += r.expense1;
			expense2 += r.expense2;
			expense3 += r.expense3;
			expense4 += r.expense4;
			expense5 += r.expense5;
		});

		const totalExpense = expense1 + expense2 + expense3 + expense4 + expense5;

		return {
			bookings: rangeReports.length,
			income,
			totalExpense,
			profit: income - totalExpense,
			expense1,
			expense2,
			expense3,
			expense4,
			expense5,
		};
	}, [rangeReports]);

	// Chart data (daily)
	const chartData = useMemo(() => {
		const map: Record<string, { income: number; expense: number }> = {};

		rangeReports.forEach((r) => {
			const key = new Date(r.date).toISOString().split("T")[0];

			if (!map[key]) {
				map[key] = { income: 0, expense: 0 };
			}

			map[key].income += r.total;
			map[key].expense +=
				r.expense1 + r.expense2 + r.expense3 + r.expense4 + r.expense5;
		});

		return Object.entries(map)
			.sort(([a], [b]) => (a > b ? 1 : -1))
			.map(([date, v]) => ({
				date,
				income: v.income,
				expense: v.expense,
				profit: v.income - v.expense,
			}));
	}, [rangeReports]);

	if (loading)
		return <div className="p-10 text-center text-gray-500">Loading...</div>;
	if (error)
		return <div className="p-10 text-center text-red-500">{error}</div>;
	if (!isAuthenticated)
		return (
			<div className="p-10 text-center text-3xl font-bold text-gray-700">
				404 | My Planner
			</div>
		);

	return (
		<div className="max-w-7xl mx-auto p-4 space-y-8">
			<h1 className="text-3xl font-bold">Welcome, {username} 👋</h1>
			{/* Range selector */}
			<div className="flex gap-3">
				{[30, 60, 90].map((d) => (
					<button
						key={d}
						onClick={() => setRangeDays(d as 30 | 60 | 90)}
						className={`px-4 py-2 border rounded ${
							rangeDays === d ? "bg-blue-600 text-white" : ""
						}`}
					>
						Last {d} Days
					</button>
				))}
			</div>
			{/* Main stats */}
			<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
				<Card title="Bookings" value={stats.bookings} />
				<Card title="Income" value={`Rs ${stats.income}`} />
				<Card title="Total Expenses" value={`Rs ${stats.totalExpense}`} />
				<Card title="Profit" value={`Rs ${stats.profit}`} />
			</div>

			{/* Expense breakdown */}
			<div>
				<h2 className="text-xl font-bold mb-3">Expense Breakdown</h2>
				<div className="grid grid-cols-2 md:grid-cols-5 gap-4">
					<Card title="Food & Bev" value={`Rs ${stats.expense1}`} />
					<Card title="Fuel" value={`Rs ${stats.expense2}`} />
					<Card title="Staff" value={`Rs ${stats.expense3}`} />
					<Card title="Commission" value={`Rs ${stats.expense4}`} />
					<Card title="Others" value={`Rs ${stats.expense5}`} />
				</div>
			</div>
			{/* Chart */}
			<div className="bg-white p-6 rounded shadow">
				<h2 className="text-xl font-bold mb-4">
					Daily Performance (last {rangeDays} days)
				</h2>
				<ResponsiveContainer width="100%" height={300}>
					<LineChart data={chartData}>
						<CartesianGrid strokeDasharray="3 3" />
						<XAxis dataKey="date" />
						<YAxis />
						<Tooltip />
						<Line type="monotone" dataKey="income" />
						<Line type="monotone" dataKey="expense" />
						<Line type="monotone" dataKey="profit" />
					</LineChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
};

const Card = ({ title, value }: { title: string; value: string | number }) => (
	<div className="bg-white border shadow rounded p-4">
		<p className="text-gray-500">{title}</p>
		<p className="text-2xl font-bold">{value}</p>
	</div>
);

export default Home;
