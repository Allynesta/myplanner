import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import DataForm from "../components/DataForm";
import Modal from "react-modal";
import "../styles/dashboard.css";

// Interface for report data
interface ReportData {
	id: number;
	location: string;
	description: string;
	date: Date;
	pax: number;
	price: number;
	total: number;
}

const Dashboard = () => {
	// State for selected date, show form, report data, selected report, and reports for date
	const [value, setValue] = useState<Date | null>(null);
	const [showForm, setShowForm] = useState(false);
	const [reportData, setReportData] = useState<ReportData[]>([]);
	const [selectedReport, setSelectedReport] = useState<ReportData | null>(null);
	const [reportsForDate, setReportsForDate] = useState<ReportData[]>([]);

	// Load report data from local storage on mount
	useEffect(() => {
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

	// Handle date change, open DataForm if no report is selected
	const handleDateChange = (value: Date | Date[] | null) => {
		// If the selected date is an array (e.g., a range of dates), use the first date
		if (Array.isArray(value)) {
			setValue(value[0]);
		} else {
			// Otherwise, use the single selected date
			setValue(value);
		}
		if (!selectedReport) {
			setShowForm(true);
		} else {
			setSelectedReport(null);
		}
	};

	// Handle form submission, close DataForm and add new report to report data
	const handleSubmit = (data: {
		location: string;
		description: string;
		pax: number;
		price: number;
	}) => {
		const newReport: ReportData = {
			...data,
			date: value as Date,
			id: Date.now(),
			total: 0,
		};
		setReportData([...reportData, newReport]);
		localStorage.setItem(
			"plannerData",
			JSON.stringify([...reportData, newReport])
		);
		setShowForm(false);
		setValue(null);
	};

	// Handle click on date with reports, show reports for date
	const handleDateClick = (date: Date) => {
		const reports = reportData.filter(
			(report) => report.date.toLocaleDateString() === date.toLocaleDateString()
		);

		if (reports.length > 0) {
			setReportsForDate(reports);
			setShowForm(false);
			setValue(date);
		} else {
			setReportsForDate([]);
		}
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
						e.stopPropagation(); // prevent click event from bubbling up
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
				onChange={(value) => handleDateChange(value as Date | Date[] | null)} // Handle date change
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
								key={report.id}
								className="report-summary"
								onClick={() => setSelectedReport(report)}
							>
								<span>
									<p className="report-item">- {report.location}</p>
									<br />
								</span>
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
							<span>Price:</span>{" "}
							{
								(selectedReport.total =
									selectedReport.price * selectedReport.pax)
							}
						</div>
					</div>
				</Modal>
			)}
		</div>
	);
};

export default Dashboard;
