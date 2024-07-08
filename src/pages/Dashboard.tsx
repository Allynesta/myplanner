import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import DataForm from "../components/DataForm";
import Modal from "react-modal";
import "../styles/dashboard.css";

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
	const [selectedReport, setSelectedReport] = useState<ReportData | null>(null);

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

	// Handle date change, open DataForm
	const handleDateChange = (value: Date | Date[] | null) => {
		if (Array.isArray(value)) {
			setValue(value[0]);
		} else {
			setValue(value);
		}
		if (!selectedReport) {
			setShowForm(true);
		} else {
			setSelectedReport(null); // Reset selected report when date changes
		}
	};

	// Handle form submission, close DataForm
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
		setShowForm(false); // Close DataForm after submission
		setValue(null);
	};

	const tileContent = ({ date }: { date: Date }) => {
		const reports = reportData.filter(
			(report) => report.date.toLocaleDateString() === date.toLocaleDateString()
		);
		return (
			<div>
				{reports.map((report) => (
					<div
						key={report.id}
						className="card"
						onClick={() => {
							setSelectedReport(report); // Open report details when card is clicked
							setShowForm(false); // Close DataForm if it's open
						}}
					>
						<span>{report.location}</span>
					</div>
				))}
			</div>
		);
	};

	return (
		<div className="dashboard">
			<Calendar
				onChange={(value) => handleDateChange(value as Date | Date[] | null)}
				value={value}
				className="custom-calendar"
				tileContent={tileContent}
			/>
			{showForm && (
				<Modal
					ariaHideApp={false}
					isOpen={showForm}
					onRequestClose={() => setShowForm(false)}
				>
					<DataForm onSubmit={handleSubmit} selectedDate={value as Date} />
				</Modal>
			)}
			{selectedReport && (
				<Modal
					ariaHideApp={false}
					isOpen={!!selectedReport}
					onRequestClose={() => setSelectedReport(null)}
				>
					<div className="card">
						<div>
							<span>Location:</span> {selectedReport.location}
						</div>
						<div>
							<span>Description:</span> {selectedReport.description}
						</div>
						<div>
							<span>Pax:</span> {selectedReport.pax}
						</div>
						<div>
							<span>Price:</span> {selectedReport.price}
						</div>
					</div>
				</Modal>
			)}
		</div>
	);
};

export default Dashboard;
