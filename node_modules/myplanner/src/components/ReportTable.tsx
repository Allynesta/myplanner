import { useEffect, useState } from "react";
import * as XLSX from "xlsx"; // Import the library
import "../styles/reporttable.css";
import { fetchReports, deleteReport } from "../services/authService"; // Import the deleteReport function

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

	const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		setFilter(event.target.value);
	};

	const handlePaymentFilterChange = (
		event: React.ChangeEvent<HTMLSelectElement>
	) => {
		setPaymentFilter(event.target.value);
	};

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
		<div className="table-container">
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
			<input
				id="myInput"
				onKeyUp={filterByLocation}
				placeholder="Search for locations..."
				title="Type in a location"
				type="text"
			/>
			<select id="countriesDropdown" onChange={handleFilterChange}>
				<option>All</option>
				<option>Pieter</option>
				<option>Morne</option>
				<option>Cascade</option>
			</select>
			<select id="paymentDropdown" onChange={handlePaymentFilterChange}>
				<option>All</option>
				<option>Not paid</option>
				<option>Paid by cash</option>
				<option>Paid by juice</option>
			</select>
			<table id="myTable">
				<thead>
					<tr className="header">
						<th>Location</th>
						<th>Date</th>
						<th>Pax</th>
						<th>Price</th>
						<th>Total</th>
						<th></th>
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
								<span className="deletecss">x</span>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default ReportTable;
