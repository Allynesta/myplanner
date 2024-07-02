import { Formik, Form, Field } from "formik";
import "../styles/dataform.css";

// Define the shape of the form data
interface FormData {
	location: string;
	description: string;
	pax: number;
	price: number;
}

interface Props {
	onSubmit: (data: FormData) => void;
	selectedDate: Date | null; // Receive the selected date from PlannerPage
}

const DataForm: React.FC<Props> = ({ onSubmit, selectedDate }) => {
	return (
		<div>
			<h2>Data Form</h2>
			<Formik
				initialValues={{
					location: "",
					description: "",
					pax: 0,
					price: 0,
				}}
				validate={(values) => {
					const errors: Partial<Record<keyof FormData, string>> = {}; // Define correct typing for errors
					if (!values.location) {
						errors.location = "Location is required";
					}
					if (!values.description) {
						errors.description = "Description is required";
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
					<Form>
						<div>
							<label htmlFor="location">Location:</label>
							<Field id="location" name="location" as="select">
								<option value="">Select location</option>
								<option value="pieter">Pieter Both</option>
								<option value="morne">Le Morne</option>
								<option value="cascade">7 Cascades</option>
							</Field>
							{errors.location && touched.location ? (
								<div className="error-message">{errors.location}</div>
							) : null}
						</div>

						<div>
							<label htmlFor="description">Description:</label>
							<Field id="description" name="description" as="textarea" />
							{errors.description && touched.description ? (
								<div className="error-message">{errors.description}</div>
							) : null}
						</div>
						<div>
							<label htmlFor="pax">Pax:</label>
							<Field id="pax" name="pax" type="number" />
							{errors.pax && touched.pax ? (
								<div className="error-message">{errors.pax}</div>
							) : null}
						</div>
						<div>
							<label htmlFor="price">Price:</label>
							<Field id="price" name="price" type="number" />
							{errors.price && touched.price ? (
								<div className="error-message">{errors.price}</div>
							) : null}
						</div>
						{!selectedDate ? (
							<div className="error-message">Date selection is required</div>
						) : null}
						<button type="submit">Submit</button>
					</Form>
				)}
			</Formik>
		</div>
	);
};

export default DataForm;
