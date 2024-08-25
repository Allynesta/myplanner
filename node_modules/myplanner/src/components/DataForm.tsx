import { Formik, Form, Field } from "formik";
import "../styles/dataform.css";

interface FormData {
	location: string;
	description: string;
	pax: number;
	price: number;
	expense: number;
}

interface Props {
	onSubmit: (data: FormData) => void;
	selectedDate: Date | null;
	initialValues?: FormData;
}

const DataForm: React.FC<Props> = ({
	onSubmit,
	selectedDate,
	initialValues,
}) => {
	return (
		<div className="form-container">
			<h2 className="form-title">
				{initialValues ? "Edit Report" : "New Report"}
			</h2>
			<Formik
				initialValues={
					initialValues || {
						location: "",
						description: "",
						pax: 0,
						price: 0,
						expense: 0,
					}
				}
				validate={(values) => {
					const errors: Partial<Record<keyof FormData, string>> = {};
					if (!values.location) {
						errors.location = "Location is required!!";
					}
					if (!values.description) {
						errors.description = "Description is required!!";
					}
					if (values.pax <= 0) {
						errors.pax = "Pax must be greater than 0";
					}
					if (values.price <= 0) {
						errors.price = "Price must be greater than 0";
					}
					if (values.expense <= 0) {
						errors.expense = "Expense must be greater than 0";
					}
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
					<Form className="data-form">
						<div className="form-group">
							<label htmlFor="location">Location:</label>
							<Field
								id="location"
								name="location"
								as="select"
								className={
									errors.location && touched.location ? "input-error" : ""
								}
							>
								<option value="">Select location</option>
								<option value="pieter">Pieter Both</option>
								<option value="pieds">500 Pieds</option>
								<option value="morne">Le Morne</option>
								<option value="cascade">7 Cascades</option>
							</Field>
							{errors.location && touched.location && (
								<div className="error-message">{errors.location}</div>
							)}
						</div>

						<div className="form-group">
							<label htmlFor="description">Description:</label>
							<Field
								id="description"
								name="description"
								as="textarea"
								className={
									errors.description && touched.description ? "input-error" : ""
								}
							/>
							{errors.description && touched.description && (
								<div className="error-message">{errors.description}</div>
							)}
						</div>

						<div className="form-group">
							<label htmlFor="pax">Pax:</label>
							<Field
								id="pax"
								name="pax"
								type="number"
								className={errors.pax && touched.pax ? "input-error" : ""}
							/>
							{errors.pax && touched.pax && (
								<div className="error-message">{errors.pax}</div>
							)}
						</div>

						<div className="form-group">
							<label htmlFor="price">Price:</label>
							<Field
								id="price"
								name="price"
								type="number"
								className={errors.price && touched.price ? "input-error" : ""}
							/>
							{errors.price && touched.price && (
								<div className="error-message">{errors.price}</div>
							)}
						</div>

						<div className="form-group">
							<label htmlFor="expense">Expenses:</label>
							<Field
								id="expense"
								name="expense"
								type="number"
								className={
									errors.expense && touched.expense ? "input-error" : ""
								}
							/>
							{errors.expense && touched.expense && (
								<div className="error-message">{errors.expense}</div>
							)}
						</div>

						<button className="btn-submit" type="submit">
							{initialValues ? "Save Changes" : "Submit"}
						</button>
					</Form>
				)}
			</Formik>
		</div>
	);
};

export default DataForm;
