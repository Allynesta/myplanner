import { useState, useEffect } from "react";
import ReportTable from "../components/ReportTable";
import { fetchReports } from "../services/authService";

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
	reportData: ReportData[]; // Make reportData optional
	onDelete: (reportId: number) => void;
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
	);
};

export default ReportPage;
