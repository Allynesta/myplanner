import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PlannerPage from "./pages/PlannerPage";
import ReportPage from "./pages/ReportPage";

function App() {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<PlannerPage />} />
				<Route path="/Report-Table" element={<ReportPage />} />
			</Routes>
		</Router>
	);
}

export default App;
