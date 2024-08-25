import { useState, useEffect } from "react";
import Report from "../components/Report";
import { fetchReports, deleteReport } from "../services/authService";
import "../styles/reportcard.css";

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

const ReportCard: React.FC<Props> = ({ onDelete }) => {
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
			await deleteReport(id);
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
		<>
			<h2>Report Card</h2>
			{error && <p className="error">{error}</p>}
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
									expense: data.expense,
									total: data.total,
								}))}
							/>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default ReportCard;
