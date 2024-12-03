import { useEffect, useState } from "react";
import "../styles/reporttable.css";
import { fetchReports, deleteReport } from "../services/authService"; // Import the deleteReport function

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
				setShowData(data); // Set initial data
			} catch (error) {
				console.error("Error fetching reports:", error);
			}
		};

		fetchData();
	}, []);

	useEffect(() => {
		let filteredData = [...reportData];

		// Apply location filter
		if (filter !== "All") {
			filteredData = filteredData.filter((data) =>
				data.location.toUpperCase().includes(filter.toUpperCase())
			);
		}

		// Apply payment filter
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

	// Add a handler for changing the payment filter
	const handlePaymentFilterChange = (
		event: React.ChangeEvent<HTMLSelectElement>
	) => {
		setPaymentFilter(event.target.value);
	};

	const handleDeleteItem = async (reportId: number) => {
		if (window.confirm("Are you sure you want to delete this item?")) {
			try {
				console.log(`Attempting to delete report with ID: ${reportId}`); // Log the id being deleted
				await deleteReport(reportId); // Call the delete function
				const updatedReportData = showData.filter(
					(data) => data.reportId !== reportId
				);
				setShowData(updatedReportData);
				setReportData(updatedReportData); // Update the full dataset
				onDelete(reportId); // Notify parent component of the deletion
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

	return (
		<div>
			<h2>Report Table</h2>
			<input
				id="myInput"
				onKeyUp={filterByLocation}
				placeholder="Search for locations.."
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
						<th style={{ width: "25%" }}>Location</th>
						<th style={{ width: "25%" }}>Date</th>
						<th style={{ width: "15%" }}>Pax</th>
						<th style={{ width: "20%" }}>Price</th>
						<th style={{ width: "20%" }}>Total</th>
						<th style={{ width: "15%" }}></th>
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
