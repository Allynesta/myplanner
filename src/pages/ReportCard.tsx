import { useState, useEffect } from "react";
import Report from "../components/Report";

// Define the structure of the data each report will have
interface ReportData {
	id: number;
	location: string;
	description: string;
	date: Date;
	pax: number;
	price: number;
}

interface Props {
	reportData?: ReportData[]; // Make reportData optional
	onDelete: (id: number) => void;
}

const ReportCard: React.FC<Props> = ({ onDelete }) => {
	const [reportData, setReportData] = useState<ReportData[]>([]);

	useEffect(() => {
		// Retrieve data from localStorage
		const storedData = localStorage.getItem("plannerData");
		if (storedData) {
			setReportData(JSON.parse(storedData)); // Use data from localStorage if available
		}
	}, []);

	// Handle item deletion
	const handleDeleteItem = (id: number) => {
		const updatedReportData = reportData.filter((data) => data.id !== id);
		setReportData(updatedReportData);
		localStorage.setItem("plannerData", JSON.stringify(updatedReportData));
		onDelete(id);
	};

	return (
		<div>
			<Report
				onDelete={handleDeleteItem}
				reportData={reportData.map((data) => ({
					id: data.id,
					description: data.description,
					date: new Date(data.date),
					location: data.location,
					pax: data.pax,
					price: data.price,
				}))}
			/>
		</div>
	);
};

export default ReportCard;
