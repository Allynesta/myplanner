import React, { useState, useEffect, useCallback, Suspense, lazy } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import Modal from "react-modal";
import "../styles/dashboard.css";
import { saveReport, fetchReports } from "../services/authService";
import debounce from "lodash/debounce";

// Dynamically import DataForm component
const DataForm = lazy(() => import("../components/DataForm"));

interface ReportData {
	reportId: number;
	location: string;
	description: string;
	date: Date;
	pax: number;
	price: number;
	expense: number;
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
				// Check if reports are already cached
				const cachedReports = localStorage.getItem("reports");
				if (cachedReports) {
					setReportData(JSON.parse(cachedReports));
				} else {
					const reports = await fetchReports();
					setReportData(reports);
					localStorage.setItem("reports", JSON.stringify(reports));
				}
			} catch (error) {
				console.error("Error loading reports:", error);
			}
		};

		loadReports();
	}, []);

	const handleDateChange = useCallback(
		(value: Date | Date[] | null) => {
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
		},
		[selectedReport]
	);

	const handleSubmit = useCallback(
		async (data: {
			location: string;
			description: string;
			pax: number;
			price: number;
			expense: number;
		}) => {
			const newReport: ReportData = {
				...data,
				date: value as Date,
				reportId: Math.floor(Math.random() * 1000),
				total: data.price * data.pax - data.expense,
			};
			try {
				// Save report to the database
				await saveReport(newReport);

				// Update the report data state
				const updatedReportData = [...reportData, newReport];
				setReportData(updatedReportData);
				localStorage.setItem("reports", JSON.stringify(updatedReportData));

				setShowForm(false);
				setValue(null);
			} catch (error) {
				console.error("Error saving report:", error);
			}
		},
		[reportData, value]
	);

	const handleDateClick = useCallback(
		(date: Date) => {
			const reports = reportData.filter(
				(report) =>
					report.date.toLocaleDateString() === date.toLocaleDateString()
			);

			if (reports.length > 0) {
				setReportsForDate(reports);
				setShowForm(false);
			} else {
				setReportsForDate([]);
			}
			setValue(date);
			setSelectedReport(null);
		},
		[reportData]
	);

	const debouncedHandleDateChange = useCallback(
		debounce((value: Date | Date[] | null) => handleDateChange(value), 300),
		[handleDateChange]
	);

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
				onChange={(value) =>
					debouncedHandleDateChange(value as Date | Date[] | null)
				}
				value={value}
				className="custom-calendar"
				tileContent={tileContent}
			/>
			{showForm && (
				<Suspense fallback={<div>Loading...</div>}>
					<Modal isOpen={showForm} onRequestClose={() => setShowForm(false)}>
						<DataForm onSubmit={handleSubmit} selectedDate={value as Date} />
					</Modal>
				</Suspense>
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
							<ReportSummary
								key={report.reportId}
								report={report}
								onClick={setSelectedReport}
							/>
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
							<span>Expenses:</span> {selectedReport.expense}
						</div>
						<div>
							<span>Total:</span> {selectedReport.total}
						</div>
					</div>
				</Modal>
			)}
		</div>
	);
};

const ReportSummary = React.memo(
	({
		report,
		onClick,
	}: {
		report: ReportData;
		onClick: (report: ReportData) => void;
	}) => (
		<div className="report-summary" onClick={() => onClick(report)}>
			<p className="report-item">- {report.location}</p>
		</div>
	)
);

export default Dashboard;
