// src/data/sampleReportData.ts

// Define the structure of the data each report will have
interface ReportData {
	id: number;
	location: string;
	description: string;
	date: Date;
	pack: number;
	price: number;
}

// Example report data
const sampleReportData: ReportData[] = [
	{
		id: 1,
		location: "New York",
		description: "Report description",
		date: new Date(),
		pack: 5,
		price: 100,
	},
	// Add more sample data as needed
];

export default sampleReportData;
