import React from "react";

interface ReportData {
	id: number;
	date: Date;
	location: string;
	description: string;
	pack: number;
	price: number;
}

interface Props {
	data: ReportData;
	onDelete: (id: number) => void;
}

const ReportItem: React.FC<Props> = ({ data, onDelete }) => {
	const handleDelete = () => {
		console.log("delete");
		onDelete(data.id);
	};

	return (
		<li>
			<strong>location:</strong> {data.location}
			<br />
			<br />
			<strong>pack:</strong> {data.pack}
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
