import ReportItem from "./ReportItem";
import React, { useEffect, useState } from "react";
import "../styles/report.css";
import { updateReport } from "../services/authService";

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

interface Props {
	reportData: ReportData[];
	onDelete: (reportId: number) => void;
}

const Report: React.FC<Props> = ({ reportData, onDelete }) => {
	const [reports, setReports] = useState(reportData);

	useEffect(() => {
		setReports(reportData);
	}, [reportData]);

	const handleEdit = async (
		reportId: number,
		updatedData: Partial<ReportData>
	) => {
		try {
			if (
				updatedData.pax !== undefined &&
				updatedData.price !== undefined &&
				updatedData.expense !== undefined
			) {
				updatedData.total =
					updatedData.pax * updatedData.price - updatedData.expense;
			}

			await updateReport(reportId, updatedData);

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
							<ReportItem onDelete={onDelete} data={data} onEdit={handleEdit} />
						</div>
					</li>
				))}
			</ul>
		</div>
	);
};

export default Report;
