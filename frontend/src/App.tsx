import React, { useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PlannerPage from "./pages/PlannerPage";
import ReportPage from "./pages/ReportPage";
import "./styles/nav.css";
import "./styles/mobile.css";
import Dashboard from "./pages/Dashboard";
import ReportCard from "./pages/ReportCard";
import Home from "./pages/Home";
import Nav from "./components/Nav";
import Register from "./components/Register";
import Login from "./components/Login";
import { AuthProvider } from "./AuthContext";
import ProtectedRoute from "./ProtectedRoute";

// Define the structure of the data each report will have
interface ReportData {
	reportId: number;
	location: string;
	description: string;
	date: Date;
	pax: number;
	price: number;
	expense1: number;
	expense2: number;
	expense3: number;
	expense4: number;
	expense5: number;
	total: number;
}

const App: React.FC = () => {
	const [reportData, setReportData] = useState<ReportData[]>([]);

	// Implement the delete handler function
	const handleDelete = (reportId: number) => {
		const updatedReportData = reportData.filter(
			(report) => report.reportId !== reportId
		);
		setReportData(updatedReportData);
		console.log(`Deleted report with id ${reportId}`);
	};

	return (
		<AuthProvider>
			<Router>
				<Nav />
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/register" element={<Register />} />
					<Route path="/login" element={<Login />} />
					<Route element={<ProtectedRoute />}>
						<Route path="/PlannerPage" element={<PlannerPage />} />
						<Route path="/Dashboard" element={<Dashboard />} />
						<Route
							path="/Report-Table"
							element={<ReportPage onDelete={handleDelete} />}
						/>
						<Route
							path="/Report-Card"
							element={<ReportCard onDelete={handleDelete} />}
						/>
					</Route>
				</Routes>
			</Router>
		</AuthProvider>
	);
};

export default App;
