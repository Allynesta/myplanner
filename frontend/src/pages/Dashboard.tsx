// Import React hooks and third-party components
import { useState, useEffect } from "react";
import Calendar from "react-calendar"; // Calendar UI component
import "react-calendar/dist/Calendar.css"; // Calendar styles
import DataForm from "../components/DataForm"; // Form component for data entry
import Modal from "react-modal"; // Modal library
import "../styles/dashboard.css"; // Custom styles

// Import API service functions
import {
	saveReport,
	fetchReports,
	updateReport,
} from "../services/authService";

// Define the type for a report
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

// Props interface, although not used inside the component
interface Props {
	onEdit: (reportId: number, updatedData: Partial<ReportData>) => void;
}

// Set the root element for accessibility purposes
Modal.setAppElement("#root");

const Dashboard: React.FC<Props> = () => {
	// State declarations
	const [value, setValue] = useState<Date | null>(null); // Selected date
	const [showForm, setShowForm] = useState(false); // Controls visibility of form modal
	const [isEditing, setIsEditing] = useState(false); // Controls visibility of edit modal
	const [reportData, setReportData] = useState<ReportData[]>([]); // All reports
	const [selectedReport, setSelectedReport] = useState<ReportData | null>(null); // Report selected for detailed view/edit
	const [reportsForDate, setReportsForDate] = useState<ReportData[]>([]); // Reports for selected date

	// Fetch reports from backend when component mounts
	useEffect(() => {
		const loadReports = async () => {
			try {
				const reports = await fetchReports();
				setReportData(reports);
			} catch (error) {
				console.error("Error loading reports:", error);
			}
		};

		loadReports();
	}, []);

	// Handle calendar date change
	const handleDateChange = (value: Date | Date[] | null) => {
		if (Array.isArray(value)) {
			setValue(value[0]); // Only use the first date if range is selected
		} else {
			setValue(value);
		}

		// If no report is selected, open form modal
		if (!selectedReport) {
			setShowForm(true);
		} else {
			setSelectedReport(null); // Otherwise clear selection
		}
	};

	// Handle form submission to create a new report
	const handleSubmit = async (
		data: Omit<ReportData, "date" | "reportId" | "total">
	) => {
		// Create new report object
		const newReport: ReportData = {
			...data,
			date: value as Date,
			reportId: Math.floor(Math.random() * 1000), // Generate random ID
			total:
				data.price * data.pax - // Calculate profit
				(data.expense1 +
					data.expense2 +
					data.expense3 +
					data.expense4 +
					data.expense5),
		};

		try {
			await saveReport(newReport); // Save report to backend
			setReportData([...reportData, newReport]); // Update local state
			setShowForm(false); // Close modal
			setValue(null); // Reset selected date
		} catch (error) {
			console.error("Error saving report:", error);
		}
	};

	// Handle clicking on a specific date in the calendar
	const handleDateClick = (date: Date) => {
		// Filter reports matching that date
		const reports = reportData.filter(
			(report) => report.date.toLocaleDateString() === date.toLocaleDateString()
		);

		if (reports.length > 0) {
			setReportsForDate(reports); // Show list modal if reports exist
			setShowForm(false);
		} else {
			setReportsForDate([]); // Clear reports list otherwise
		}

		setValue(date); // Update selected date
		setSelectedReport(null); // Clear selection
	};

	// Custom content for calendar tiles (dots or empty indicators)
	const tileContent = ({ date, view }: { date: Date; view: string }) => {
		if (view === "month") {
			const reports = reportData.filter(
				(report) =>
					report.date.toLocaleDateString() === date.toLocaleDateString()
			);

			// Return indicator box if there are reports for the date
			return reports.length > 0 ? (
				<div
					className="indicator"
					onClick={(e) => {
						e.stopPropagation(); // Prevent calendar date change
						handleDateClick(date);
					}}
				>
					<div className="indicator-box"></div>
				</div>
			) : (
				// Empty clickable box to add new report
				<div
					className="empty-indicator"
					onClick={() => setShowForm(true)}
				></div>
			);
		}
		return null;
	};

	// Handle editing a report
	const handleEdit = async (updatedData: Partial<ReportData>) => {
		if (selectedReport) {
			// Merge updated fields with original report
			const updatedReport = {
				...selectedReport,
				...updatedData,
			};

			// Recalculate total if needed
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

			// Update report in backend
			await updateReport(selectedReport.reportId, updatedReport);

			// Update local state
			const updatedReports = reportData.map((report) =>
				report.reportId === selectedReport.reportId ? updatedReport : report
			);

			setReportData(updatedReports);
			setIsEditing(false); // Close modal
			setSelectedReport(null); // Clear selection
			setReportsForDate([]); // Clear reports list otherwise
		}
	};

	return (
		<div className="dashboard">
			<h2>Dashboard</h2>

			{/* Calendar UI */}
			<Calendar
				onChange={(value) => handleDateChange(value as Date | Date[] | null)}
				value={value}
				className="custom-calendar"
				tileContent={tileContent}
			/>

			{/* Form Modal for adding a new report */}
			{showForm && (
				<Modal isOpen={showForm} onRequestClose={() => setShowForm(false)}>
					<DataForm onSubmit={handleSubmit} selectedDate={value as Date} />
				</Modal>
			)}

			{/* Modal listing reports for a selected date */}
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

			{/* Modal displaying full details of a selected report */}
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
							<span>Profit:</span> {selectedReport.total}
						</div>
						<div>
							<span>Payment:</span> {selectedReport.payment}
						</div>
						{/* Edit button */}
						<button onClick={() => setIsEditing(true)}>✏️</button>
					</div>
				</Modal>
			)}

			{/* Modal for editing a report */}
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
