import { useEffect, useState, useMemo } from "react";
import { useAuth } from "../AuthContext";
import { fetchReports, fetchUsername } from "../services/authService";

const Home = () => {
	const { isAuthenticated } = useAuth();
	const [username, setUsername] = useState<string | null>(null);
	const [pastReportsCount, setPastReportsCount] = useState(0);
	const [futureReportsCount, setFutureReportsCount] = useState(0);
	const [totalIncome, setTotalIncome] = useState(0); // State for total income
	const [totalExpense, setTotalExpense] = useState(0); // State for total expense
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchUserData = async () => {
			if (isAuthenticated) {
				try {
					const fetchedUsername = await fetchUsername();
					setUsername(fetchedUsername);

					const reports = await fetchReports();
					const now = new Date();

					// Calculate past and future reports
					const pastReportsCount = reports.filter(
						(report) => new Date(report.date) < now
					).length;

					const futureReportsCount = reports.filter(
						(report) => new Date(report.date) >= now
					).length;

					setPastReportsCount(pastReportsCount);
					setFutureReportsCount(futureReportsCount);

					// Calculate total income and expense for the current month
					const currentMonth = now.getMonth();
					const currentYear = now.getFullYear();

					let totalIncomeForMonth = 0;
					let totalExpenseForMonth = 0;

					reports.forEach((report) => {
						const reportDate = new Date(report.date);

						// Check if the report is in the current month and year
						if (
							reportDate.getMonth() === currentMonth &&
							reportDate.getFullYear() === currentYear
						) {
							totalIncomeForMonth += report.total; // Assuming 'total' is the income
							totalExpenseForMonth +=
								report.expense1 +
								report.expense2 +
								report.expense3 +
								report.expense4 +
								report.expense5; // Sum of all expenses
						}
					});

					setTotalIncome(totalIncomeForMonth);
					setTotalExpense(totalExpenseForMonth);
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
	}, [isAuthenticated]);

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
				<ul>
					<li>
						<p className="mt-4 text-lg">
							{pastReportsCount} report
							{pastReportsCount !== 1 ? "s" : ""} in the past.
						</p>
					</li>
					<li>
						<p className="mt-4 text-lg">
							{futureReportsCount} report
							{futureReportsCount !== 1 ? "s" : ""} in the future.
						</p>
					</li>
					<li>
						<p className="mt-4 text-lg">
							Total Profit for the Month: Rs {totalIncome}
						</p>
					</li>
					<li>
						<p className="mt-4 text-lg">
							Total Expenses for the Month: Rs {totalExpense}
						</p>
					</li>
				</ul>
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
	]);

	return content;
};

export default Home;
