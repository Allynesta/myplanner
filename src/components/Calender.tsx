import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface Props {
	onSelect: (date: Date) => void;
}

const Calender: React.FC<Props> = ({ onSelect }) => {
	const [selectedDate, setSelectedDate] = useState<Date | null>(null);
	const passedDays = (selectedDate: Date) => new Date() < selectedDate;

	const handleDateCHange = (date: Date | null) => {
		setSelectedDate(date);
		onSelect(date as Date);
	};

	return (
		<div>
			<h2>My Calendar</h2>
			<DatePicker
				inline
				showMonthDropdown
				showYearDropdown
				selected={selectedDate}
				onChange={handleDateCHange}
				filterDate={passedDays}
			/>
		</div>
	);
};

export default Calender;
