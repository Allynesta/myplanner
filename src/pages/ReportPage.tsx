import { useState, useEffect } from "react";
import ReportTable from "../components/ReportTable";

// Define the structure of the data each report will have
interface ReportData {
	id: number;
	location: string;
	description: string;
	date: Date;
	pax: number;
	price: number;
	total: number;
}

interface Props {
	reportData?: ReportData[]; // Make reportData optional
	onDelete: (id: number) => void;
}

const ReportPage: React.FC<Props> = ({ onDelete }) => {
	const [data, setData] = useState<ReportData[]>([]);

	useEffect(() => {
		// Retrieve data from localStorage
		const storedData = localStorage.getItem("plannerData");
		if (storedData) {
			setData(JSON.parse(storedData)); // Use data from localStorage if available
		}
	}, []);

	const handleDelete = (id: number) => {
		const updatedData = data.filter((data) => data.id !== id);
		setData(updatedData);
		localStorage.setItem("plannerData", JSON.stringify(updatedData));
		onDelete(id);
	};

	return (
		<div>
			<ReportTable reportData={data} onDelete={handleDelete} />
		</div>
	);
};

export default ReportPage;
