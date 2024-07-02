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
}

const ReportTable: React.FC<Props> = ({ reportData }) => {
	const [showData, setShowData] = useState<ReportData[]>([]);

	useEffect(() => {
		// Load stored data from localStorage
		const storedData = localStorage.getItem("plannerData");
		if (storedData) {
			setShowData(JSON.parse(storedData));
		}
	}, [reportData]);

	const myFunction = () => {
		const input = (
			document.getElementById("myInput") as HTMLInputElement
		).value.toUpperCase();
		const table = document.getElementById("myTable") as HTMLTableElement;
		const tr = table.getElementsByTagName("tr");

		for (let i = 1; i < tr.length; i++) {
			const td = tr[i].getElementsByTagName("td")[0];
			if (td) {
				const txtValue = td.textContent || td.innerText;
				if (txtValue.toUpperCase().indexOf(input) > -1) {
					tr[i].style.display = "";
				} else {
					tr[i].style.display = "none";
				}
			}
		}
	};

	return (
		<div>
			<input
				id="myInput"
				onKeyUp={myFunction}
				placeholder="Search for names.."
				title="Type in a name"
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
							<td>{data.location}</td>
							<td>{data.description}</td>
							<td>{new Date(data.date).toLocaleDateString()}</td>
							<td>{data.pack}</td>
							<td>{data.price}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default ReportTable;
