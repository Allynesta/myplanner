import "./App.css";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import PlannerPage from "./pages/PlannerPage";
import ReportPage from "./pages/ReportPage";

function App() {
	return (
		<Router>
			<nav>
				<ul>
					<li>
						<Link to="/">Home</Link>
					</li>
					<li>
						<Link to="/Report-Table">Report Table</Link>
					</li>
				</ul>
			</nav>
			<Routes>
				<Route path="/" element={<PlannerPage />} />
				<Route path="/Report-Table" element={<ReportPage />} />
			</Routes>
		</Router>
	);
}

export default App;