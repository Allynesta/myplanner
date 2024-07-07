import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import DataForm from "../components/DataForm";
import Modal from "react-modal";

interface ReportData {
	id: number;
	location: string;
	description: string;
	date: Date;
	pax: number;
	price: number;
}

const Dashboard = () => {
	const [value, onChange] = useState<Date | null>(null);
	const [showForm, setShowForm] = useState(false);
	const [reportData, setReportData] = useState<ReportData[]>([]);

	const handleDateChange = (date: Date | null) => {
		// Update your state or perform any other necessary actions
		console.log(date);
		onChange(date);
		setShowForm(true);
	};

	const handleSubmit = (data: {
		location: string;
		description: string;
		pax: number;
		price: number;
	}) => {
		const newReport: ReportData = {
			id: Date.now(), // Generate a new ID
			location: data.location,
			description: data.description,
			date: value as Date,
			pax: data.pax,
			price: data.price,
		};
		const updatedReportData = [...reportData, newReport];
		setReportData(updatedReportData);
		localStorage.setItem("plannerData", JSON.stringify(reportData));
		setShowForm(false);
		onChange(null);
	};

	const tileContent = ({ date }: { date: Date }) => {
		const report = reportData.find(
			(report) => report.date.toLocaleDateString() === date.toLocaleDateString()
		);
		if (report) {
			return (
				<div>
					<span>{report.location}</span>
					<br />
					<span>{report.description}</span>
					<br />
					<span>Pax: {report.pax}</span>
					<br />
					<span>Price: {report.price}</span>
				</div>
			);
		}
		return null;
	};

	return (
		<div>
			<Calendar
				onChange={handleDateChange}
				value={value}
				className="custom-calendar"
				tileContent={tileContent}
			/>
			<Modal
				ariaHideApp={false}
				isOpen={showForm}
				onRequestClose={() => setShowForm(false)}
			>
				<DataForm onSubmit={handleSubmit} selectedDate={value as Date} />
			</Modal>
		</div>
	);
};

export default Dashboard;
