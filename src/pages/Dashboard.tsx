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
	const [reportsForDate, setReportsForDate] = useState<ReportData[]>([]);

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

	// Tile content for the calendar
	const tileContent = ({ date, view }: { date: Date; view: string }) => {
		if (view === "month") {
			const reports = reportData.filter((report) => {
				if (report.date instanceof Date) {
					return report.date.toLocaleDateString() === date.toLocaleDateString(); // Check if the report date matches the tile date
				} else {
					return false;
				}
			});
			return reports.length > 0 ? ( // If there are reports for this date, display an indicator
				<div className="indicator">
					<div className="indicator-box"></div>
				</div>
			) : null; // Return null if no reports for this date
		}
		return null; // Return null if view is not month
	};

	// Handle click on date with reports
	const handleDateClick = (date: Date) => {
		const reports = reportData.filter(
			(report) => report.date.toLocaleDateString() === date.toLocaleDateString()
		);
		if (reports.length > 0) {
			setReportsForDate(reports);
		} else {
			setReportsForDate([]);
		}
		setShowForm(false); // Close DataForm if it's open
		setSelectedReport(null);
	};

	return (
		<div className="dashboard">
			<Calendar
				onClickDay={handleDateClick}
				onChange={(value) => handleDateChange(value as Date | Date[] | null)} // Handle date change
				value={value} // Selected date
				className="custom-calendar"
				tileContent={tileContent} // Content for each tile
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
			{reportsForDate.length > 0 && (
				<Modal
					ariaHideApp={false}
					isOpen={reportsForDate.length > 0}
					onRequestClose={() => setReportsForDate([])}
				>
					<div>
						<h2>Reports for {value?.toLocaleDateString()}</h2>
						{reportsForDate.map((report) => (
							<div
								key={report.id} // Unique key for each report
								className="report-summary"
								onClick={() => setSelectedReport(report)}
							>
								<span>{report.location}</span>
							</div>
						))}
					</div>
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
