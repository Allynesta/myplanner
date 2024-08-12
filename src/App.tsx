import React from "react";
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

const App: React.FC = () => {
	// Implement the delete handler function
	const handleDelete = () => {
		// Handle delete functionality (this can be implemented as needed)
		console.log("Delete report with id ${id}");
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
							element={<ReportPage onDelete={handleDelete} reportData={[]} />}
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
