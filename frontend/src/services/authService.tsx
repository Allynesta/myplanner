import axios from "axios";

// Determine the API URL based on the environment
const API_URL =
	process.env.NODE_ENV === "production"
		? "https://myplanner-api.vercel.app"
		: "http://localhost:5000";

// Helper function to get the token from localStorage and format it
const getAuthHeader = () => {
	const token = localStorage.getItem("token");
	return token ? `Bearer ${token}` : "";
};

// Function to register a new user
export const register = async (username: string, password: string) => {
	return axios.post(`${API_URL}/register`, { username, password });
};

// Function to log in an existing user
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
	expense1: number;
	expense2: number;
	expense3: number;
	expense4: number;
	expense5: number;
	payment: string;
	total: number;
}

// New type for the API response for fetching reports
interface ReportApiResponse {
	reportId: number;
	date: string; // Date is returned as a string from the API
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

// Function to save a report to the database
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

// Function to fetch reports from the database
export const fetchReports = async (): Promise<ReportData[]> => {
	try {
		const response = await axios.get<ReportApiResponse[]>(
			`${API_URL}/dashboard`,
			{ headers: { Authorization: getAuthHeader() } }
		);
		// Convert date strings to Date objects
		return response.data.map((report) => ({
			...report,
			date: new Date(report.date),
		}));
	} catch (error) {
		console.error("Error fetching reports:", error);
		throw error;
	}
};

// Function to delete a report by its ID
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

// Function to fetch the username of the logged-in user
export const fetchUsername = async (): Promise<string> => {
	try {
		const response = await axios.get(`${API_URL}/username`, {
			headers: { Authorization: getAuthHeader() },
		});
		return response.data.username;
	} catch (error) {
		console.error("Error fetching username:", error);
		throw error;
	}
};

// Function to update a report in the database
export const updateReport = async (
	reportId: number,
	updatedReport: Partial<ReportData>
) => {
	try {
		const response = await axios.put(
			`${API_URL}/dashboard/${reportId}`,
			updatedReport,
			{
				headers: { Authorization: getAuthHeader() },
			}
		);
		return response.data;
	} catch (error) {
		console.error("Error updating report:", error);
		throw error;
	}
};
