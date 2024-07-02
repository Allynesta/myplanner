import "./App.css";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import PlannerPage from "./pages/PlannerPage";
import ReportPage from "./pages/ReportPage";
import "./styles/nav.css";
import sampleReportData from "./data/sampleReportData";

// Define the structure of the data each report will have
interface ReportData {
	id: number;
	location: string;
	description: string;
	date: Date;
	pack: number;
	price: number;
}

// Define the props that App will receive
interface Props {
	reportData?: ReportData[];
}

const App: React.FC<Props> = () => {
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
				</ul>
			</nav>
			<Routes>
				<Route path="/" element={<PlannerPage />} />
				<Route
					path="/Report-Table"
					element={
						<ReportPage
							reportData={sampleReportData} // Pass the raw reportData
							onDelete={handleDelete}
						/>
					}
				/>
			</Routes>
		</Router>
	);
};

export default App;
