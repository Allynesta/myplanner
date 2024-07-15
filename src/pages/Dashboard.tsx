import { useState, useEffect } from "react"; // Import hooks from React
import Calendar from "react-calendar"; // Import the Calendar component from react-calendar
import "react-calendar/dist/Calendar.css"; // Import the calendar styles
import DataForm from "../components/DataForm"; // Import the custom DataForm component
import Modal from "react-modal"; // Import the Modal component from react-modal
import "../styles/dashboard.css"; // Import custom styles for the dashboard

// Ensure Modal sets up the app element for accessibility
Modal.setAppElement("#root");

// Define the ReportData interface
interface ReportData {
	id: number; // Unique identifier for the report
	location: string; // Location of the report
	description: string; // Description of the report
	date: Date; // Date of the report
	pax: number; // Number of people
	price: number; // Price associated with the report
}

// Main Dashboard component
const Dashboard = () => {
	// State variables
	const [value, setValue] = useState<Date | null>(null); // selected date
	const [showForm, setShowForm] = useState(false); // show data form modal
	const [reportData, setReportData] = useState<ReportData[]>([]); // report data
	const [selectedReport, setSelectedReport] = useState<ReportData | null>(null); // selected report

	// useEffect to load report data from local storage when the component mounts
	useEffect(() => {
		const storedData = localStorage.getItem("plannerData"); // Get stored data from local storage
		if (storedData) {
			const parsedData: ReportData[] = JSON.parse(storedData).map(
				(report: { date: string | number | Date }) => ({
					...report,
					date: new Date(report.date), // Convert date to Date object
				})
			);
			setReportData(parsedData); // Set the state with parsed data
		}
	}, []);

	// Handle date change and open DataForm
	const handleDateChange = (value: Date | Date[] | null) => {
		if (Array.isArray(value)) {
			setValue(value[0]); // If value is an array, set the first date
		} else {
			setValue(value); // Otherwise, set the selected date
		}
		if (value instanceof Date) {
			setShowForm(true); // Open DataForm when date is selected
			setSelectedReport(null); // Reset selected report when date changes
		}
	};

	// Handle form submission and close DataForm
	const handleSubmit = (data: {
		location: string;
		description: string;
		pax: number;
		price: number;
	}) => {
		const newReport: ReportData = {
			id: reportData.length + 1, // Generate a new ID based on the length of reportData
			location: data.location,
			description: data.description,
			date: value as Date,
			pax: data.pax,
			price: data.price,
		};
		const updatedReportData = [...reportData, newReport]; // Add new report to the reportData array
		setReportData(updatedReportData); // Update state with new report data
		localStorage.setItem("plannerData", JSON.stringify(updatedReportData)); // Save updated report data to local storage
		setValue(null); // Reset selected date
		setShowForm(false); // Close DataForm after submission
	};

	// Tile content for the calendar
	const tileContent = ({ date, view }: { date: Date; view: string }) => {
		if (view === "month") {
			// Only display content if the view is month
			const reports = reportData.filter((report) => {
				if (report.date instanceof Date) {
					return report.date.toLocaleDateString() === date.toLocaleDateString(); // Check if the report date matches the tile date
				} else {
					return false;
				}
			});
			return reports.length > 0 ? ( // If there are reports for this date, display them
				<div>
					{reports.map((report) => (
						<div
							key={report.id} // Unique key for each report
							className="card"
							onClick={(e) => {
								e.stopPropagation(); // Stop event propagation
								setShowForm(false); // Close DataForm if it's open
								setSelectedReport(report); // Open report details when card is clicked
							}}
						>
							<span>{report.location}</span>
						</div>
					))}
				</div>
			) : null; // Return null if no reports for this date
		}
		return null; // Return null if view is not month
	};

	return (
		<>
			{/* Modal for DataForm */}
			{showForm && !selectedReport && (
				<Modal
					ariaHideApp={false}
					isOpen={showForm}
					onRequestClose={() => setShowForm(false)} // Close the form modal when clicking outside
					shouldCloseOnOverlayClick={true} // Add this prop to close on overlay click
					overlayClassName="custom-overlay"
				>
					<DataForm onSubmit={handleSubmit} selectedDate={value as Date} />
				</Modal>
			)}

			{/* Modal for displaying selected report */}
			{selectedReport && (
				<Modal
					ariaHideApp={false}
					isOpen={!!selectedReport}
					onRequestClose={() => setSelectedReport(null)} // Close the report modal when clicking outside
					shouldCloseOnOverlayClick={true} // Add this prop to close on overlay click
					overlayClassName="custom-overlay"
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
			{/* Header */}
			<h2>My Calendar</h2>
			{/* Calendar component */}
			<div className="dashboard">
				<Calendar
					onChange={(value) => handleDateChange(value as Date | Date[] | null)} // Handle date change
					value={value} // Selected date
					className="custom-calendar"
					tileContent={tileContent} // Content for each tile
				/>
			</div>
		</>
	);
};

export default Dashboard;
