import { Formik, Form, Field } from "formik";

interface FormData {
	location: string;
	description: string;
	pax: number;
	price: number;
}

interface Props {
	onSubmit: (data: FormData) => void;
}

const DataForm: React.FC<Props> = ({ onSubmit }) => {
	return (
		<div>
			<h2>Data Form</h2>
			<Formik
				initialValues={{
					location: "",
					description: "",
					pax: 0, // Simplified initialization
					price: 0, // Simplified initialization
				}}
				onSubmit={(values, actions) => {
					onSubmit(values);
					actions.resetForm();
				}}
			>
				<Form>
					<div>
						<label htmlFor="location">Location:</label>
						<Field id="location" name="location" as="select">
							<option value="default">Select location</option>
							<option value="pieter">Pieter Both</option>
							<option value="morne">Le Morne</option>
							<option value="cascade">7 Cascades</option>
						</Field>
					</div>

					<div>
						<label htmlFor="description">Description:</label>
						<Field id="description" name="description" as="textarea" />
					</div>
					<div>
						<label htmlFor="pax">Pax:</label>
						<Field id="pax" name="pax" type="number" />
					</div>
					<div>
						<label htmlFor="price">Price:</label>
						<Field id="price" name="price" type="number" />
					</div>
					<button type="submit">Submit</button>
				</Form>
			</Formik>
		</div>
	);
};

export default DataForm;
