import { useState, useEffect } from "react";
import ReportTable from "../components/ReportTable";
import sampleReportData from "../data/sampleReportData";

// Define the structure of the data each report will have
interface ReportData {
	id: number;
	location: string;
	description: string;
	date: Date;
	pack: number;
	price: number;
}

interface Props {
	reportData?: ReportData[]; // Make reportData optional
	onDelete: (id: number) => void;
}

const ReportPage: React.FC<Props> = ({ reportData, onDelete }) => {
	const [data, setReportData] = useState<ReportData[]>([]);

	useEffect(() => {
		// Use sampleReportData if no reportData is provided
		setReportData(reportData || sampleReportData);
	}, [reportData]);

	const handleDelete = (id: number) => {
		const updatedData = data.filter((data) => data.id !== id);
		setReportData(updatedData);
		onDelete(id);
	};

	return (
		<div>
			<ReportTable reportData={data} onDelete={handleDelete} />
		</div>
	);
};

export default ReportPage;
