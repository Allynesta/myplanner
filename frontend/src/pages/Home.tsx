import { useEffect, useState, useMemo } from "react";
import { useAuth } from "../AuthContext";
import { fetchReports, fetchUsername } from "../services/authService";
import "../styles/home.css";
// Helper function to get the week number of a date
const getWeekNumber = (date: Date) => {
	const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
	const pastDaysOfYear =
		(date.getTime() - firstDayOfYear.getTime()) / (24 * 60 * 60 * 1000);
	return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
};
const Home = () => {
	const { isAuthenticated } = useAuth();
	const [username, setUsername] = useState<string | null>(null);
	const [pastReportsCount, setPastReportsCount] = useState(0);
	const [futureReportsCount, setFutureReportsCount] = useState(0);
	const [totalIncome, setTotalIncome] = useState(0);
	const [totalExpense, setTotalExpense] = useState(0);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// Get current date details
	const now = new Date();
	const currentMonth = now.getMonth(); // Month (0-based index)
	const currentYear = now.getFullYear(); // Year
	const currentWeek = getWeekNumber(now); // Week number using the helper function

	// State for filtering by month, year, and week
	const [selectedMonth, setSelectedMonth] = useState<number | null>(
		currentMonth
	);
	const [selectedYear, setSelectedYear] = useState<number | null>(currentYear);
	const [selectedWeek, setSelectedWeek] = useState<number | null>(currentWeek);

	useEffect(() => {
		const fetchUserData = async () => {
			if (isAuthenticated) {
				try {
					const fetchedUsername = await fetchUsername();
					setUsername(fetchedUsername);

					const reports = await fetchReports();
					const now = new Date();

					// Filter reports based on selected month, year, or week
					const filteredReports = reports.filter((report) => {
						const reportDate = new Date(report.date);
						const isInMonth =
							selectedMonth === null || reportDate.getMonth() === selectedMonth;
						const isInYear =
							selectedYear === null ||
							reportDate.getFullYear() === selectedYear;
						const isInWeek =
							selectedWeek === null ||
							getWeekNumber(reportDate) === selectedWeek; // Helper function to get week number
						return isInMonth && isInYear && isInWeek;
					});

					// Calculate past and future reports
					const pastReportsCount = filteredReports.filter(
						(report) => new Date(report.date) < now
					).length;

					const futureReportsCount = filteredReports.filter(
						(report) => new Date(report.date) >= now
					).length;

					setPastReportsCount(pastReportsCount);
					setFutureReportsCount(futureReportsCount);

					// Calculate total income and expense
					let totalIncomeForSelectedPeriod = 0;
					let totalExpenseForSelectedPeriod = 0;

					filteredReports.forEach((report) => {
						totalIncomeForSelectedPeriod += report.total;
						totalExpenseForSelectedPeriod +=
							report.expense1 +
							report.expense2 +
							report.expense3 +
							report.expense4 +
							report.expense5;
					});

					setTotalIncome(totalIncomeForSelectedPeriod);
					setTotalExpense(totalExpenseForSelectedPeriod);
				} catch (error) {
					console.error("Error fetching user data:", error);
					setError("Failed to load data. Please try again later.");
				} finally {
					setLoading(false);
				}
			} else {
				setLoading(false);
			}
		};

		fetchUserData();
	}, [isAuthenticated, selectedMonth, selectedYear, selectedWeek]);

	const content = useMemo(() => {
		if (loading) {
			return (
				<div className="grid h-screen place-content-center bg-white px-4">
					<p>Loading...</p>
				</div>
			);
		}

		if (error) {
			return (
				<div className="grid h-screen place-content-center bg-white px-4">
					<p className="text-red-500">{error}</p>
				</div>
			);
		}

		if (!isAuthenticated) {
			return (
				<div className="grid h-screen place-content-center bg-white px-4">
					<h1 className="uppercase tracking-widest text-gray-500">
						404 | My Planner
					</h1>
				</div>
			);
		}

		return (
			<div className="grid h-screen place-content-center bg-white px-4">
				<h1 className="text-2xl font-semibold">Welcome, {username}!</h1>
				<div className="container">
					<div className="mt-4">
						{/* Filters */}
						<select
							value={selectedMonth ?? ""}
							onChange={(e) => setSelectedMonth(Number(e.target.value) || null)}
							className="mr-2"
						>
							<option value="">All Months</option>
							{Array.from({ length: 12 }, (_, i) => (
								<option key={i} value={i}>
									{new Date(0, i).toLocaleString("default", { month: "long" })}
								</option>
							))}
						</select>

						<select
							value={selectedYear ?? ""}
							onChange={(e) => setSelectedYear(Number(e.target.value) || null)}
							className="mr-2"
						>
							<option value="">All Years</option>
							{/* Assuming years from 2020 to current year */}
							{Array.from({ length: 6 }, (_, i) => (
								<option key={i} value={2020 + i}>
									{2020 + i}
								</option>
							))}
						</select>

						<select
							value={selectedWeek ?? ""}
							onChange={(e) => setSelectedWeek(Number(e.target.value) || null)}
							className="mr-2"
						>
							<option value="">All Weeks</option>
							{Array.from({ length: 52 }, (_, i) => (
								<option key={i} value={i + 1}>
									Week {i + 1}
								</option>
							))}
						</select>
					</div>
				</div>

				<div className="container">
					<div className="card">
						<ul>
							<li>
								<p className="total-label">Reports in the past:</p>
								<span className="total-value">{pastReportsCount}</span>
							</li>
							<li>
								<p className="total-label">Reports in the future:</p>
								<span className="total-value">{futureReportsCount}</span>
							</li>
							<li>
								<p className="total-label">Total Income for the Month:</p>
								<span className="total-value">
									Rs {totalIncome + totalExpense}
								</span>
							</li>
							<li>
								<p className="total-label">Total Profit for the Month:</p>
								<span className="total-value">Rs {totalIncome}</span>
							</li>
							<li>
								<p className="total-label">Total Expenses for the Month:</p>
								<span className="total-value">Rs {totalExpense}</span>
							</li>
						</ul>
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
		selectedWeek,
	]);

	return content;
};

export default Home;
