import React, { useState } from "react";
import DataForm from "./DataForm"; // Import the DataForm component

interface ReportData {
	reportId: number;
	date: Date;
	location: string;
	description: string;
	pax: number;
	price: number;
	expense: number;
	total: number;
}

interface Props {
	data: ReportData;
	onDelete: (reportId: number) => void;
	onEdit: (reportId: number, updatedData: Partial<ReportData>) => void; // Added onEdit prop
}

const ReportItem: React.FC<Props> = ({ data, onDelete, onEdit }) => {
	const [isEditing, setIsEditing] = useState(false);

	const handleDelete = () => {
		if (window.confirm("Are you sure you want to delete this item?")) {
			onDelete(data.reportId);
		}
	};

	const handleEdit = (updatedData: Partial<ReportData>) => {
		onEdit(data.reportId, updatedData);
		setIsEditing(false);
	};

	return (
		<li>
			<strong>Location:</strong> {data.location}
			<br />
			<strong>Pax:</strong> {data.pax}
			<br />
			<strong>Price:</strong> {data.price}
			<br />
			<strong>Description:</strong> {data.description}
			<br />
			<strong>Expenses:</strong> {data.expense}
			<br />
			<strong>Date:</strong>
			{data.date.toDateString()}
			<br />
			<strong>Total:</strong> {data.total}
			<br />
			<button onClick={handleDelete}>Delete</button>
			<button onClick={() => setIsEditing(true)}>Edit</button>
			{/* Conditional Rendering of DataForm Modal */}
			{/* Conditionally render DataForm as a modal */}
			{isEditing && (
				<div className="modal">
					<div className="modal-content">
						<DataForm
							onSubmit={handleEdit}
							selectedDate={data.date}
							initialValues={{
								location: data.location,
								description: data.description,
								pax: data.pax,
								price: data.price,
								expense: data.expense,
							}}
						/>
					</div>
					<div className="modal-overlay" onClick={() => setIsEditing(false)} />
				</div>
			)}
		</li>
	);
};

export default ReportItem;
