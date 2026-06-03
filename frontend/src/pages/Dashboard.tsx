import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import DataForm from "../components/DataForm";
import Modal from "react-modal";
import "../styles/dashboard.css";
import { saveReport, fetchReports, updateReport } from "../services/authService";
import { useToast } from "../ToastContext";

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
	payment: string;
	total: number;
}

interface Props {
	onEdit: (reportId: number, updatedData: Partial<ReportData>) => void;
}

Modal.setAppElement("#root");

const Dashboard: React.FC<Props> = () => {
	const { showToast } = useToast();
	const [value, setValue] = useState<Date | null>(null);
	const [showForm, setShowForm] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [reportData, setReportData] = useState<ReportData[]>([]);
	const [selectedReport, setSelectedReport] = useState<ReportData | null>(null);
	const [reportsForDate, setReportsForDate] = useState<ReportData[]>([]);
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);

	useEffect(() => {
		const loadReports = async () => {
			try {
				setLoading(true);
				const reports = await fetchReports();
				setReportData(reports);
			} catch (error) {
				console.error("Error loading reports:", error);
				showToast("Failed to load reports", "error");
			} finally {
				setLoading(false);
			}
		};
		loadReports();
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleDateChange = (value: Date | Date[] | null) => {
		const date = Array.isArray(value) ? value[0] : value;
		setValue(date);
		if (!selectedReport) {
			setShowForm(true);
		} else {
			setSelectedReport(null);
		}
	};

	const handleSubmit = async (data: Omit<ReportData, "date" | "reportId" | "total">) => {
		const newReport: ReportData = {
			...data,
			date: value as Date,
			reportId: Math.floor(Math.random() * 1000),
			total: data.price * data.pax - (data.expense1 + data.expense2 + data.expense3 + data.expense4 + data.expense5),
		};
		setSaving(true);
		try {
			await saveReport(newReport);
			setReportData([...reportData, newReport]);
			setShowForm(false);
			setValue(null);
			showToast("Report saved successfully!", "success");
		} catch (error) {
			console.error("Error saving report:", error);
			showToast("Failed to save report", "error");
		} finally {
			setSaving(false);
		}
	};

	const handleDateClick = (date: Date) => {
		const reports = reportData.filter(
			(report) => report.date.toLocaleDateString() === date.toLocaleDateString()
		);
		if (reports.length > 0) {
			setReportsForDate(reports);
			setShowForm(false);
		} else {
			setReportsForDate([]);
		}
		setValue(date);
		setSelectedReport(null);
	};

	const tileContent = ({ date, view }: { date: Date; view: string }) => {
		if (view === "month") {
			const reports = reportData.filter(
				(report) => report.date.toLocaleDateString() === date.toLocaleDateString()
			);
			return reports.length > 0 ? (
				<div
					className="indicator"
					onClick={(e) => {
						e.stopPropagation();
						handleDateClick(date);
					}}
				>
					<div className="indicator-box"></div>
				</div>
			) : (
				<div className="empty-indicator" onClick={() => setShowForm(true)}></div>
			);
		}
		return null;
	};

	const handleEdit = async (updatedData: Partial<ReportData>) => {
		if (!selectedReport) return;
		const updatedReport = { ...selectedReport, ...updatedData };
		if (
			updatedReport.pax !== undefined && updatedReport.price !== undefined &&
			updatedReport.expense1 !== undefined && updatedReport.expense2 !== undefined &&
			updatedReport.expense3 !== undefined && updatedReport.expense4 !== undefined &&
			updatedReport.expense5 !== undefined
		) {
			updatedReport.total =
				updatedReport.pax * updatedReport.price -
				(updatedReport.expense1 + updatedReport.expense2 + updatedReport.expense3 +
					updatedReport.expense4 + updatedReport.expense5);
		}
		setSaving(true);
		try {
			await updateReport(selectedReport.reportId, updatedReport);
			setReportData(reportData.map((r) => r.reportId === selectedReport.reportId ? updatedReport : r));
			setIsEditing(false);
			setSelectedReport(null);
			setReportsForDate([]);
			showToast("Report updated successfully!", "success");
		} catch (error) {
			console.error("Error updating report:", error);
			showToast("Failed to update report", "error");
		} finally {
			setSaving(false);
		}
	};

	return (
		<div className="dashboard">
			<div className="flex items-center justify-between mb-4">
				<h2 className="text-2xl font-bold">Add Report</h2>
				<p className="text-sm text-gray-500">Click any date to add a report</p>
			</div>

			{loading ? (
				<div className="flex items-center justify-center gap-3 py-12 text-gray-500">
					<div className="w-6 h-6 border-4 border-blue-400 border-t-transparent rounded-full animate-spin" />
					<span>Loading calendar…</span>
				</div>
			) : (
				<Calendar
					onChange={(value) => handleDateChange(value as Date | Date[] | null)}
					value={value}
					className="custom-calendar"
					tileContent={tileContent}
				/>
			)}

			{/* New report modal */}
			<Modal
				isOpen={showForm}
				onRequestClose={() => setShowForm(false)}
				className="absolute top-1/2 left-1/2 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl p-6 outline-none"
				overlayClassName="fixed inset-0 bg-black/50 z-50"
			>
				<div className="flex justify-between items-center mb-4">
					<h3 className="text-lg font-semibold text-gray-800">
						New Report — {value?.toLocaleDateString()}
					</h3>
					<button
						onClick={() => setShowForm(false)}
						className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
					>
						&times;
					</button>
				</div>
				<DataForm onSubmit={handleSubmit} selectedDate={value as Date} saving={saving} />
			</Modal>

			{/* Reports list for a date */}
			<Modal
				isOpen={reportsForDate.length > 0}
				onRequestClose={() => setReportsForDate([])}
				className="absolute top-1/2 left-1/2 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl p-6 outline-none"
				overlayClassName="fixed inset-0 bg-black/50 z-50"
			>
				<div className="flex justify-between items-center mb-4">
					<h3 className="text-lg font-semibold text-gray-800">
						{value?.toLocaleDateString()}
					</h3>
					<button
						onClick={() => setReportsForDate([])}
						className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
					>
						&times;
					</button>
				</div>
				<ul className="space-y-2">
					{reportsForDate.map((report) => (
						<li
							key={report.reportId}
							className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 cursor-pointer transition"
							onClick={() => setSelectedReport(report)}
						>
							<span className="font-medium capitalize text-gray-800">{report.location}</span>
							<span className={`text-sm font-semibold ${report.total >= 0 ? "text-green-600" : "text-red-500"}`}>
								Rs {report.total.toLocaleString()}
							</span>
						</li>
					))}
				</ul>
			</Modal>

			{/* Report detail modal */}
			<Modal
				isOpen={!!selectedReport}
				onRequestClose={() => setSelectedReport(null)}
				className="absolute top-1/2 left-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl p-6 outline-none"
				overlayClassName="fixed inset-0 bg-black/50 z-50"
			>
				{selectedReport && (
					<>
						<div className="flex justify-between items-center mb-4">
							<h3 className="text-lg font-semibold capitalize text-gray-800">{selectedReport.location}</h3>
							<button
								onClick={() => setSelectedReport(null)}
								className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
							>
								&times;
							</button>
						</div>
						<div className="space-y-3 text-sm text-gray-700">
							<Row label="Description" value={selectedReport.description} />
							<Row label="Pax" value={selectedReport.pax} />
							<Row label="Price" value={`Rs ${selectedReport.price.toLocaleString()}`} />
							<Row label="Payment" value={selectedReport.payment} />
							<div className="border-t pt-3">
								<p className="font-semibold text-gray-600 mb-1">Expenses</p>
								<div className="grid grid-cols-2 gap-1 text-gray-600">
									<span>Food & Bev:</span><span>Rs {selectedReport.expense1.toLocaleString()}</span>
									<span>Fuel:</span><span>Rs {selectedReport.expense2.toLocaleString()}</span>
									<span>Staff:</span><span>Rs {selectedReport.expense3.toLocaleString()}</span>
									<span>Commission:</span><span>Rs {selectedReport.expense4.toLocaleString()}</span>
									<span>Others:</span><span>Rs {selectedReport.expense5.toLocaleString()}</span>
								</div>
							</div>
							<div className="border-t pt-3 flex justify-between items-center">
								<span className="font-semibold">Profit</span>
								<span className={`text-xl font-bold ${selectedReport.total >= 0 ? "text-green-600" : "text-red-500"}`}>
									Rs {selectedReport.total.toLocaleString()}
								</span>
							</div>
						</div>
						<button
							onClick={() => setIsEditing(true)}
							className="mt-5 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition font-medium"
						>
							Edit Report
						</button>
					</>
				)}
			</Modal>

			{/* Edit report modal */}
			<Modal
				isOpen={isEditing}
				onRequestClose={() => setIsEditing(false)}
				className="absolute top-1/2 left-1/2 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl p-6 outline-none"
				overlayClassName="fixed inset-0 bg-black/50 z-50"
			>
				<div className="flex justify-between items-center mb-4">
					<h3 className="text-lg font-semibold text-gray-800">Edit Report</h3>
					<button
						onClick={() => setIsEditing(false)}
						className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
					>
						&times;
					</button>
				</div>
				<DataForm
					onSubmit={handleEdit}
					selectedDate={selectedReport?.date ?? new Date()}
					saving={saving}
					initialValues={{
						location: selectedReport?.location ?? "",
						description: selectedReport?.description ?? "",
						pax: selectedReport?.pax ?? 0,
						price: selectedReport?.price ?? 0,
						expense1: selectedReport?.expense1 ?? 0,
						expense2: selectedReport?.expense2 ?? 0,
						expense3: selectedReport?.expense3 ?? 0,
						expense4: selectedReport?.expense4 ?? 0,
						expense5: selectedReport?.expense5 ?? 0,
						payment: selectedReport?.payment ?? "",
					}}
				/>
			</Modal>
		</div>
	);
};

const Row = ({ label, value }: { label: string; value: string | number }) => (
	<div className="flex justify-between">
		<span className="text-gray-500">{label}</span>
		<span className="font-medium">{value}</span>
	</div>
);

export default Dashboard;
