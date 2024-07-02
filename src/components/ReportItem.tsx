import React from "react";

interface ReportData {
	id: number;
	date: Date;
	location: string;
	description: string;
	pax: number;
	price: number;
}

interface Props {
	data: ReportData;
	onDelete: (id: number) => void;
}

const ReportItem: React.FC<Props> = ({ data, onDelete }) => {
	const handleDelete = () => {
		if (window.confirm("Are you sure you want to delete this item?")) {
			onDelete(data.id);
		}
	};

	return (
		<li>
			<strong>location:</strong> {data.location}
			<br />
			<br />
			<strong>pax:</strong> {data.pax}
			<br />
			<br />
			<strong>price:</strong> {data.price}
			<br />
			<br />
			<strong>Description:</strong> {data.description}
			<br />
			<br />
			<strong>Date:</strong> <p>{data.date.toDateString()}</p>
			<br />
			<br />
			<button onClick={handleDelete}>Delete</button>
		</li>
	);
};

export default ReportItem;
