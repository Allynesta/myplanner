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
	// State variables
	const [value, setValue] = useState<Date | null>(null); // selected date
	const [showForm, setShowForm] = useState(false); // show data form modal
	const [reportData, setReportData] = useState<ReportData[]>([]); // report data
	const [selectedReport, setSelectedReport] = useState<ReportData | null>(null); // selected report

	useEffect(() => {
		// Load report data from local storage
		const storedData = localStorage.getItem("plannerData");
		if (storedData) {
			const parsedData: ReportData[] = JSON.parse(storedData).map(
				(report: { date: string | number | Date }) => ({
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
		if (value instanceof Date) {
			setShowForm(true); // open DataForm when date is selected
			setSelectedReport(null); // reset selected report when date changes
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
			id: Date.now(), // generate a new ID
			location: data.location,
			description: data.description,
			date: value as Date,
			pax: data.pax,
			price: data.price,
		};
		const updatedReportData = [...reportData, newReport];
		setReportData(updatedReportData);
		localStorage.setItem("plannerData", JSON.stringify(updatedReportData));
		setShowForm(false); // close DataForm after submission
		setValue(null);
	};

	// Tile content for calendar
	const tileContent = ({ date }: { date: Date }) => {
		const reports = reportData.filter((report) => {
			if (report.date instanceof Date) {
				return report.date.toLocaleDateString() === date.toLocaleDateString();
			} else {
				return false;
			}
		});
		return (
			<div>
				{reports.map((report) => (
					<div
						key={report.id}
						className="card"
						onClick={(e) => {
							e.stopPropagation(); // stop event propagation
							setShowForm(false); // close DataForm if it's open
							setSelectedReport(report); // open report details when card is clicked
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
			{showForm && !selectedReport && (
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
