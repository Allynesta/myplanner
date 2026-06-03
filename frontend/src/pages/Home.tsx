import { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { fetchReports, fetchUsername } from "../services/authService";
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
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

const MONTHS = [
	"January", "February", "March", "April", "May", "June",
	"July", "August", "September", "October", "November", "December",
];

const Home = () => {
	const { isAuthenticated } = useAuth();

	const [username, setUsername] = useState<string | null>(null);
	const [reports, setReports] = useState<Report[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const now = new Date();
	const [selectedYear, setSelectedYear] = useState<number>(now.getFullYear());
	const [selectedMonth, setSelectedMonth] = useState<number>(now.getMonth() + 1);

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
						date: r.date instanceof Date ? r.date.toISOString().split("T")[0] : r.date,
					})),
				);
			} catch {
				setError("Failed to load data. Please refresh the page.");
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, [isAuthenticated]);

	if (!isAuthenticated) return <Navigate to="/login" replace />;

	if (loading)
		return (
			<div className="p-10 flex flex-col items-center gap-3 text-gray-500">
				<div className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin" />
				<span>Loading your data…</span>
			</div>
		);

	if (error)
		return (
			<div className="p-10 text-center">
				<p className="text-red-500 font-medium">{error}</p>
			</div>
		);

	const availableYears = Array.from(
		new Set(reports.map((r) => new Date(r.date).getFullYear()))
	).sort((a, b) => b - a);

	const monthReports = reports.filter((r) => {
		const d = new Date(r.date);
		return d.getFullYear() === selectedYear && d.getMonth() + 1 === selectedMonth;
	});

	const stats = useMemo(() => {
		let income = 0, expense1 = 0, expense2 = 0, expense3 = 0, expense4 = 0, expense5 = 0;
		monthReports.forEach((r) => {
			income += r.total;
			expense1 += r.expense1;
			expense2 += r.expense2;
			expense3 += r.expense3;
			expense4 += r.expense4;
			expense5 += r.expense5;
		});
		const totalExpense = expense1 + expense2 + expense3 + expense4 + expense5;
		return { bookings: monthReports.length, income, totalExpense, profit: income - totalExpense, expense1, expense2, expense3, expense4, expense5 };
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [monthReports.length, selectedMonth, selectedYear]);

	const chartData = useMemo(() => {
		const map: Record<string, { income: number; expense: number }> = {};
		monthReports.forEach((r) => {
			if (!map[r.date]) map[r.date] = { income: 0, expense: 0 };
			map[r.date].income += r.total;
			map[r.date].expense += r.expense1 + r.expense2 + r.expense3 + r.expense4 + r.expense5;
		});
		return Object.entries(map)
			.sort(([a], [b]) => (a > b ? 1 : -1))
			.map(([date, v]) => ({ date, income: v.income, expense: v.expense, profit: v.income - v.expense }));
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [monthReports.length, selectedMonth, selectedYear]);

	return (
		<div className="max-w-7xl mx-auto p-4 space-y-8">
			<h1 className="text-3xl font-bold">Welcome back, {username} 👋</h1>

			{/* Filters */}
			<div className="flex flex-wrap items-end gap-4">
				<div>
					<label className="block text-sm font-medium mb-1 text-gray-600">Year</label>
					<select
						value={selectedYear}
						onChange={(e) => setSelectedYear(Number(e.target.value))}
						className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
					>
						{availableYears.length > 0 ? (
							availableYears.map((year) => (
								<option key={year} value={year}>{year}</option>
							))
						) : (
							<option value={now.getFullYear()}>{now.getFullYear()}</option>
						)}
					</select>
				</div>
				<div>
					<label className="block text-sm font-medium mb-1 text-gray-600">Month</label>
					<select
						value={selectedMonth}
						onChange={(e) => setSelectedMonth(Number(e.target.value))}
						className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
					>
						{MONTHS.map((name, i) => (
							<option key={i + 1} value={i + 1}>{name}</option>
						))}
					</select>
				</div>
			</div>

			{/* Main stats */}
			<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
				<StatCard title="Bookings" value={stats.bookings} />
				<StatCard title="Income" value={`Rs ${stats.income.toLocaleString()}`} color="blue" />
				<StatCard title="Total Expenses" value={`Rs ${stats.totalExpense.toLocaleString()}`} color="red" />
				<StatCard
					title="Profit"
					value={`Rs ${stats.profit.toLocaleString()}`}
					color={stats.profit >= 0 ? "green" : "red"}
				/>
			</div>

			{/* Expense breakdown */}
			<div>
				<h2 className="text-xl font-bold mb-3">Expense Breakdown</h2>
				<div className="grid grid-cols-2 md:grid-cols-5 gap-4">
					<StatCard title="Food & Bev" value={`Rs ${stats.expense1.toLocaleString()}`} color="orange" />
					<StatCard title="Fuel" value={`Rs ${stats.expense2.toLocaleString()}`} color="orange" />
					<StatCard title="Staff" value={`Rs ${stats.expense3.toLocaleString()}`} color="orange" />
					<StatCard title="Commission" value={`Rs ${stats.expense4.toLocaleString()}`} color="orange" />
					<StatCard title="Others" value={`Rs ${stats.expense5.toLocaleString()}`} color="orange" />
				</div>
			</div>

			{/* Chart */}
			<div className="bg-white p-6 rounded-lg shadow">
				<h2 className="text-xl font-bold mb-4">
					Daily Performance — {MONTHS[selectedMonth - 1]} {selectedYear}
				</h2>
				{chartData.length === 0 ? (
					<div className="h-48 flex items-center justify-center text-gray-400">
						No data for this period
					</div>
				) : (
					<ResponsiveContainer width="100%" height={300}>
						<LineChart data={chartData}>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis dataKey="date" tick={{ fontSize: 12 }} />
							<YAxis tick={{ fontSize: 12 }} />
							<Tooltip formatter={(val: number) => `Rs ${val.toLocaleString()}`} />
							<Legend />
							<Line type="monotone" dataKey="income" stroke="#3b82f6" strokeWidth={2} dot={false} />
							<Line type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={2} dot={false} />
							<Line type="monotone" dataKey="profit" stroke="#22c55e" strokeWidth={2} dot={false} />
						</LineChart>
					</ResponsiveContainer>
				)}
			</div>
		</div>
	);
};

const colorMap: Record<string, string> = {
	blue: "text-blue-600",
	green: "text-green-600",
	red: "text-red-500",
	orange: "text-orange-500",
};

const StatCard = ({
	title,
	value,
	color,
}: {
	title: string;
	value: string | number;
	color?: string;
}) => (
	<div className="bg-white border shadow-sm rounded-lg p-4 hover:shadow-md transition">
		<p className="text-sm text-gray-500 mb-1">{title}</p>
		<p className={`text-2xl font-bold ${color ? colorMap[color] : "text-gray-800"}`}>
			{value}
		</p>
	</div>
);

export default Home;
