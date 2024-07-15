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

const App: React.FC = () => {
	// Implement the delete handler function
	const handleDelete = (id: number) => {
		// Handle delete functionality (this can be implemented as needed)
		console.log(`Delete report with id ${id}`);
	};

	return (
		<Router>
			<Nav />
			<Routes>
				<Route path="/" element={<Home />} />
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
			</Routes>
		</Router>
	);
};

export default App;
