import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
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
	reportData: ReportData[];
	onDelete: (reportId: number) => void;
}

const ReportTable: React.FC<Props> = ({ reportData, onDelete }) => {
	const [, setReportData] = useState<ReportData[]>([]);
	const [showData, setShowData] = useState<ReportData[]>([]);
	const [filter, setFilter] = useState<string>("All");
	const [paymentFilter, setPaymentFilter] = useState<string>("All");

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
		if (filter !== "All") {
			filteredData = filteredData.filter((data) =>
				data.location.toUpperCase().includes(filter.toUpperCase())
			);
		}
		if (paymentFilter !== "All") {
			filteredData = filteredData.filter(
				(data) => data.payment === paymentFilter
			);
		}
		setShowData(filteredData);
	}, [filter, paymentFilter, reportData]);

	const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) =>
		setFilter(event.target.value);
	const handlePaymentFilterChange = (
		event: React.ChangeEvent<HTMLSelectElement>
	) => setPaymentFilter(event.target.value);

	const handleDeleteItem = async (reportId: number) => {
		if (window.confirm("Are you sure you want to delete this item?")) {
			try {
				await deleteReport(reportId);
				const updatedReportData = showData.filter(
					(data) => data.reportId !== reportId
				);
				setShowData(updatedReportData);
				setReportData(updatedReportData);
				onDelete(reportId);
			} catch (error) {
				console.error("Error deleting report:", error);
			}
		}
	};

	const filterByLocation = () => {
		const input = (
			document.getElementById("myInput") as HTMLInputElement
		).value.toUpperCase();
		const filteredData = reportData.filter((data) =>
			data.location.toUpperCase().includes(input)
		);
		setShowData(filteredData);
	};

	const handleExportToExcel = () => {
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
			Total: report.total,
		}));

		const worksheet = XLSX.utils.json_to_sheet(formattedData);
		const workbook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workbook, worksheet, "Reports");
		XLSX.writeFile(workbook, "reports.xlsx");
	};

	return (
		<div className="max-w-7xl mx-auto p-4">
			<div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
				<h2 className="text-2xl font-bold text-gray-800">Report Table</h2>
				<button
					onClick={handleExportToExcel}
					className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
				>
					Export to Excel
				</button>
			</div>

			{/* Filters */}
			<div className="flex flex-col sm:flex-row gap-4 mb-4">
				<input
					id="myInput"
					onKeyUp={filterByLocation}
					placeholder="Search for locations..."
					className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 w-full sm:w-1/3"
				/>

				<select
					id="countriesDropdown"
					onChange={handleFilterChange}
					className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 w-full sm:w-1/3"
				>
					<option>All</option>
					<option>Pieter</option>
					<option>Morne</option>
					<option>Cascade</option>
				</select>

				<select
					id="paymentDropdown"
					onChange={handlePaymentFilterChange}
					className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 w-full sm:w-1/3"
				>
					<option>All</option>
					<option>Not paid</option>
					<option>Paid by cash</option>
					<option>Paid by juice</option>
				</select>
			</div>

			{/* Table */}
			<div className="overflow-x-auto">
				<table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
					<thead className="bg-gray-100">
						<tr>
							<th className="px-4 py-2 text-left text-gray-600">Location</th>
							<th className="px-4 py-2 text-left text-gray-600">Date</th>
							<th className="px-4 py-2 text-left text-gray-600">Pax</th>
							<th className="px-4 py-2 text-left text-gray-600">Price</th>
							<th className="px-4 py-2 text-left text-gray-600">Profit</th>
							<th className="px-4 py-2 text-left text-gray-600">Actions</th>
						</tr>
					</thead>
					<tbody>
						{showData.map((report) => (
							<tr
								key={report.reportId}
								className="hover:bg-gray-50 transition cursor-pointer"
							>
								<td className="px-4 py-2">{report.location}</td>
								<td className="px-4 py-2">
									{new Date(report.date).toLocaleDateString()}
								</td>
								<td className="px-4 py-2">{report.pax}</td>
								<td className="px-4 py-2">{report.price}</td>
								<td className="px-4 py-2">{report.total}</td>
								<td className="px-4 py-2">
									<button
										onClick={() => handleDeleteItem(report.reportId)}
										className="text-red-500 font-bold hover:text-red-700 transition"
									>
										x
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default ReportTable;
