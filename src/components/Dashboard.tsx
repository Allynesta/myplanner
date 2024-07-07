import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import DataForm from "./DataForm";
import Modal from "react-modal";

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

const Dashboard = () => {
	const [value, onChange] = useState<Value>(null);
	const [showForm, setShowForm] = useState(false);

	const handleSelect = (date: Value) => {
		console.log(date);
		onChange(date);
		setShowForm(true);
	};

	const handleSubmit = (data: unknown) => {
		// Handle form submission here
		console.log(data);
		setShowForm(false);
	};

	return (
		<div>
			<Calendar
				onChange={handleSelect}
				value={value}
				className="custom-calendar"
			/>
			<Modal isOpen={showForm} onRequestClose={() => setShowForm(false)}>
				<DataForm onSubmit={handleSubmit} selectedDate={value as Date} />
			</Modal>
		</div>
	);
};

export default Dashboard;
