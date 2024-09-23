import { useState, useEffect, useCallback } from "react";
import Report from "../components/Report";
import { fetchReports, deleteReport } from "../services/authService";
import "../styles/reportcard.css";

// Define the structure of the data each report will have
interface ReportData {
	reportId: number;
	location: string;
	description: string;
	date: Date;
	pax: number;
	price: number;
	expense1: number;
	expense2: number;
	expense3: number;
	expense4: number;
	expense5: number;
	payment: string;
	total: number;
}

interface Props {
	onDelete: (reportId: number) => void;
}

const ReportCard: React.FC<Props> = ({ onDelete }) => {
	const [reportData, setReportData] = useState<ReportData[]>([]);
	const [error, setError] = useState<string | null>(null);

	// State for filters
	const [selectedLocation, setSelectedLocation] = useState<string>("All");
	const [selectedMonth, setSelectedMonth] = useState<string>("All");

	// Fetch data using useEffect
	useEffect(() => {
		const fetchData = async () => {
			try {
				const data = await fetchReports();
				setReportData(data);
			} catch (error) {
				console.error("Error fetching reports:", error);
				setError("Failed to load reports.");
			}
		};

		fetchData();
	}, []);

	// Memoized callback to handle report deletion
	const handleDeleteItem = useCallback(
		async (id: number) => {
			try {
				await deleteReport(id);
				setReportData((prevData) =>
					prevData.filter((data) => data.reportId !== id)
				);
				onDelete(id);
			} catch (error) {
				console.error("Error deleting report:", error);
				setError("Failed to delete report.");
			}
		},
		[onDelete]
	);

	// Filter reports based on selected location and month
	const filteredReports = reportData.filter((report) => {
		const reportMonth = new Date(report.date).getMonth() + 1; // Get month as 1-12
		const selectedMonthNum =
			selectedMonth === "All" ? null : parseInt(selectedMonth);

		return (
			(selectedLocation === "All" || report.location === selectedLocation) &&
			(selectedMonthNum === null || reportMonth === selectedMonthNum)
		);
	});

	// Extract unique locations from report data for the dropdown
	const uniqueLocations = Array.from(
		new Set(reportData.map((report) => report.location))
	);

	return (
		<>
			<h2>Report Card</h2>
			{error && <p className="error">{error}</p>}

			{/* Filter Dropdowns */}
			<div className="filter-container">
				<label htmlFor="location-filter">Filter by Location:</label>
				<select
					id="location-filter"
					value={selectedLocation}
					onChange={(e) => setSelectedLocation(e.target.value)}
				>
					<option value="All">All Locations</option>
					{uniqueLocations.map((location) => (
						<option key={location} value={location}>
							{location}
						</option>
					))}
				</select>

				<label htmlFor="month-filter">Filter by Month:</label>
				<select
					id="month-filter"
					value={selectedMonth}
					onChange={(e) => setSelectedMonth(e.target.value)}
				>
					<option value="All">All Months</option>
					<option value="1">January</option>
					<option value="2">February</option>
					<option value="3">March</option>
					<option value="4">April</option>
					<option value="5">May</option>
					<option value="6">June</option>
					<option value="7">July</option>
					<option value="8">August</option>
					<option value="9">September</option>
					<option value="10">October</option>
					<option value="11">November</option>
					<option value="12">December</option>
				</select>
			</div>

			<div className="card-row">
				<div className="card-column">
					<div className="card">
						<Report
							onDelete={handleDeleteItem}
							reportData={filteredReports.map((data) => ({
								reportId: data.reportId,
								description: data.description,
								date: new Date(data.date),
								location: data.location,
								pax: data.pax,
								price: data.price,
								expense1: data.expense1,
								expense2: data.expense2,
								expense3: data.expense3,
								expense4: data.expense4,
								expense5: data.expense5,
								payment: data.payment,
								total: data.total,
							}))}
						/>
					</div>
				</div>
			</div>
		</>
	);
};

export default ReportCard;
