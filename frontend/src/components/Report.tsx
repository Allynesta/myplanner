import ReportItem from "./ReportItem";
import React from "react";
import "../styles/report.css";

// Define the structure of the data each report will have
interface ReportData {
	reportId: number;
	location: string;
	description: string;
	date: Date;
	pax: number;
	price: number;
	total: number;
}

// Define the props that the Report component will receive
interface Props {
	reportData: ReportData[];
	onDelete: (reportId: number) => void;
}

// Report component definition
const Report: React.FC<Props> = ({ reportData, onDelete }) => {
	return (
		<div>
			<ul className="report-list">
				{/* Iterate over reportData and render a ReportItem for each item */}
				{reportData.map((data) => (
					<li key={data.reportId}>
						{" "}
						{/* Key for each list item */}
						<div className="report-item-container">
							{" "}
							{/* Use a container div */}
							<ReportItem onDelete={onDelete} data={data} />
						</div>
					</li>
				))}
			</ul>
		</div>
	);
};

export default Report;
