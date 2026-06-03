import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
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
	reportData: ReportData[];
	onDelete: (reportId: number) => void;
}

const ReportTable: React.FC<Props> = ({ reportData, onDelete }) => {
	const { showToast } = useToast();
	const [, setReportData] = useState<ReportData[]>([]);
	const [showData, setShowData] = useState<ReportData[]>([]);
	const [filter, setFilter] = useState<string>("All");
	const [paymentFilter, setPaymentFilter] = useState<string>("All");
	const [searchText, setSearchText] = useState<string>("");
	const [deletingId, setDeletingId] = useState<number | null>(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const data = await fetchReports();
				setReportData(data);
				setShowData(data);
			} catch (error) {
				console.error("Error fetching reports:", error);
			}
		};
		fetchData();
	}, []);

	useEffect(() => {
		let filteredData = [...reportData];
		if (searchText) {
			filteredData = filteredData.filter((d) =>
				d.location.toUpperCase().includes(searchText.toUpperCase())
			);
		}
		if (filter !== "All") {
			filteredData = filteredData.filter((d) =>
				d.location.toUpperCase().includes(filter.toUpperCase())
			);
		}
		if (paymentFilter !== "All") {
			filteredData = filteredData.filter((d) => d.payment === paymentFilter);
		}
		setShowData(filteredData);
	}, [filter, paymentFilter, reportData, searchText]);

	const handleDeleteItem = async (reportId: number) => {
		if (!window.confirm("Delete this report? This cannot be undone.")) return;
		setDeletingId(reportId);
		try {
			await deleteReport(reportId);
			setShowData((prev) => prev.filter((d) => d.reportId !== reportId));
			setReportData((prev) => prev.filter((d) => d.reportId !== reportId));
			onDelete(reportId);
			showToast("Report deleted", "success");
		} catch (error) {
			console.error("Error deleting report:", error);
			showToast("Failed to delete report", "error");
		} finally {
			setDeletingId(null);
		}
	};

	const handleExportToExcel = () => {
		if (showData.length === 0) {
			showToast("No data to export", "info");
			return;
		}
		const formattedData = showData.map((report) => ({
			Location: report.location,
			Description: report.description,
			Date: new Date(report.date).toLocaleDateString(),
			Pax: report.pax,
			Price: report.price,
			"Food & Bev": report.expense1,
			Fuel: report.expense2,
			Staff: report.expense3,
			Commission: report.expense4,
			Others: report.expense5,
			Payment: report.payment,
			Profit: report.total,
		}));
		const worksheet = XLSX.utils.json_to_sheet(formattedData);
		const workbook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workbook, worksheet, "Reports");
		XLSX.writeFile(workbook, "reports.xlsx");
		showToast(`Exported ${showData.length} reports to Excel`, "success");
	};

	const paymentBadge: Record<string, string> = {
		"Paid by cash": "bg-green-100 text-green-700",
		"Paid by juice": "bg-blue-100 text-blue-700",
		"Not paid": "bg-red-100 text-red-600",
	};

	return (
		<div className="max-w-7xl mx-auto p-4">
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
				<div>
					<h2 className="text-2xl font-bold text-gray-800">Report Table</h2>
					<p className="text-sm text-gray-500 mt-0.5">
						{showData.length} {showData.length === 1 ? "record" : "records"} found
					</p>
				</div>
				<button
					onClick={handleExportToExcel}
					className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition text-sm font-medium"
				>
					Export to Excel
				</button>
			</div>

			{/* Filters */}
			<div className="flex flex-col sm:flex-row gap-3 mb-4">
				<input
					value={searchText}
					onChange={(e) => setSearchText(e.target.value)}
					placeholder="Search locations…"
					className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 w-full sm:w-1/3 text-sm"
				/>

				<select
					onChange={(e) => setFilter(e.target.value)}
					className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 w-full sm:w-1/3 text-sm"
				>
					<option value="All">All Locations</option>
					<option>Pieter</option>
					<option>Morne</option>
					<option>Cascade</option>
				</select>

				<select
					onChange={(e) => setPaymentFilter(e.target.value)}
					className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 w-full sm:w-1/3 text-sm"
				>
					<option value="All">All Payments</option>
					<option>Not paid</option>
					<option>Paid by cash</option>
					<option>Paid by juice</option>
				</select>
			</div>

			{/* Table */}
			{showData.length === 0 ? (
				<div className="py-16 text-center text-gray-400 border border-dashed border-gray-300 rounded-lg">
					<p className="text-4xl mb-3">📋</p>
					<p className="text-lg font-medium">No reports found</p>
					<p className="text-sm">Try adjusting your filters or add a new report</p>
				</div>
			) : (
				<div className="overflow-x-auto rounded-lg border border-gray-200">
					<table className="min-w-full bg-white">
						<thead className="bg-gray-50 border-b border-gray-200">
							<tr>
								<th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Location</th>
								<th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
								<th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Pax</th>
								<th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Price</th>
								<th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Payment</th>
								<th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Profit</th>
								<th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-100">
							{showData.map((report) => (
								<tr key={report.reportId} className="hover:bg-gray-50 transition">
									<td className="px-4 py-3 text-sm font-medium text-gray-800 capitalize">{report.location}</td>
									<td className="px-4 py-3 text-sm text-gray-600">{new Date(report.date).toLocaleDateString()}</td>
									<td className="px-4 py-3 text-sm text-gray-600">{report.pax}</td>
									<td className="px-4 py-3 text-sm text-gray-600">Rs {report.price.toLocaleString()}</td>
									<td className="px-4 py-3 text-sm">
										<span className={`px-2 py-1 rounded-full text-xs font-medium ${paymentBadge[report.payment] ?? "bg-gray-100 text-gray-600"}`}>
											{report.payment}
										</span>
									</td>
									<td className={`px-4 py-3 text-sm font-semibold ${report.total >= 0 ? "text-green-600" : "text-red-500"}`}>
										Rs {report.total.toLocaleString()}
									</td>
									<td className="px-4 py-3">
										<button
											onClick={() => handleDeleteItem(report.reportId)}
											disabled={deletingId === report.reportId}
											className="text-sm text-red-500 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded transition disabled:opacity-40"
											title="Delete report"
										>
											{deletingId === report.reportId ? "…" : "Delete"}
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
};

export default ReportTable;
