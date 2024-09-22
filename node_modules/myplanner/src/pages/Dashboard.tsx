import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import DataForm from "../components/DataForm";
import Modal from "react-modal";
import "../styles/dashboard.css";

import {
	saveReport,
	fetchReports,
	updateReport,
} from "../services/authService";

interface ReportData {
	reportId: number;
	location: string;
	description: string;
	date: Date;
	pax: number;
	price: number;
	expense1: number;
	expense2: number;
	expense3: number;
	expense4: number;
	expense5: number;
	payment: string;
	total: number;
}

interface Props {
	onEdit: (reportId: number, updatedData: Partial<ReportData>) => void;
}

Modal.setAppElement("#root"); // or the ID of your root element

const Dashboard: React.FC<Props> = () => {
	const [value, setValue] = useState<Date | null>(null);
	const [showForm, setShowForm] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
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
		expense1: number;
		expense2: number;
		expense3: number;
		expense4: number;
		expense5: number;
		payment: string;
	}) => {
		const newReport: ReportData = {
			...data,
			date: value as Date,
			reportId: Math.floor(Math.random() * 1000),
			total:
				data.price * data.pax -
				(data.expense1 +
					data.expense2 +
					data.expense3 +
					data.expense4 +
					data.expense5),
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

	const handleEdit = async (updatedData: Partial<ReportData>) => {
		if (selectedReport) {
			const updatedReport = {
				...selectedReport,
				...updatedData,
			};

			// Ensure total is recalculated
			if (
				updatedReport.pax !== undefined &&
				updatedReport.price !== undefined &&
				updatedReport.expense1 !== undefined &&
				updatedReport.expense2 !== undefined &&
				updatedReport.expense3 !== undefined &&
				updatedReport.expense4 !== undefined &&
				updatedReport.expense5 !== undefined
			) {
				updatedReport.total =
					updatedReport.pax * updatedReport.price -
					(updatedReport.expense1 +
						updatedReport.expense2 +
						updatedReport.expense3 +
						updatedReport.expense4 +
						updatedReport.expense5);
			}

			await updateReport(selectedReport.reportId, updatedReport);

			const updatedReports = reportData.map((report) =>
				report.reportId === selectedReport.reportId ? updatedReport : report
			);

			setReportData(updatedReports);

			setIsEditing(false); // Close the modal
			setSelectedReport(null); // Clear the selection
		}
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
					<h2>Details - {selectedReport.location} </h2>

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
							<span>Expenses:</span>
							<br />- Food & Bev: {selectedReport.expense1}
							<br />- Fuel: {selectedReport.expense2}
							<br />- Staff: {selectedReport.expense3}
							<br />- Commission: {selectedReport.expense4}
							<br />- Others: {selectedReport.expense5}
						</div>
						<div>
							<span>Total:</span> {selectedReport.total}
						</div>
						<div>
							<span>Payment:</span> {selectedReport.payment}
						</div>
						<button onClick={() => setIsEditing(true)}>✏️</button>
					</div>
				</Modal>
			)}

			<Modal
				isOpen={isEditing}
				onRequestClose={() => setIsEditing(false)}
				className="modal-content"
				overlayClassName="modal-overlay"
			>
				<DataForm
					onSubmit={handleEdit}
					selectedDate={selectedReport?.date ?? new Date()}
					initialValues={{
						location: selectedReport?.location ?? "",
						description: selectedReport?.description ?? "",
						pax: selectedReport?.pax ?? 0,
						price: selectedReport?.price ?? 0,
						expense1: selectedReport?.expense1 ?? 0,
						expense2: selectedReport?.expense2 ?? 0,
						expense3: selectedReport?.expense3 ?? 0,
						expense4: selectedReport?.expense4 ?? 0,
						expense5: selectedReport?.expense5 ?? 0,
						payment: selectedReport?.payment ?? "",
					}}
				/>
			</Modal>
		</div>
	);
};

export default Dashboard;
