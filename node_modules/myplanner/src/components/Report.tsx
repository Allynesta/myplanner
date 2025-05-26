/**
 * Report Component
 *
 * This component displays a list of reports.
 * Allows editing of individual reports and updates the UI and backend accordingly.
 * Also handles deletion of reports via the `onDelete` prop.
 */

import ReportItem from "./ReportItem"; // Child component for individual report
import React, { useEffect, useState } from "react";
import "../styles/report.css"; // CSS for report styling
import { updateReport } from "../services/authService"; // Function to update report data

// Type definition for a single report
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

// Props expected by the Report component
interface Props {
	reportData: ReportData[]; // List of reports
	onDelete: (reportId: number) => void; // Function to delete a report
}

const Report: React.FC<Props> = ({ reportData, onDelete }) => {
	const [reports, setReports] = useState(reportData); // Local state for report list

	// Whenever reportData changes from parent, update local state
	useEffect(() => {
		setReports(reportData);
	}, [reportData]);

	// Handle editing a report
	const handleEdit = async (
		reportId: number,
		updatedData: Partial<ReportData>
	) => {
		try {
			// If values for calculating total are provided, compute the new total
			if (
				updatedData.pax !== undefined &&
				updatedData.price !== undefined &&
				updatedData.expense1 !== undefined &&
				updatedData.expense2 !== undefined &&
				updatedData.expense3 !== undefined &&
				updatedData.expense4 !== undefined &&
				updatedData.expense5 !== undefined
			) {
				updatedData.total =
					updatedData.pax * updatedData.price -
					(updatedData.expense1 +
						updatedData.expense2 +
						updatedData.expense3 +
						updatedData.expense4 +
						updatedData.expense5);
			}

			// Update the report in the database
			await updateReport(reportId, updatedData);

			// Update the report in the local UI
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
				{reports.map((data) => (
					<li key={data.reportId}>
						<div className="report-item-container">
							{/* Render each report using ReportItem */}
							<ReportItem onDelete={onDelete} data={data} onEdit={handleEdit} />
						</div>
					</li>
				))}
			</ul>
		</div>
	);
};

export default Report;
