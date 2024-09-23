import React, { useState } from "react";
import DataForm from "./DataForm"; // Assuming the DataForm component is for editing
import Modal from "react-modal";
import "../styles/reportitem.css";

Modal.setAppElement("#root");

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
	onEdit: (reportId: number, updatedData: Partial<ReportData>) => void;
}

const ReportItem: React.FC<Props> = ({ data, onDelete, onEdit }) => {
	const [isExpanded, setIsExpanded] = useState(false); // For accordion-like behavior
	const [isEditing, setIsEditing] = useState(false);

	const handleDelete = () => {
		if (window.confirm("Are you sure you want to delete this item?")) {
			onDelete(data.reportId);
		}
	};

	const handleEdit = (updatedData: Partial<ReportData>) => {
		onEdit(data.reportId, updatedData);
		setIsEditing(false); // Close modal after edit
	};

	return (
		<li>
			{/* Small Card (location only) */}
			<div className="small-card" onClick={() => setIsExpanded(!isExpanded)}>
				<strong>
					{data.location} - {data.date.toDateString()}
				</strong>
				<span className="toggle-icon">{isExpanded ? " ▲ " : " ▼ "}</span>
			</div>

			{/* Expanded view (visible only when clicked) */}
			{isExpanded && (
				<div className="expanded-card">
					<div className="section1">
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
						<strong>Total:</strong> {data.total}
						<br />
						<strong>Payment:</strong> {data.payment}
					</div>
					<br />
					<div className="section4">
						<button onClick={handleDelete}>Delete</button>
						<button onClick={() => setIsEditing(true)}>Edit</button>
					</div>
				</div>
			)}

			{/* Modal for Editing */}
			<Modal
				isOpen={isEditing}
				onRequestClose={() => setIsEditing(false)}
				className="modal-content"
				overlayClassName="modal-overlay"
			>
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
				<button onClick={() => setIsEditing(false)} className="close-button">
					Close
				</button>
			</Modal>
		</li>
	);
};

export default ReportItem;
