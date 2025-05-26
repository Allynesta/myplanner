/**
 * Login Component
 *
 * This component renders a login form where users can input their username and password.
 * Upon submission, it attempts to authenticate the user via the `login` function from `authService`.
 * If successful, the user token is saved using the `AuthContext`, and the user is redirected.
 */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService"; // Auth service for API call
import { useAuth } from "../AuthContext"; // Context for managing auth state
import "../styles/auth.css"; // Styling for auth pages

const Login: React.FC = () => {
	const [username, setUsername] = useState(""); // Input state for username
	const [password, setPassword] = useState(""); // Input state for password
	const { login: authLogin } = useAuth(); // Access context login method
	const navigate = useNavigate(); // Navigation after successful login

	// Handle form submission
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const response = await login(username, password); // Call API
			authLogin(response.data.token); // Save token in context
			alert("User logged in successfully");
			navigate("/#"); // Redirect user to homepage or dashboard
		} catch (error) {
			alert("Error logging in"); // Error handling
		}
	};

	return (
		<div className="auth-container">
			<h2 className="auth-title">Login</h2>
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
				<button className="btn-submit" type="submit">
					Login
				</button>
			</form>
		</div>
	);
};

export default Login;
