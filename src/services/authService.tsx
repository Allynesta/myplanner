import axios from "axios";

// Dynamically set the API URL based on the environment
const API_URL =
	process.env.NODE_ENV === "production"
		? "https://myplanner-green.vercel.app/api"
		: "http://localhost:5000/api";

// Helper function to get the token from localStorage and format it
const getAuthHeader = () => {
	const token = localStorage.getItem("token");
	return token ? `Bearer ${token}` : "";
};

export const register = async (username: string, password: string) => {
	return axios.post(`${API_URL}/register`, { username, password });
};

export const login = async (username: string, password: string) => {
	return axios.post(`${API_URL}/login`, { username, password });
};

interface ReportData {
	reportId: number;
	date: Date;
	location: string;
	description: string;
	pax: number;
	price: number;
	total: number;
}

// New type for the API response
interface ReportApiResponse {
	reportId: number;
	date: string; // Date is returned as a string from the API
	location: string;
	description: string;
	pax: number;
	price: number;
	total: number;
}

// Modify this function to handle saving reports to the database
export const saveReport = async (report: ReportData) => {
	try {
		const response = await axios.post(`${API_URL}/dashboard`, report, {
			headers: { Authorization: getAuthHeader() },
		});
		return response.data;
	} catch (error) {
		console.error("Error saving report to database:", error);
		throw error;
	}
};

// New function to fetch reports from the database
export const fetchReports = async (): Promise<ReportData[]> => {
	try {
		const response = await axios.get<ReportApiResponse[]>(
			`${API_URL}/dashboard`,
			{ headers: { Authorization: getAuthHeader() } }
		);
		return response.data.map((report) => ({
			...report,
			date: new Date(report.date),
		}));
	} catch (error) {
		console.error("Error fetching reports:", error);
		throw error;
	}
};

export const deleteReport = async (reportId: number) => {
	try {
		const response = await axios.delete(`${API_URL}/dashboard/${reportId}`, {
			headers: { Authorization: getAuthHeader() },
		});
		console.log(`Deleted report with ID: ${reportId}`); // Log successful deletion
		return response.data;
	} catch (error) {
		console.error("Error deleting report:", error);
		throw error;
	}
};
