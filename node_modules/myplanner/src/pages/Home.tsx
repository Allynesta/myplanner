import { useEffect, useState, useMemo } from "react";
import { useAuth } from "../AuthContext";
import { fetchReports, fetchUsername } from "../services/authService";

const Home = () => {
	const { isAuthenticated } = useAuth();
	const [username, setUsername] = useState<string | null>(null);
	const [pastReportsCount, setPastReportsCount] = useState(0);
	const [futureReportsCount, setFutureReportsCount] = useState(0);
	const [totalIncome, setTotalIncome] = useState(0);
	const [totalExpense, setTotalExpense] = useState(0);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const now = new Date();
	const currentMonth = now.getMonth();
	const currentYear = now.getFullYear();

	const [selectedMonth, setSelectedMonth] = useState<number | null>(
		currentMonth
	);
	const [selectedYear, setSelectedYear] = useState<number | null>(currentYear);

	useEffect(() => {
		const fetchUserData = async () => {
			if (isAuthenticated) {
				try {
					const fetchedUsername = await fetchUsername();
					setUsername(fetchedUsername);

					const reports = await fetchReports();
					const filteredReports = reports.filter((report) => {
						const reportDate = new Date(report.date);
						const isInMonth =
							selectedMonth === null || reportDate.getMonth() === selectedMonth;
						const isInYear =
							selectedYear === null ||
							reportDate.getFullYear() === selectedYear;
						return isInMonth && isInYear;
					});

					setPastReportsCount(
						filteredReports.filter((report) => new Date(report.date) < now)
							.length
					);
					setFutureReportsCount(
						filteredReports.filter((report) => new Date(report.date) >= now)
							.length
					);

					let income = 0;
					let expense = 0;
					filteredReports.forEach((report) => {
						income += report.total;
						expense +=
							report.expense1 +
							report.expense2 +
							report.expense3 +
							report.expense4 +
							report.expense5;
					});
					setTotalIncome(income);
					setTotalExpense(expense);
				} catch (error) {
					console.error(error);
					setError("Failed to load data. Please try again later.");
				} finally {
					setLoading(false);
				}
			} else {
				setLoading(false);
			}
		};

		fetchUserData();
	}, [isAuthenticated, selectedMonth, selectedYear]);

	const content = useMemo(() => {
		if (loading) {
			return (
				<div className="flex justify-center items-center h-screen">
					<p className="text-gray-500 text-lg animate-pulse">Loading...</p>
				</div>
			);
		}

		if (error) {
			return (
				<div className="flex justify-center items-center h-screen">
					<p className="text-red-500 text-lg">{error}</p>
				</div>
			);
		}

		if (!isAuthenticated) {
			return (
				<div className="flex justify-center items-center h-screen">
					<h1 className="text-3xl font-bold text-gray-700">404 | My Planner</h1>
				</div>
			);
		}

		return (
			<div className="max-w-7xl mx-auto p-4">
				{/* Header */}
				<div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
					<h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 md:mb-0">
						Welcome, {username}!
					</h1>

					<div className="flex gap-4">
						<select
							value={selectedMonth ?? ""}
							onChange={(e) => setSelectedMonth(Number(e.target.value) || null)}
							className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
						>
							<option value="">All Months</option>
							{Array.from({ length: 12 }, (_, i) => (
								<option key={i} value={i}>
									{new Date(0, i).toLocaleString("default", {
										month: "long",
									})}
								</option>
							))}
						</select>

						<select
							value={selectedYear ?? ""}
							onChange={(e) => setSelectedYear(Number(e.target.value) || null)}
							className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
						>
							<option value="">All Years</option>
							{Array.from({ length: 6 }, (_, i) => (
								<option key={i} value={2020 + i}>
									{2020 + i}
								</option>
							))}
						</select>
					</div>
				</div>

				{/* Dashboard Cards */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
					<div className="bg-white shadow rounded-lg p-6 border border-gray-200">
						<p className="text-gray-500 font-medium">Reports in the past</p>
						<span className="text-2xl font-bold text-gray-800">
							{pastReportsCount}
						</span>
					</div>

					<div className="bg-white shadow rounded-lg p-6 border border-gray-200">
						<p className="text-gray-500 font-medium">Reports in the future</p>
						<span className="text-2xl font-bold text-gray-800">
							{futureReportsCount}
						</span>
					</div>

					<div className="bg-white shadow rounded-lg p-6 border border-gray-200">
						<p className="text-gray-500 font-medium">
							Total Income for the Month
						</p>
						<span className="text-2xl font-bold text-green-600">
							Rs {totalIncome + totalExpense}
						</span>
					</div>

					<div className="bg-white shadow rounded-lg p-6 border border-gray-200">
						<p className="text-gray-500 font-medium">
							Total Profit for the Month
						</p>
						<span className="text-2xl font-bold text-blue-600">
							Rs {totalIncome}
						</span>
					</div>

					<div className="bg-white shadow rounded-lg p-6 border border-gray-200">
						<p className="text-gray-500 font-medium">
							Total Expenses for the Month
						</p>
						<span className="text-2xl font-bold text-red-600">
							Rs {totalExpense}
						</span>
					</div>
				</div>
			</div>
		);
	}, [
		loading,
		error,
		isAuthenticated,
		username,
		pastReportsCount,
		futureReportsCount,
		totalIncome,
		totalExpense,
		selectedMonth,
		selectedYear,
	]);

	return content;
};

export default Home;
