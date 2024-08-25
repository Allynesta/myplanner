import { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import { fetchReports, fetchUsername } from "../services/authService";

const Home = () => {
	const { isAuthenticated } = useAuth();
	const [username, setUsername] = useState<string | null>(null);
	const [pastReportsCount, setPastReportsCount] = useState(0);
	const [futureReportsCount, setFutureReportsCount] = useState(0);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchUserData = async () => {
			if (isAuthenticated) {
				try {
					const username = await fetchUsername();
					setUsername(username);

					const reports = await fetchReports();
					const now = new Date();
					const pastReports = reports.filter(
						(report) => new Date(report.date) < now
					).length;
					const futureReports = reports.filter(
						(report) => new Date(report.date) >= now
					).length;
					setPastReportsCount(pastReports);
					setFutureReportsCount(futureReports);
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
						{pastReportsCount} report(s) in the past.
					</p>
				</li>
				<li>
					<p className="mt-4 text-lg">
						{futureReportsCount} report(s) in the future.
					</p>
				</li>
			</ul>
		</div>
	);
};

export default Home;
