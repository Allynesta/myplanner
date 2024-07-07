import "./App.css";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import PlannerPage from "./pages/PlannerPage";
import ReportPage from "./pages/ReportPage";
import "./styles/nav.css";
import Dashboard from "./pages/Dashboard";

const App: React.FC = () => {
	// Implement the delete handler function
	const handleDelete = (id: number) => {
		// Handle delete functionality (this can be implemented as needed)
		console.log(`Delete report with id ${id}`);
	};

	return (
		<Router>
			<nav>
				<ul className="navList">
					<li>
						<Link to="/">Home</Link>
					</li>
					<li>
						<Link to="/Report-Table">Report Table</Link>
					</li>
					<li>
						<Link to="/Dashboard">Dashboard</Link>
					</li>
				</ul>
			</nav>
			<Routes>
				<Route path="/" element={<PlannerPage />} />
				<Route
					path="/Report-Table"
					element={<ReportPage onDelete={handleDelete} />}
				/>
				<Route path="/Dashboard" element={<Dashboard />} />
			</Routes>
		</Router>
	);
};

export default App;
