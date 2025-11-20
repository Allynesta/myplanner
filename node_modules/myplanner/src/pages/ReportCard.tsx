import { useState, useEffect, useCallback } from "react";
import Report from "../components/Report";
import { fetchReports, deleteReport } from "../services/authService";

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

	const [selectedLocation, setSelectedLocation] = useState<string>("All");
	const [selectedMonth, setSelectedMonth] = useState<string>("All");

	// Fetch reports
	useEffect(() => {
		const fetchData = async () => {
			try {
				const data = await fetchReports();
				setReportData(data);
			} catch (err) {
				console.error("Error fetching reports:", err);
				setError("Failed to load reports.");
			}
		};
		fetchData();
	}, []);

	// Delete report callback
	const handleDeleteItem = useCallback(
		async (id: number) => {
			try {
				await deleteReport(id);
				setReportData((prev) => prev.filter((data) => data.reportId !== id));
				onDelete(id);
			} catch (err) {
				console.error("Error deleting report:", err);
				setError("Failed to delete report.");
			}
		},
		[onDelete]
	);

	// Filter reports
	const filteredReports = reportData.filter((report) => {
		const reportMonth = new Date(report.date).getMonth() + 1;
		const selectedMonthNum =
			selectedMonth === "All" ? null : parseInt(selectedMonth);

		return (
			(selectedLocation === "All" || report.location === selectedLocation) &&
			(selectedMonthNum === null || reportMonth === selectedMonthNum)
		);
	});

	const uniqueLocations = Array.from(
		new Set(reportData.map((r) => r.location))
	);

	return (
		<div className="space-y-4">
			<h2 className="text-2xl font-semibold text-gray-800">Report Cards</h2>
			{error && <p className="text-red-500">{error}</p>}

			{/* Filters */}
			<div className="flex flex-wrap gap-4 items-center">
				<div>
					<label htmlFor="location-filter" className="mr-2 font-medium">
						Location:
					</label>
					<select
						id="location-filter"
						value={selectedLocation}
						onChange={(e) => setSelectedLocation(e.target.value)}
						className="border rounded px-2 py-1"
					>
						<option value="All">All Locations</option>
						{uniqueLocations.map((loc) => (
							<option key={loc} value={loc}>
								{loc}
							</option>
						))}
					</select>
				</div>

				<div>
					<label htmlFor="month-filter" className="mr-2 font-medium">
						Month:
					</label>
					<select
						id="month-filter"
						value={selectedMonth}
						onChange={(e) => setSelectedMonth(e.target.value)}
						className="border rounded px-2 py-1"
					>
						<option value="All">All Months</option>
						{Array.from({ length: 12 }, (_, i) => (
							<option key={i + 1} value={i + 1}>
								{new Date(0, i).toLocaleString("default", { month: "long" })}
							</option>
						))}
					</select>
				</div>
			</div>

			{/* Cards */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
				{filteredReports.map((data) => (
					<div
						key={data.reportId}
						className="bg-white shadow rounded-lg p-4 flex flex-col justify-between"
					>
						<Report onDelete={handleDeleteItem} reportData={[data]} />
					</div>
				))}
			</div>
		</div>
	);
};

export default ReportCard;
