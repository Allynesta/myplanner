import ReportItem from "./ReportItem";
import React, { useEffect, useState } from "react";
import "../styles/report.css";
import { updateReport } from "../services/authService";

// Define the structure of the data each report will have
interface ReportData {
	reportId: number;
	location: string;
	description: string;
	date: Date;
	pax: number;
	price: number;
	expense: number;
	total: number;
}

// Define the props that the Report component will receive
interface Props {
	reportData: ReportData[];
	onDelete: (reportId: number) => void;
}

// Report component definition
const Report: React.FC<Props> = ({ reportData, onDelete }) => {
	const [reports, setReports] = useState(reportData);

	// Update the local state whenever reportData prop changes
	useEffect(() => {
		setReports(reportData);
	}, [reportData]);

	const handleEdit = async (
		reportId: number,
		updatedData: Partial<ReportData>
	) => {
		try {
			// Calculate the new total if necessary fields are provided
			if (
				updatedData.pax !== undefined &&
				updatedData.price !== undefined &&
				updatedData.expense !== undefined
			) {
				updatedData.total =
					updatedData.pax * updatedData.price - updatedData.expense;
			}

			// Update the report on the backend
			await updateReport(reportId, updatedData);

			// Update the state with the edited report
			setReports((prevReports) =>
				prevReports.map((report) =>
					report.reportId === reportId ? { ...report, ...updatedData } : report
				)
			);
		} catch (error) {
			console.error("Failed to update the report:", error);
		}
	};

	return (
		<div>
			<ul className="report-list">
				{/* Iterate over reportData and render a ReportItem for each item */}
				{reports.map((data) => (
					<li key={data.reportId}>
						{" "}
						{/* Key for each list item */}
						<div className="report-item-container">
							{" "}
							{/* Use a container div */}
							<ReportItem onDelete={onDelete} data={data} onEdit={handleEdit} />
						</div>
					</li>
				))}
			</ul>
		</div>
	);
};

export default Report;
