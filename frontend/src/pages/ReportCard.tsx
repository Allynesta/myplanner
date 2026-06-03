import { useState, useEffect, useCallback } from "react";
import Report from "../components/Report";
import { fetchReports, deleteReport } from "../services/authService";
import { useToast } from "../ToastContext";

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

const MONTHS = [
	"January", "February", "March", "April", "May", "June",
	"July", "August", "September", "October", "November", "December",
];

const ReportCard: React.FC<Props> = ({ onDelete }) => {
	const { showToast } = useToast();
	const [reportData, setReportData] = useState<ReportData[]>([]);
	const [loading, setLoading] = useState(true);
	const [selectedLocation, setSelectedLocation] = useState<string>("All");
	const [selectedMonth, setSelectedMonth] = useState<string>("All");

	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true);
				const data = await fetchReports();
				setReportData(data);
			} catch (err) {
				console.error("Error fetching reports:", err);
				showToast("Failed to load reports", "error");
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleDeleteItem = useCallback(
		async (id: number) => {
			try {
				await deleteReport(id);
				setReportData((prev) => prev.filter((data) => data.reportId !== id));
				onDelete(id);
				showToast("Report deleted", "success");
			} catch (err) {
				console.error("Error deleting report:", err);
				showToast("Failed to delete report", "error");
			}
		},
		[onDelete, showToast]
	);

	const filteredReports = reportData.filter((report) => {
		const reportMonth = new Date(report.date).getMonth() + 1;
		const selectedMonthNum = selectedMonth === "All" ? null : parseInt(selectedMonth);
		return (
			(selectedLocation === "All" || report.location === selectedLocation) &&
			(selectedMonthNum === null || reportMonth === selectedMonthNum)
		);
	});

	const uniqueLocations = Array.from(new Set(reportData.map((r) => r.location)));

	return (
		<div className="max-w-7xl mx-auto p-4 space-y-4">
			<div>
				<h2 className="text-2xl font-bold text-gray-800">Report Cards</h2>
				<p className="text-sm text-gray-500 mt-0.5">
					{filteredReports.length} {filteredReports.length === 1 ? "record" : "records"}
				</p>
			</div>

			{/* Filters */}
			<div className="flex flex-wrap gap-3 items-end">
				<div>
					<label className="block text-xs font-medium text-gray-500 mb-1">Location</label>
					<select
						value={selectedLocation}
						onChange={(e) => setSelectedLocation(e.target.value)}
						className="border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
					>
						<option value="All">All Locations</option>
						{uniqueLocations.map((loc) => (
							<option key={loc} value={loc}>{loc}</option>
						))}
					</select>
				</div>
				<div>
					<label className="block text-xs font-medium text-gray-500 mb-1">Month</label>
					<select
						value={selectedMonth}
						onChange={(e) => setSelectedMonth(e.target.value)}
						className="border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
					>
						<option value="All">All Months</option>
						{MONTHS.map((name, i) => (
							<option key={i + 1} value={i + 1}>{name}</option>
						))}
					</select>
				</div>
			</div>

			{loading ? (
				<div className="flex items-center justify-center gap-3 py-16 text-gray-400">
					<div className="w-6 h-6 border-4 border-blue-400 border-t-transparent rounded-full animate-spin" />
					<span>Loading reports…</span>
				</div>
			) : filteredReports.length === 0 ? (
				<div className="py-16 text-center text-gray-400 border border-dashed border-gray-300 rounded-lg">
					<p className="text-4xl mb-3">📋</p>
					<p className="text-lg font-medium">No reports found</p>
					<p className="text-sm">Try changing your filters or add a report from the Add Report page</p>
				</div>
			) : (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
					{filteredReports.map((data) => (
						<div key={data.reportId} className="bg-white shadow-sm rounded-lg border hover:shadow-md transition">
							<Report onDelete={handleDeleteItem} reportData={[data]} />
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default ReportCard;
