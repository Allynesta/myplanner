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
			<br />
			<strong>Pax:</strong> {data.pax}
			<br />
			<br />
			<strong>Price:</strong> {data.price}
			<br />
			<br />
			<strong>Description:</strong> {data.description}
			<br />
			<br />
			<strong>Date:</strong>
			{data.date.toDateString()}
			<br />
			<br />
			<strong>Total:</strong> {(data.total = data.price * data.pax)}
			<br />
			<br />
			<button onClick={handleDelete}>Delete</button>
		</li>
	);
};

export default ReportItem;
