import { Formik, Form, Field } from "formik"; // Importing Formik components for form handling.
import "../styles/dataform.css"; // Importing external CSS for the form styling.

// Define the types for the data we will be handling in the form.
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

// Defining the props for the DataForm component.
interface Props {
	onSubmit: (data: FormData) => void; // Function to handle form submission.
	selectedDate: Date | null; // The selected date for the report.
	initialValues?: FormData; // Optional initial values for the form (used for editing).
}

const DataForm: React.FC<Props> = ({
	onSubmit,
	selectedDate,
	initialValues,
}) => {
	// Main return statement that renders the form.
	return (
		<div className="form-container">
			<h2 className="form-title">
				{/* Display the title based on whether initialValues exist */}
				{initialValues ? "Edit Report" : "New Report"}
			</h2>
			<Formik
				// Initial values for the form, either passed as props or default values
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
				// Validation function to check if values meet the requirements
				validate={(values) => {
					const errors: Partial<Record<keyof FormData, string>> = {}; // Initialize errors as an empty object.
					if (!values.location) {
						errors.location = "Location is required!!";
					}
					if (!values.description) {
						errors.description = "Description is required!!";
					}
					if (values.pax <= 0) {
						errors.pax = "Pax must be greater than 0"; // Ensuring pax value is positive.
					}
					if (values.price <= 0) {
						errors.price = "Price must be greater than 0"; // Ensuring price value is positive.
					}

					return errors; // Return the error object if there are validation issues.
				}}
				// The function that runs when the form is submitted
				onSubmit={(values, actions) => {
					if (selectedDate) {
						// Only submit if a date is selected
						onSubmit(values); // Call the onSubmit prop with the form data.
						actions.resetForm(); // Reset the form after submission.
					}
				}}
			>
				{/* Render the form elements inside the Formik context */}
				{({ errors, touched }) => (
					<Form className="data-form">
						{/* Form group for Location field */}
						<div className="form-group">
							<label htmlFor="location">Location:</label>
							<Field
								id="location"
								name="location"
								as="select" // Render this as a <select> dropdown.
								className={
									errors.location && touched.location ? "input-error" : ""
								}
							>
								{/* Dropdown options */}
								<option value="">Select location</option>
								<option value="pieter both">Pieter Both</option>
								<option value="500 pieds">500 Pieds</option>
								<option value="le morne">Le Morne</option>
								<option value="7 cascade">7 Cascades</option>
								<option value="canyonning">7 Cascades - Canyon</option>
								<option value="le sud">Le Sud</option>
								<option value="program">Program</option>
							</Field>
							{/* Display error message if the field is touched and invalid */}
							{errors.location && touched.location && (
								<div className="error-message">{errors.location}</div>
							)}
						</div>

						{/* Form group for Description field */}
						<div className="form-group">
							<label htmlFor="description">Description:</label>
							<Field
								id="description"
								name="description"
								as="textarea" // Render this as a <textarea>.
								className={
									errors.description && touched.description ? "input-error" : ""
								}
							/>
							{/* Error message for Description */}
							{errors.description && touched.description && (
								<div className="error-message">{errors.description}</div>
							)}
						</div>

						{/* Form group for Pax (number of people) field */}
						<div className="form-group">
							<label htmlFor="pax">Pax:</label>
							<Field
								id="pax"
								name="pax"
								type="number" // Render this as a number input.
								className={errors.pax && touched.pax ? "input-error" : ""}
							/>
							{/* Error message for Pax */}
							{errors.pax && touched.pax && (
								<div className="error-message">{errors.pax}</div>
							)}
						</div>

						{/* Form group for Price field */}
						<div className="form-group">
							<label htmlFor="price">Price:</label>
							<Field
								id="price"
								name="price"
								type="number"
								className={errors.price && touched.price ? "input-error" : ""}
							/>
							{/* Error message for Price */}
							{errors.price && touched.price && (
								<div className="error-message">{errors.price}</div>
							)}
						</div>

						{/* Form group for Expenses fields */}
						<div className="form-group">
							<label htmlFor="expense">Expenses:</label>
							{/* Multiple fields for different expense categories */}
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

						{/* Form group for Payment options */}
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

						{/* Submit button */}
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
