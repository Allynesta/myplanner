import { useEffect, useState, useMemo } from "react";
import { useAuth } from "../AuthContext";
import { fetchReports, fetchUsername } from "../services/authService";
import "../styles/home.css";

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
					const now = new Date();

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
	}, [isAuthenticated, selectedMonth, selectedYear]);

	const content = useMemo(() => {
		if (loading) {
			return <p className="loading">Loading...</p>;
		}

		if (error) {
			return <p className="error-message">{error}</p>;
		}

		if (!isAuthenticated) {
			return <h1 className="not-found">404 | My Planner</h1>;
		}

		return (
			<div className="dashboard-wrapper">
				<header className="dashboard-header">
					<h1>Welcome, {username}!</h1>
					<div className="filters">
						<select
							value={selectedMonth ?? ""}
							onChange={(e) => setSelectedMonth(Number(e.target.value) || null)}
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
						>
							<option value="">All Years</option>
							{Array.from({ length: 6 }, (_, i) => (
								<option key={i} value={2020 + i}>
									{2020 + i}
								</option>
							))}
						</select>
					</div>
				</header>

				<div className="dashboard-content">
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
	]);

	return content;
};

export default Home;
