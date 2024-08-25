import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService";
import { useAuth } from "../AuthContext";
import "../styles/auth.css"; // Assuming the CSS file is named "auth.css"

const Login: React.FC = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const { login: authLogin } = useAuth();
	const navigate = useNavigate();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const response = await login(username, password);
			authLogin(response.data.token);
			alert("User logged in successfully");
			navigate("/#");
		} catch (error) {
			alert("Error logging in");
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
