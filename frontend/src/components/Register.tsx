/**
 * Register Component
 *
 * This component allows users to register by providing a username and password.
 * On successful registration, users are redirected to the Login page.
 * Displays errors if registration fails (e.g. username already exists).
 */

import React, { useState } from "react";
import { register } from "../services/authService"; // Function to send registration request to backend
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "../styles/auth.css"; // Shared CSS for authentication pages

const Register: React.FC = () => {
	const [username, setUsername] = useState(""); // Username state
	const [password, setPassword] = useState(""); // Password state
	const [error, setError] = useState<string | null>(null); // Error message state
	const navigate = useNavigate(); // Hook to programmatically navigate routes

	// Handle form submission
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			// Call register function with username and password
			await register(username, password);
			alert("User registered successfully");

			// Clear form fields and error after success
			setUsername("");
			setPassword("");
			setError(null);

			// Navigate to login page after registration
			navigate("/Login");
		} catch (err: unknown) {
			// Check if the error is from Axios and has a response message
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
				{/* Username input */}
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

				{/* Password input */}
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

				{/* Show error message if any */}
				{error && <div className="error-message">{error}</div>}

				{/* Submit button */}
				<button className="btn-submit" type="submit">
					Register
				</button>
			</form>

			<Link to="/login" className="hover:text-blue-400">
				<a className="btn-submit" type="submit">
					Login
				</a>
			</Link>
		</div>
	);
};

export default Register;
