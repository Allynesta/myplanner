import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface Props {
	onSelect: (date: Date) => void;
}

const Calender: React.FC<Props> = ({ onSelect }) => {
	const [selectedDate, setSelectedDate] = useState<Date | null>(null);
	const [error, setError] = useState<string | null>(null); // State to manage error messages

	// Function to check if the date is in the future
	const isFutureDate = (date: Date) => new Date() < date;

	const handleDateChange = (date: Date | null) => {
		setSelectedDate(date);

		if (date) {
			if (isFutureDate(date)) {
				setError(null); // Clear error if date is valid
				onSelect(date); // Call onSelect with the selected date if valid
			} else {
				setError("Selected date must be in the future."); // Set error if date is not valid
				setSelectedDate(null); // Clear the selected date if invalid
			}
		} else {
			setError("Date selection is required.");
		}
	};

	return (
		<div>
			<h2>My Calendar</h2>
			<DatePicker
				inline
				showMonthDropdown
				showYearDropdown
				selected={selectedDate}
				onChange={handleDateChange}
				dateFormat="MMMM d, yyyy"
			/>
			{error && <div className="error-message">{error}</div>}{" "}
			{/* Display error message if present */}
		</div>
	);
};

export default Calender;
