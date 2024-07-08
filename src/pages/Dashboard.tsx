import { useState, useEffect } from "react";
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
	const [value, setValue] = useState<Date | null>(null);
	const [showForm, setShowForm] = useState(false);
	const [reportData, setReportData] = useState<ReportData[]>([]);

	useEffect(() => {
		const storedData = localStorage.getItem("plannerData");
		if (storedData) {
			const parsedData: ReportData[] = JSON.parse(storedData).map(
				(report: ReportData) => ({
					...report,
					date: new Date(report.date),
				})
			);
			setReportData(parsedData);
		}
	}, []);

	const handleDateChange = (value: Date | Date[] | null) => {
		if (Array.isArray(value)) {
			setValue(value[0]);
		} else {
			setValue(value);
		}
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
		localStorage.setItem("plannerData", JSON.stringify(updatedReportData));
		setShowForm(false);
		setValue(null);
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
				onChange={(value) => handleDateChange(value as Date | Date[] | null)}
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
