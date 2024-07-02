import { useEffect, useState } from "react";

// Define the structure of the data each report will have
interface ReportData {
	id: number;
	location: string;
	description: string;
	date: Date;
	pack: number;
	price: number;
}

interface Props {
	reportData: ReportData[];
	onDelete: (id: number) => void;
}

const ReportTable: React.FC<Props> = ({ reportData, onDelete }) => {
	const [showData, setShowData] = useState<ReportData[]>(reportData);

	const handleDeleteItem = (id: number) => {
		const updatedReportData = showData.filter((data) => data.id !== id);
		setShowData(updatedReportData);
		localStorage.setItem("plannerData", JSON.stringify(updatedReportData));
		onDelete(id);
	};

	useEffect(() => {
		const storedData = localStorage.getItem("plannerData");
		if (storedData) {
			setShowData(JSON.parse(storedData));
		} else {
			setShowData(reportData);
		}
	}, [reportData]);

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

			<table id="myTable">
				<thead>
					<tr className="header">
						<th style={{ width: "20%" }}>ID</th>
						<th style={{ width: "20%" }}>Location</th>
						<th style={{ width: "20%" }}>Description</th>
						<th style={{ width: "20%" }}>Date</th>
						<th style={{ width: "10%" }}>Pack</th>
						<th style={{ width: "10%" }}>Price</th>
					</tr>
				</thead>
				<tbody>
					{showData.map((data) => (
						<tr key={data.id}>
							<td>{data.id}</td>
							<td>{data.location}</td>
							<td>{data.description}</td>
							<td>{new Date(data.date).toLocaleDateString()}</td>
							<td>{data.pack}</td>
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
