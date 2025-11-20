import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login, changePassword } from "../services/authService";
import { useAuth } from "../AuthContext";
import "../styles/auth.css";

type Mode = "login" | "change";

const Login: React.FC = () => {
	// Main shared fields
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	// Mode control
	const [mode, setMode] = useState<Mode>("login");

	// Change password fields
	const [currentPwd, setCurrentPwd] = useState("");
	const [newPwd, setNewPwd] = useState("");
	const [confirmNewPwd, setConfirmNewPwd] = useState("");
	const [loadingChange, setLoadingChange] = useState(false);

	const { login: authLogin } = useAuth();
	const navigate = useNavigate();

	/* -------------------------------------- */
	/* LOGIN SUBMIT                            */
	/* -------------------------------------- */
	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			const response = await login(username, password);
			authLogin(response.data.token);
			alert("User logged in successfully");
			navigate("/#");
		} catch (error) {
			console.error(error);
			alert("Invalid username or password");
		}
	};

	/* -------------------------------------- */
	/* CHANGE PASSWORD SUBMIT                  */
	/* -------------------------------------- */
	const handleChangePassword = async (e: React.FormEvent) => {
		e.preventDefault();

		if (newPwd !== confirmNewPwd) {
			alert("New passwords do not match");
			return;
		}

		if (newPwd.length < 8) {
			alert("Password must be at least 8 characters");
			return;
		}

		try {
			setLoadingChange(true);

			const resp = await changePassword(username, currentPwd, newPwd);
			alert(resp.data?.message || "Password updated");

			setCurrentPwd("");
			setNewPwd("");
			setConfirmNewPwd("");

			// return back to login mode
			setMode("login");
		} catch (err) {
			console.error("Change password error:", err);

			let msg = "Failed to change password";
			if (typeof err === "object" && err !== null) {
				const e = err as { response?: { data?: { message?: string } } };
				if (e.response?.data?.message) msg = e.response.data.message;
			}

			alert(msg);
		} finally {
			setLoadingChange(false);
		}
	};

	/* -------------------------------------- */
	/* RENDER                                  */
	/* -------------------------------------- */

	return (
		<div className="auth-container">
			<h2 className="auth-title">
				{mode === "login" ? "Login" : "Update Password"}
			</h2>

			<form
				className="auth-form"
				onSubmit={mode === "login" ? handleLogin : handleChangePassword}
			>
				{/* Username always required */}
				<div className="auth-form-group">
					<label>Username:</label>
					<input
						type="text"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						required
					/>
				</div>

				{/* LOGIN MODE ----------------------------------------- */}
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
							<button className="btn-submit" type="submit">
								Login
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

				{/* CHANGE PASSWORD MODE -------------------------------- */}
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
							<button
								className="btn-submit"
								type="submit"
								disabled={loadingChange}
							>
								{loadingChange ? "Updating..." : "Update Password"}
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
			<Link to="/register" className="hover:text-blue-400">
				<a className="btn-submit" type="submit">
					Register
				</a>
			</Link>
		</div>
	);
};

export default Login;
