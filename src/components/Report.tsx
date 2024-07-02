import ReportItem from "./ReportItem";
import React from "react";
import "../styles/report.css";

// Define the structure of the data each report will have
interface ReportData {
	id: number;
	location: string;
	description: string;
	date: Date;
	pax: number;
	price: number;
}

// Define the props that the Report component will receive
interface Props {
	reportData: ReportData[];
	onDelete: (id: number) => void;
}

// Report component definition
const Report: React.FC<Props> = ({ reportData, onDelete }) => {
	return (
		<div>
			<h2>Report</h2>
			<ul>
				{/* Iterate over reportData and render a ReportItem for each item */}
				{reportData.map((data) => (
					<ReportItem key={data.id} onDelete={onDelete} data={data} />
				))}
			</ul>
		</div>
	);
};

export default Report;
