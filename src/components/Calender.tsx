import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/calendar.css";

interface Props {
	onSelect: (date: Date) => void;
}

const Calender: React.FC<Props> = ({ onSelect }) => {
	const [selectedDate, setSelectedDate] = useState<Date | null>(null);

	// Function to check if the date is in the future
	const passedDays = (selectedDate: Date) => new Date() < selectedDate;

	const handleDateChange = (date: Date | null) => {
		setSelectedDate(date);
		if (date) onSelect(date); // Ensure date is not null before calling onSelect
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
				filterDate={passedDays}
			/>
		</div>
	);
};

export default Calender;
