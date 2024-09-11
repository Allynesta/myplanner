import { Formik, Form, Field } from "formik";
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
							<label htmlFor="expense1">Food & Bev:</label>
							<Field id="expense1" name="expense1" type="number" />
							<label htmlFor="expense2">Fuel:</label>
							<Field id="expense2" name="expense2" type="number" />
							<label htmlFor="expense3">Staff:</label>
							<Field id="expense3" name="expense3" type="number" />
							<label htmlFor="expense4">Commission:</label>
							<Field id="expense4" name="expense4" type="number" />
							<label htmlFor="expense5">Others:</label>
							<Field id="expense5" name="expense5" type="number" />
						</div>

						<label htmlFor="payment">Payment:</label>
						<div className="form-group payment">
							<label htmlFor="payment1">Not paid</label>
							<Field
								id="payment1"
								name="payment"
								value="Not paid"
								type="radio"
							/>
							<label htmlFor="payment2">Paid by cash</label>
							<Field
								id="payment2"
								name="payment"
								value="Paid by cash"
								type="radio"
							/>
							<label htmlFor="payment3">Paid by juice</label>
							<Field
								id="payment3"
								name="payment"
								value="Paid by juice"
								type="radio"
							/>
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
