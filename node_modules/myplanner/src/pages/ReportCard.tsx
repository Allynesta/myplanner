import { useState, useEffect, useCallback } from "react";
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
	expense1: number;
	expense2: number;
	expense3: number;
	expense4: number;
	expense5: number;
	payment: string;
	total: number;
}

interface Props {
	onDelete: (reportId: number) => void;
}

const ReportCard: React.FC<Props> = ({ onDelete }) => {
	const [reportData, setReportData] = useState<ReportData[]>([]);
	const [error, setError] = useState<string | null>(null);

	// Fetch data using useEffect
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

	// Memoized callback to handle report deletion
	const handleDeleteItem = useCallback(
		async (id: number) => {
			try {
				await deleteReport(id);
				setReportData((prevData) =>
					prevData.filter((data) => data.reportId !== id)
				);
				onDelete(id);
			} catch (error) {
				console.error("Error deleting report:", error);
				setError("Failed to delete report.");
			}
		},
		[onDelete]
	);

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
									expense1: data.expense1,
									expense2: data.expense2,
									expense3: data.expense3,
									expense4: data.expense4,
									expense5: data.expense5,
									payment: data.payment,
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
