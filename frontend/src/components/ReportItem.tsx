import React, { useState } from "react";
import DataForm from "./DataForm"; // Import the DataForm component
import "../styles/reportitem.css";

interface ReportData {
	reportId: number;
	date: Date;
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
			<div className="section1">
				<strong>Location:</strong> {data.location}
				<br />
				<strong>Date:</strong>
				{data.date.toDateString()}
				<br />
				<strong>Pax:</strong> {data.pax}
				<br />
				<strong>Price:</strong> {data.price}
				<br />
				<strong>Description:</strong> {data.description}
			</div>
			<div className="section2">
				<strong>Expenses:</strong>- Food & Bev: {data.expense1}
				<br />- Fuel: {data.expense2}
				<br />- Staff: {data.expense3}
				<br />- Commission: {data.expense4}
				<br />- Others: {data.expense5}
				<br />
			</div>
			<div className="section3">
				<strong>Total: {data.total}</strong>
				<strong>Payment: {data.payment}</strong>
			</div>
			<br />
			<div className="section4">
				<button onClick={handleDelete}>Delete</button>
				<button onClick={() => setIsEditing(true)}>Edit</button>
			</div>
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
								expense1: data.expense1,
								expense2: data.expense2,
								expense3: data.expense3,
								expense4: data.expense4,
								expense5: data.expense5,
								payment: data.payment,
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
