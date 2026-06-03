import { Formik, Form, Field, useFormikContext } from "formik";
import "../styles/dataform.css";

interface FormData {
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
}

interface Props {
	onSubmit: (data: FormData) => void;
	selectedDate: Date | null;
	initialValues?: FormData;
	saving?: boolean;
}

const ProfitPreview = () => {
	const { values } = useFormikContext<FormData>();
	const income = (Number(values.pax) || 0) * (Number(values.price) || 0);
	const expenses =
		(Number(values.expense1) || 0) +
		(Number(values.expense2) || 0) +
		(Number(values.expense3) || 0) +
		(Number(values.expense4) || 0) +
		(Number(values.expense5) || 0);
	const profit = income - expenses;

	if (income === 0 && expenses === 0) return null;

	return (
		<div className="mt-2 p-3 bg-gray-50 rounded-lg border text-sm">
			<div className="flex justify-between text-gray-600">
				<span>Income (pax × price)</span>
				<span>Rs {income.toLocaleString()}</span>
			</div>
			<div className="flex justify-between text-gray-600">
				<span>Total Expenses</span>
				<span className="text-red-500">- Rs {expenses.toLocaleString()}</span>
			</div>
			<div className={`flex justify-between font-bold border-t mt-1 pt-1 ${profit >= 0 ? "text-green-600" : "text-red-500"}`}>
				<span>Profit</span>
				<span>Rs {profit.toLocaleString()}</span>
			</div>
		</div>
	);
};

const DataForm: React.FC<Props> = ({ onSubmit, selectedDate, initialValues, saving }) => {
	return (
		<div className="form-container">
			<Formik
				initialValues={
					initialValues || {
						location: "",
						description: "",
						pax: 0,
						price: 0,
						expense1: 0,
						expense2: 0,
						expense3: 0,
						expense4: 0,
						expense5: 0,
						payment: "",
					}
				}
				validate={(values) => {
					const errors: Partial<Record<keyof FormData, string>> = {};
					if (!values.location) errors.location = "Location is required";
					if (!values.description) errors.description = "Description is required";
					if (values.pax <= 0) errors.pax = "Pax must be greater than 0";
					if (values.price <= 0) errors.price = "Price must be greater than 0";
					return errors;
				}}
				onSubmit={(values, actions) => {
					if (selectedDate) {
						onSubmit(values);
						actions.resetForm();
					}
				}}
			>
				{({ errors, touched }) => (
					<Form className="data-form space-y-4">
						{/* Location */}
						<div className="form-group">
							<label htmlFor="location">Location</label>
							<Field
								id="location"
								name="location"
								as="select"
								className={errors.location && touched.location ? "input-error" : ""}
							>
								<option value="">Select location</option>
								<option value="pieter both">Pieter Both</option>
								<option value="500 pieds">500 Pieds</option>
								<option value="le morne">Le Morne</option>
								<option value="7 cascade">7 Cascades</option>
								<option value="canyonning">7 Cascades - Canyon</option>
								<option value="le sud">Le Sud</option>
								<option value="program">Program</option>
							</Field>
							{errors.location && touched.location && (
								<div className="error-message">{errors.location}</div>
							)}
						</div>

						{/* Description */}
						<div className="form-group">
							<label htmlFor="description">Description</label>
							<Field
								id="description"
								name="description"
								as="textarea"
								rows={2}
								placeholder="Brief description of the activity…"
								className={errors.description && touched.description ? "input-error" : ""}
							/>
							{errors.description && touched.description && (
								<div className="error-message">{errors.description}</div>
							)}
						</div>

						{/* Pax + Price side by side */}
						<div className="grid grid-cols-2 gap-3">
							<div className="form-group">
								<label htmlFor="pax">Pax</label>
								<Field
									id="pax"
									name="pax"
									type="number"
									min="0"
									className={errors.pax && touched.pax ? "input-error" : ""}
								/>
								{errors.pax && touched.pax && (
									<div className="error-message">{errors.pax}</div>
								)}
							</div>
							<div className="form-group">
								<label htmlFor="price">Price (Rs)</label>
								<Field
									id="price"
									name="price"
									type="number"
									min="0"
									className={errors.price && touched.price ? "input-error" : ""}
								/>
								{errors.price && touched.price && (
									<div className="error-message">{errors.price}</div>
								)}
							</div>
						</div>

						{/* Expenses */}
						<div className="form-group">
							<label>Expenses (Rs)</label>
							<div className="grid grid-cols-2 gap-2 mt-1">
								<div>
									<label htmlFor="expense1" className="text-xs font-normal text-gray-500">Food & Bev</label>
									<Field id="expense1" name="expense1" type="number" min="0" />
								</div>
								<div>
									<label htmlFor="expense2" className="text-xs font-normal text-gray-500">Fuel</label>
									<Field id="expense2" name="expense2" type="number" min="0" />
								</div>
								<div>
									<label htmlFor="expense3" className="text-xs font-normal text-gray-500">Staff</label>
									<Field id="expense3" name="expense3" type="number" min="0" />
								</div>
								<div>
									<label htmlFor="expense4" className="text-xs font-normal text-gray-500">Commission</label>
									<Field id="expense4" name="expense4" type="number" min="0" />
								</div>
								<div>
									<label htmlFor="expense5" className="text-xs font-normal text-gray-500">Others</label>
									<Field id="expense5" name="expense5" type="number" min="0" />
								</div>
							</div>
						</div>

						{/* Live profit preview */}
						<ProfitPreview />

						{/* Payment */}
						<div className="form-group">
							<label>Payment Status</label>
							<div className="flex flex-wrap gap-4 mt-1">
								{["Not paid", "Paid by cash", "Paid by juice"].map((opt) => (
									<label key={opt} className="flex items-center gap-2 cursor-pointer text-sm font-normal text-gray-700">
										<Field type="radio" name="payment" value={opt} className="accent-blue-500" />
										{opt}
									</label>
								))}
							</div>
						</div>

						<button
							className="btn-submit"
							type="submit"
							disabled={saving}
						>
							{saving ? "Saving…" : initialValues ? "Save Changes" : "Submit"}
						</button>
					</Form>
				)}
			</Formik>
		</div>
	);
};

export default DataForm;
