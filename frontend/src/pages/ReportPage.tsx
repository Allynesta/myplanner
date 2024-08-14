import { useState, useEffect } from "react";
<<<<<<< HEAD:frontend/src/pages/ReportPage.tsx
import ReportTable from "../components/ReportTable";
import { fetchReports } from "../services/authService";
=======
import Report from "../components/Report";
import { fetchReports, deleteReport } from "../services/authService"; // Import the updateReport and deleteReport functions
import "../styles/reportcard.css";
>>>>>>> 116dcdaa14960be01c65c3d2cea51dccf1680437:src/pages/ReportCard.tsx

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

interface Props {
<<<<<<< HEAD:frontend/src/pages/ReportPage.tsx
	reportData: ReportData[]; // Make reportData optional
	onDelete: (reportId: number) => void;
=======
	onDelete: (reportId: number) => void;
	report: ReportData[];
>>>>>>> 116dcdaa14960be01c65c3d2cea51dccf1680437:src/pages/ReportCard.tsx
}

const ReportPage: React.FC<Props> = ({ onDelete }) => {
	const [reportData, setReportData] = useState<ReportData[]>([]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const data = await fetchReports();
				setReportData(data);
			} catch (error) {
				console.error("Error fetching reports:", error);
			}
		};

		fetchData();
	}, []);

	// Handle item deletion
<<<<<<< HEAD:frontend/src/pages/ReportPage.tsx
	const handleDeleteItem = (id: number) => {
		const updatedReportData = reportData.filter((data) => data.reportId !== id);
		setReportData(updatedReportData);
		// Optionally, you can also update the backend here if needed
		onDelete(id);
	};

	return (
		<div>
			<ReportTable
				reportData={reportData.map((data) => ({
					reportId: data.reportId,
					description: data.description,
					date: new Date(data.date),
					location: data.location,
					pax: data.pax,
					price: data.price,
					total: data.total,
				}))}
				onDelete={handleDeleteItem}
			/>
		</div>
=======
	const handleDeleteItem = async (id: number) => {
		try {
			await deleteReport(id); // Call the delete function
			const updatedReportData = reportData.filter(
				(data) => data.reportId !== id
			);
			setReportData(updatedReportData);
			onDelete(id);
		} catch (error) {
			console.error("Error deleting report:", error);
		}
	};

	return (
		<>
			<h2>Report Card</h2>
			<div className="card-row">
				<div className="card-column">
					<div className="card">
						<div className="card-info">
							<Report
								onDelete={handleDeleteItem}
								reportData={reportData.map((data) => ({
									reportId: data.reportId,
									description: data.description,
									date: new Date(data.date),
									location: data.location,
									pax: data.pax,
									price: data.price,
									total: data.total,
								}))}
							/>
						</div>
					</div>
				</div>
			</div>
		</>
>>>>>>> 116dcdaa14960be01c65c3d2cea51dccf1680437:src/pages/ReportCard.tsx
	);
};

export default ReportPage;
