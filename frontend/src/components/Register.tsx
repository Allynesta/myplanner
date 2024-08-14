import React, { useState } from "react";
import { register } from "../services/authService";
import axios from "axios";

const Register: React.FC = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			await register(username, password);
			alert("User registered successfully");
			setUsername("");
			setPassword("");
			setError(null);
		} catch (err: unknown) {
			if (axios.isAxiosError(err) && err.response && err.response.data) {
				setError(err.response.data.message);
			} else {
				setError("Error registering user");
			}
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<div>
				<label>Username:</label>
				<input
					type="text"
					value={username}
					onChange={(e) => setUsername(e.target.value)}
					required
				/>
			</div>
			<div>
				<label>Password:</label>
				<input
					type="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					required
				/>
			</div>
			{error && <div style={{ color: "red" }}>{error}</div>}
			<button type="submit">Register</button>
		</form>
	);
};

export default Register;
