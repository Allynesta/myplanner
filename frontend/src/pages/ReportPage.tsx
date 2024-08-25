import { useState, useEffect } from "react";
import ReportTable from "../components/ReportTable";
import { fetchReports, deleteReport } from "../services/authService";

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

interface Props {
	onDelete: (reportId: number) => void;
}

const ReportPage: React.FC<Props> = ({ onDelete }) => {
	const [reportData, setReportData] = useState<ReportData[]>([]);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const data = await fetchReports();
				setReportData(data);
			} catch (error) {
				console.error("Error fetching reports:", error);
				setError("Failed to load reports.");
			}
		};

		fetchData();
	}, []);

	const handleDeleteItem = async (id: number) => {
		try {
			await deleteReport(id); // Ensure backend is updated
			const updatedReportData = reportData.filter(
				(data) => data.reportId !== id
			);
			setReportData(updatedReportData);
			onDelete(id);
		} catch (error) {
			console.error("Error deleting report:", error);
			setError("Failed to delete report.");
		}
	};

	return (
		<div>
			{error && <p className="error">{error}</p>}
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
	);
};

export default ReportPage;
