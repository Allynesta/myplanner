import "./App.css";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import PlannerPage from "./pages/PlannerPage";
import ReportPage from "./pages/ReportPage";
import "./styles/nav.css";
import "./styles/mobile.css";
import Dashboard from "./pages/Dashboard";
import ReportCard from "./pages/ReportCard";
import Home from "./pages/Home";

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
						<Link to="/Dashboard">Dashboard</Link>
					</li>
					<li>
						<Link to="/PlannerPage">My Calendar</Link>
					</li>
					<li>
						<Link to="/Report-Table">Report Table</Link>
					</li>

					<li>
						<Link to="/Report-Card">Report Card</Link>
					</li>
				</ul>
			</nav>
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
