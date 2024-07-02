import { useEffect, useState } from "react";
import "../styles/reporttable.css";

// Define the structure of the data each report will have
interface ReportData {
	id: number;
	location: string;
	description: string;
	date: Date;
	pax: number;
	price: number;
}

interface Props {
	reportData: ReportData[];
	onDelete: (id: number) => void;
}

const ReportTable: React.FC<Props> = ({ reportData, onDelete }) => {
	const [showData, setShowData] = useState<ReportData[]>(reportData);
	const [filter, setFilter] = useState<string>("All");

	useEffect(() => {
		// Filter the data based on the selected filter value
		if (filter === "All") {
			setShowData(reportData);
		} else {
			setShowData(
				reportData.filter((data) =>
					data.location.toUpperCase().includes(filter.toUpperCase())
				)
			);
		}
	}, [filter, reportData]);

	const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		setFilter(event.target.value);
	};

	const handleDeleteItem = (id: number) => {
		if (window.confirm("Are you sure you want to delete this item?")) {
			const updatedReportData = showData.filter((data) => data.id !== id);
			setShowData(updatedReportData);
			localStorage.setItem("plannerData", JSON.stringify(updatedReportData));
			onDelete(id);
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
			<input
				id="myInput"
				onKeyUp={filterByLocation}
				placeholder="Search for locations.."
				title="Type in a location"
				type="text"
			/>

			<div>
				<select id="countriesDropdown" onChange={handleFilterChange}>
					<option>All</option>
					<option>Pieter</option>
					<option>Morne</option>
					<option>Cascade</option>
				</select>
			</div>

			<table id="myTable">
				<thead>
					<tr className="header">
						<th style={{ width: "20%" }}>Location</th>
						<th style={{ width: "20%" }}>Date</th>
						<th style={{ width: "20%" }}>Pax</th>
						<th style={{ width: "20%" }}>Price</th>
						<th style={{ width: "20%" }}></th>
					</tr>
				</thead>
				<tbody>
					{showData.map((data) => (
						<tr key={data.id}>
							<td>{data.location}</td>
							<td>{new Date(data.date).toLocaleDateString()}</td>
							<td>{data.pax}</td>
							<td>{data.price}</td>
							<td>
								<button onClick={() => handleDeleteItem(data.id)}>x</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default ReportTable;
