import { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import { fetchReports } from "../services/authService";

const Home = () => {
	const { isAuthenticated } = useAuth();
	const [pastReportsCount, setPastReportsCount] = useState(0);
	const [futureReportsCount, setFutureReportsCount] = useState(0);

	useEffect(() => {
		const fetchReportCounts = async () => {
			if (isAuthenticated) {
				try {
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
					console.error("Error fetching reports:", error);
				}
			}
		};

		fetchReportCounts();
	}, [isAuthenticated]);

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
			<h1 className="text-2xl font-semibold">Welcome!</h1>
			<ul>
				<li>
					<p className="mt-4 text-lg">
						{" "}
						{pastReportsCount} report(s) in the past.{" "}
					</p>
				</li>
				<li>
					<p className="mt-4 text-lg">
						{" "}
						{futureReportsCount} report(s) in the future.{" "}
					</p>
				</li>
			</ul>
		</div>
	);
};

export default Home;
