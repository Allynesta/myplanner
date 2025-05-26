/**
 * Calender Component
 *
 * This component provides an inline date picker using react-datepicker.
 * It allows the user to select a future date. If the selected date is not in the future,
 * an error message is shown. The valid selected date is passed to the parent via the `onSelect` callback.
 */

import { useState } from "react";
import DatePicker from "react-datepicker"; // Date picker component
import "react-datepicker/dist/react-datepicker.css"; // Styles for the date picker
import "../styles/calender.css"; // Custom calendar styles

// Props type definition
interface Props {
	onSelect: (date: Date) => void; // Callback to send the selected date to the parent
}

const Calender: React.FC<Props> = ({ onSelect }) => {
	const [selectedDate, setSelectedDate] = useState<Date | null>(null); // State to track selected date
	const [error, setError] = useState<string | null>(null); // State to handle validation error

	// Helper function to check if selected date is in the future
	const isFutureDate = (date: Date) => new Date() < date;

	// Handle change in selected date
	const handleDateChange = (date: Date | null) => {
		setSelectedDate(date);

		if (date) {
			if (isFutureDate(date)) {
				setError(null); // Valid date, clear error
				onSelect(date); // Trigger callback with selected date
			} else {
				setError("Selected date must be in the future."); // Invalid date error
				setSelectedDate(null); // Clear invalid date
			}
		} else {
			setError("Date selection is required."); // Null date error
		}
	};

	return (
		<div className="calendar-container">
			<h2 className="calendar-title">My Calendar</h2>
			<DatePicker
				inline
				showMonthDropdown
				showYearDropdown
				selected={selectedDate}
				onChange={handleDateChange}
				dateFormat="MMMM d, yyyy"
				className="custom-datepicker"
			/>
			{error && <div className="error-message">{error}</div>}
		</div>
	);
};

export default Calender;
