import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import DataForm from "../components/DataForm";
import Modal from "react-modal";
import "../styles/dashboard.css";
import { saveReport, fetchReports } from "../services/authService";

interface ReportData {
	reportId: number;
	location: string;
	description: string;
	date: Date;
	pax: number;
	price: number;
	total: number;
}

Modal.setAppElement("#root"); // or the ID of your root element

const Dashboard = () => {
	const [value, setValue] = useState<Date | null>(null);
	const [showForm, setShowForm] = useState(false);
	const [reportData, setReportData] = useState<ReportData[]>([]);
	const [selectedReport, setSelectedReport] = useState<ReportData | null>(null);
	const [reportsForDate, setReportsForDate] = useState<ReportData[]>([]);

	useEffect(() => {
		const loadReports = async () => {
			try {
				// Fetch reports from the database
				const reports = await fetchReports();
				setReportData(reports);
			} catch (error) {
				console.error("Error loading reports:", error);
			}
		};

		loadReports();
	}, []);

	const handleDateChange = (value: Date | Date[] | null) => {
		if (Array.isArray(value)) {
			setValue(value[0]);
		} else {
			setValue(value);
		}
		if (!selectedReport) {
			setShowForm(true);
		} else {
			setSelectedReport(null);
		}
	};

	const handleSubmit = async (data: {
		location: string;
		description: string;
		pax: number;
		price: number;
	}) => {
		const newReport: ReportData = {
			...data,
			date: value as Date,
			reportId: reportData.length + 1,
			total: data.price * data.pax,
		};
		try {
			// Save report to the database
			await saveReport(newReport);

			// Update the report data state
			const updatedReportData = [...reportData, newReport];
			setReportData(updatedReportData);

			setShowForm(false);
			setValue(null);
		} catch (error) {
			console.error("Error saving report:", error);
		}
	};

	const handleDateClick = (date: Date) => {
		const reports = reportData.filter(
			(report) => report.date.toLocaleDateString() === date.toLocaleDateString()
		);

		if (reports.length > 0) {
			setReportsForDate(reports);
			setShowForm(false);
		} else {
			setReportsForDate([]);
		}
		setValue(date);
		setSelectedReport(null);
	};

	const tileContent = ({ date, view }: { date: Date; view: string }) => {
		if (view === "month") {
			const reports = reportData.filter(
				(report) =>
					report.date.toLocaleDateString() === date.toLocaleDateString()
			);
			return reports.length > 0 ? (
				<div
					className="indicator"
					onClick={(e) => {
						e.stopPropagation();
						handleDateClick(date);
					}}
				>
					<div className="indicator-box"></div>
				</div>
			) : (
				<div
					className="empty-indicator"
					onClick={() => setShowForm(true)}
				></div>
			);
		}
		return null;
	};

	return (
		<div className="dashboard">
			<h2>Dashboard</h2>
			<Calendar
				onChange={(value) => handleDateChange(value as Date | Date[] | null)}
				value={value}
				className="custom-calendar"
				tileContent={tileContent}
			/>
			{showForm && (
				<Modal isOpen={showForm} onRequestClose={() => setShowForm(false)}>
					<DataForm onSubmit={handleSubmit} selectedDate={value as Date} />
				</Modal>
			)}
			{reportsForDate.length > 0 && (
				<Modal
					isOpen={reportsForDate.length > 0}
					onRequestClose={() => setReportsForDate([])}
				>
					<div>
						<h2>
							Reports for {value?.toLocaleDateString() ?? "date selected"}
						</h2>
						{reportsForDate.map((report) => (
							<div
								key={report.reportId}
								className="report-summary"
								onClick={() => setSelectedReport(report)}
							>
								<p className="report-item">- {report.location}</p>
							</div>
						))}
					</div>
				</Modal>
			)}
			{selectedReport && (
				<Modal
					isOpen={!!selectedReport}
					onRequestClose={() => setSelectedReport(null)}
				>
					<h2>Details - {selectedReport.location}</h2>
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
						<div>
							<span>Total:</span> {selectedReport.price * selectedReport.pax}
						</div>
					</div>
				</Modal>
			)}
		</div>
	);
};

export default Dashboard;
