import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login, changePassword } from "../services/authService";
import { useAuth } from "../AuthContext";
import { useToast } from "../ToastContext";
import "../styles/auth.css";

type Mode = "login" | "change";

const Login: React.FC = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [mode, setMode] = useState<Mode>("login");
	const [currentPwd, setCurrentPwd] = useState("");
	const [newPwd, setNewPwd] = useState("");
	const [confirmNewPwd, setConfirmNewPwd] = useState("");
	const [loading, setLoading] = useState(false);

	const { login: authLogin } = useAuth();
	const { showToast } = useToast();
	const navigate = useNavigate();

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		try {
			const response = await login(username, password);
			authLogin(response.data.token);
			showToast("Logged in successfully!", "success");
			navigate("/");
		} catch (error) {
			console.error(error);
			showToast("Invalid username or password", "error");
		} finally {
			setLoading(false);
		}
	};

	const handleChangePassword = async (e: React.FormEvent) => {
		e.preventDefault();
		if (newPwd !== confirmNewPwd) {
			showToast("New passwords do not match", "error");
			return;
		}
		if (newPwd.length < 8) {
			showToast("Password must be at least 8 characters", "error");
			return;
		}
		setLoading(true);
		try {
			const resp = await changePassword(username, currentPwd, newPwd);
			showToast(resp.data?.message || "Password updated successfully!", "success");
			setCurrentPwd("");
			setNewPwd("");
			setConfirmNewPwd("");
			setMode("login");
		} catch (err) {
			console.error("Change password error:", err);
			let msg = "Failed to change password";
			if (typeof err === "object" && err !== null) {
				const e = err as { response?: { data?: { message?: string } } };
				if (e.response?.data?.message) msg = e.response.data.message;
			}
			showToast(msg, "error");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="auth-container">
			<h2 className="auth-title">
				{mode === "login" ? "Login" : "Update Password"}
			</h2>

			<form
				className="auth-form"
				onSubmit={mode === "login" ? handleLogin : handleChangePassword}
			>
				<div className="auth-form-group">
					<label>Username:</label>
					<input
						type="text"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						required
					/>
				</div>

				{mode === "login" && (
					<>
						<div className="auth-form-group">
							<label>Password:</label>
							<input
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
							/>
							<button className="btn-submit" type="submit" disabled={loading}>
								{loading ? "Logging in…" : "Login"}
							</button>
						</div>
						<button
							type="button"
							className="btn-link"
							onClick={() => setMode("change")}
						>
							Change password instead?
						</button>
					</>
				)}

				{mode === "change" && (
					<>
						<div className="auth-form-group">
							<label>Current password:</label>
							<input
								type="password"
								value={currentPwd}
								onChange={(e) => setCurrentPwd(e.target.value)}
								required
							/>
						</div>
						<div className="auth-form-group">
							<label>New password:</label>
							<input
								type="password"
								value={newPwd}
								onChange={(e) => setNewPwd(e.target.value)}
								required
							/>
						</div>
						<div className="auth-form-group">
							<label>Confirm new password:</label>
							<input
								type="password"
								value={confirmNewPwd}
								onChange={(e) => setConfirmNewPwd(e.target.value)}
								required
							/>
						</div>
						<div className="auth-form-group">
							<button className="btn-submit" type="submit" disabled={loading}>
								{loading ? "Updating…" : "Update Password"}
							</button>
						</div>
						<button
							type="button"
							className="btn-link"
							onClick={() => setMode("login")}
						>
							← Back to login
						</button>
					</>
				)}
			</form>

			<Link to="/register" className="btn-submit block text-center mt-2">
				Register
			</Link>
		</div>
	);
};

export default Login;
