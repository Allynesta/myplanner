import { useEffect, useState } from "react";
import Calender from "../components/Calender";
import DataForm from "../components/DataForm";
import Report from "../components/Report";
// Define the structure of the data each report will have
interface ReportData {
	id: number;
	location: string;
	description: string;
	date: Date;
	pack: number;
	price: number;
}

const PlannerPage = () => {
	const [reportData, setReportData] = useState<ReportData[]>([]);
	const [selectedDate, setSelectedDate] = useState<Date | null>(null);

	const handleSubmit = (data: {
		location: string;
		description: string;
		pack: number;
		price: number;
	}) => {
		const newReport: ReportData = {
			id: reportData.length + 1, // Generate a new ID
			location: data.location,
			description: data.description,
			date: selectedDate ? selectedDate : new Date(),
			pack: data.pack,
			price: data.price,
		};
		const updatedReportData = [...reportData, newReport];
		setReportData(updatedReportData);
		localStorage.setItem("plannerData", JSON.stringify(updatedReportData));
		console.log(data);
	};

	const handleDateChange = (date: Date) => {
		console.log(date);
		setSelectedDate(date);
	};

	const handleDeleteItem = (id: number) => {
		const updatedReportData = reportData.filter((data) => data.id !== id);
		setReportData(updatedReportData);
		localStorage.setItem("plannerData", JSON.stringify(updatedReportData));
	};

	useEffect(() => {
		// Load stored data from localStorage
		const storedData = localStorage.getItem("plannerData");
		if (storedData) {
			setReportData(JSON.parse(storedData));
		}
	}, []);

	return (
		<div>
			<Calender onSelect={handleDateChange} />
			<DataForm onSubmit={handleSubmit} />
			<Report
				onDelete={handleDeleteItem}
				reportData={reportData.map((data) => ({
					id: data.id,
					description: data.description,
					date: new Date(data.date),
					location: data.location,
					pack: data.pack,
					price: data.price,
				}))}
			/>
		</div>
	);
};

export default PlannerPage;
