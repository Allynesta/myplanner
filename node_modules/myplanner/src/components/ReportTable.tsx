// Import necessary hooks and libraries
import { useEffect, useState } from "react";
import * as XLSX from "xlsx"; // Import the library for exporting to Excel
import "../styles/reporttable.css";
import { fetchReports, deleteReport } from "../services/authService"; // Import API functions

// Define the structure of a report
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

// Define the props this component will receive
interface Props {
	reportData: ReportData[];
	onDelete: (reportId: number) => void;
}

// ReportTable component
const ReportTable: React.FC<Props> = ({ reportData, onDelete }) => {
	// Local state to store reports
	const [, setReportData] = useState<ReportData[]>([]);
	const [showData, setShowData] = useState<ReportData[]>([]);
	const [filter, setFilter] = useState<string>("All");
	const [paymentFilter, setPaymentFilter] = useState<string>("All");

	// Fetch reports when component mounts
	useEffect(() => {
		const fetchData = async () => {
			try {
				const data = await fetchReports();
				setReportData(data); // Save all reports
				setShowData(data); // Show reports
			} catch (error) {
				console.error("Error fetching reports:", error);
			}
		};
		fetchData();
	}, []);

	// Update displayed data whenever filters or reports change
	useEffect(() => {
		let filteredData = [...reportData];

		// Filter by location
		if (filter !== "All") {
			filteredData = filteredData.filter((data) =>
				data.location.toUpperCase().includes(filter.toUpperCase())
			);
		}

		// Filter by payment method
		if (paymentFilter !== "All") {
			filteredData = filteredData.filter(
				(data) => data.payment === paymentFilter
			);
		}

		setShowData(filteredData);
	}, [filter, paymentFilter, reportData]);

	// Handle location dropdown change
	const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		setFilter(event.target.value);
	};

	// Handle payment method dropdown change
	const handlePaymentFilterChange = (
		event: React.ChangeEvent<HTMLSelectElement>
	) => {
		setPaymentFilter(event.target.value);
	};

	// Handle deletion of a report
	const handleDeleteItem = async (reportId: number) => {
		if (window.confirm("Are you sure you want to delete this item?")) {
			try {
				await deleteReport(reportId); // Call API to delete
				const updatedReportData = showData.filter(
					(data) => data.reportId !== reportId
				);
				setShowData(updatedReportData); // Update UI
				setReportData(updatedReportData); // Update state
				onDelete(reportId); // Notify parent
			} catch (error) {
				console.error("Error deleting report:", error);
			}
		}
	};

	// Handle search input key up event
	const filterByLocation = () => {
		const input = (
			document.getElementById("myInput") as HTMLInputElement
		).value.toUpperCase();
		const filteredData = reportData.filter((data) =>
			data.location.toUpperCase().includes(input)
		);
		setShowData(filteredData);
	};

	// Export current visible data to Excel
	const handleExportToExcel = () => {
		// Format data for Excel
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
		XLSX.writeFile(workbook, "reports.xlsx"); // Download file
	};

	return (
		<div className="table-container">
			{/* Top section with title and export button */}
			<div
				style={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
				}}
			>
				<h2>Report Table</h2>
				<button onClick={handleExportToExcel}>Export to Excel</button>
			</div>

			{/* Search bar */}
			<input
				id="myInput"
				onKeyUp={filterByLocation}
				placeholder="Search for locations..."
				title="Type in a location"
				type="text"
			/>

			{/* Dropdown for location filter */}
			<select id="countriesDropdown" onChange={handleFilterChange}>
				<option>All</option>
				<option>Pieter</option>
				<option>Morne</option>
				<option>Cascade</option>
			</select>

			{/* Dropdown for payment filter */}
			<select id="paymentDropdown" onChange={handlePaymentFilterChange}>
				<option>All</option>
				<option>Not paid</option>
				<option>Paid by cash</option>
				<option>Paid by juice</option>
			</select>

			{/* Table displaying reports */}
			<table id="myTable">
				<thead>
					<tr className="header">
						<th>Location</th>
						<th>Date</th>
						<th>Pax</th>
						<th>Price</th>
						<th>Profit</th>
						<th></th> {/* For delete button */}
					</tr>
				</thead>
				<tbody>
					{showData.map((report) => (
						<tr key={report.reportId}>
							<td>{report.location}</td>
							<td>{new Date(report.date).toLocaleDateString()}</td>
							<td>{report.pax}</td>
							<td>{report.price}</td>
							<td>{report.total}</td>
							<td onClick={() => handleDeleteItem(report.reportId)}>
								<span className="deletecss">x</span> {/* Delete icon */}
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default ReportTable;
