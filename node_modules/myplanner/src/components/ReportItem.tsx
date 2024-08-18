import React from "react";

interface ReportData {
	reportId: number;
	date: Date;
	location: string;
	description: string;
	pax: number;
	price: number;
	total: number;
}

interface Props {
	data: ReportData;
	onDelete: (reportId: number) => void;
}

const ReportItem: React.FC<Props> = ({ data, onDelete }) => {
	const handleDelete = () => {
		if (window.confirm("Are you sure you want to delete this item?")) {
			onDelete(data.reportId);
		}
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
			<strong>Date:</strong>
			{data.date.toDateString()}
			<br />
			<strong>Total:</strong> {(data.total = data.price * data.pax)}
			<br />
			<button onClick={handleDelete}>Delete</button>
			<i className="far fa-edit"></i>
		</li>
	);
};

export default ReportItem;
