import React, { useState } from "react";
import { register } from "../services/authService";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/auth.css"; // Assuming the CSS file is named "auth.css"

const Register: React.FC = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState<string | null>(null);
	const navigate = useNavigate();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			await register(username, password);
			alert("User registered successfully");
			setUsername("");
			setPassword("");
			setError(null);
			navigate("/Login");
		} catch (err: unknown) {
			if (axios.isAxiosError(err) && err.response && err.response.data) {
				setError(err.response.data.message);
			} else {
				setError("Error registering user");
			}
		}
	};

	return (
		<div className="auth-container">
			<h2 className="auth-title">Register</h2>
			<form className="auth-form" onSubmit={handleSubmit}>
				<div className="auth-form-group">
					<label htmlFor="username">Username:</label>
					<input
						id="username"
						type="text"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						required
					/>
				</div>
				<div className="auth-form-group">
					<label htmlFor="password">Password:</label>
					<input
						id="password"
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>
				</div>
				{error && <div className="error-message">{error}</div>}
				<button className="btn-submit" type="submit">
					Register
				</button>
			</form>
		</div>
	);
};

export default Register;
