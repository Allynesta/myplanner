/**
 * ReportItem Component
 *
 * Represents a single report entry.
 * Allows expanding to see details, editing via a modal, and deleting the report.
 */

import React, { useState } from "react";
import DataForm from "./DataForm"; // Form component used for editing reports
import Modal from "react-modal"; // Modal library for editing
import "../styles/reportitem.css"; // Styles specific to ReportItem

// Set Modal to work properly with accessibility (important for screen readers)
Modal.setAppElement("#root");

// Type definition for report data
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

// Props expected by ReportItem component
interface Props {
	data: ReportData;
	onDelete: (reportId: number) => void;
	onEdit: (reportId: number, updatedData: Partial<ReportData>) => void;
}

const ReportItem: React.FC<Props> = ({ data, onDelete, onEdit }) => {
	const [isExpanded, setIsExpanded] = useState(false); // Controls if details are shown
	const [isEditing, setIsEditing] = useState(false); // Controls if the edit modal is open

	// Handle deleting a report
	const handleDelete = () => {
		if (window.confirm("Are you sure you want to delete this item?")) {
			onDelete(data.reportId);
		}
	};

	// Handle editing and saving the updated report
	const handleEdit = (updatedData: Partial<ReportData>) => {
		onEdit(data.reportId, updatedData);
		setIsEditing(false); // Close the modal after saving
	};

	return (
		<li>
			{/* Small Card View (click to expand) */}
			<div className="small-card" onClick={() => setIsExpanded(!isExpanded)}>
				<strong>
					{data.location} - {data.date.toDateString()}
				</strong>
				<span className="toggle-icon">{isExpanded ? " ▲ " : " ▼ "}</span>
			</div>

			{/* Expanded Card View */}
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
						<strong>Expenses:</strong>
						<br />- Food & Bev: {data.expense1}
						<br />- Fuel: {data.expense2}
						<br />- Staff: {data.expense3}
						<br />- Commission: {data.expense4}
						<br />- Others: {data.expense5}
					</div>
					<div className="section3">
						<strong>Profit:</strong> {data.total}
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

			{/* Edit Modal */}
			<Modal
				isOpen={isEditing}
				onRequestClose={() => setIsEditing(false)}
				className="modal-content"
				overlayClassName="modal-overlay"
			>
				{/* Pass initial values and submit handler to DataForm */}
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
