import { useEffect, useState } from "react";
import Calender from "../components/MyCalender";
import DataForm from "../components/DataForm";
// Define the structure of the data each report will have
interface ReportData {
	reportId: number;
	location: string;
	description: string;
	date: Date;
	pax: number;
	price: number;
}

const PlannerPage = () => {
	const [reportData, setReportData] = useState<ReportData[]>([]);
	const [selectedDate, setSelectedDate] = useState<Date | null>(null);
	const [formError, setFormError] = useState<string | null>(null);

	// Handle form submission
	const handleSubmit = (data: {
		location: string;
		description: string;
		pax: number;
		price: number;
	}) => {
		// Check if both date and form data are valid
		if (!selectedDate) {
			setFormError("Please select a date.");
			return;
		}
		if (
			!data.location ||
			!data.description ||
			data.pax <= 0 ||
			data.price <= 0
		) {
			setFormError("Please fill out all form fields correctly.");
			return;
		}

		const newReport: ReportData = {
			reportId: reportData.length + 1, // Generate a new ID
			location: data.location,
			description: data.description,
			date: selectedDate,
			pax: data.pax,
			price: data.price,
		};
		const updatedReportData = [...reportData, newReport];
		setReportData(updatedReportData);
		localStorage.setItem("plannerData", JSON.stringify(updatedReportData));
		setSelectedDate(null); // Clear selected date after submission
		setFormError(null); // Clear any previous errors
	};

	// Handle date change from calendar
	const handleDateChange = (date: Date) => {
		console.log(date);
		setSelectedDate(date);
		setFormError(null); // Clear error if date is selected
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
			<DataForm onSubmit={handleSubmit} selectedDate={selectedDate} />{" "}
			{/* Pass selectedDate to DataForm */}
			{formError && <div className="error-message">{formError}</div>}{" "}
			{/* Display error message if present */}
		</div>
	);
};

export default PlannerPage;
