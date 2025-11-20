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
		<li className="mb-4">
			{/* Small card */}
			<div
				className="bg-white shadow-md rounded-md p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition"
				onClick={() => setIsExpanded(!isExpanded)}
			>
				<strong className="text-gray-800">
					{data.location} - {data.date.toDateString()}
				</strong>
				<span className="text-gray-500">{isExpanded ? "▲" : "▼"}</span>
			</div>

			{/* Expanded card */}
			{isExpanded && (
				<div className="bg-gray-50 border border-gray-200 rounded-md p-4 mt-2 space-y-3">
					<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-gray-700">
						<div>
							<p>
								<strong>Pax:</strong> {data.pax}
							</p>
							<p>
								<strong>Price:</strong> {data.price}
							</p>
							<p>
								<strong>Description:</strong> {data.description}
							</p>
						</div>
						<div>
							<p>
								<strong>Expenses:</strong>
							</p>
							<p>- Food & Bev: {data.expense1}</p>
							<p>- Fuel: {data.expense2}</p>
							<p>- Staff: {data.expense3}</p>
							<p>- Commission: {data.expense4}</p>
							<p>- Others: {data.expense5}</p>
						</div>
						<div>
							<p>
								<strong>Profit:</strong> {data.total}
							</p>
							<p>
								<strong>Payment:</strong> {data.payment}
							</p>
						</div>
					</div>

					<div className="flex gap-2 mt-3">
						<button
							onClick={handleDelete}
							className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
						>
							Delete
						</button>
						<button
							onClick={() => setIsEditing(true)}
							className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
						>
							Edit
						</button>
					</div>
				</div>
			)}

			{/* Modal for editing */}
			<Modal
				isOpen={isEditing}
				onRequestClose={() => setIsEditing(false)}
				className="absolute top-1/2 left-1/2 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg p-6 outline-none"
				overlayClassName="fixed inset-0 bg-black/50 z-50"
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
				<button
					onClick={() => setIsEditing(false)}
					className="mt-4 bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500 transition"
				>
					Close
				</button>
			</Modal>
		</li>
	);
};

export default ReportItem;
