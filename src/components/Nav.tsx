import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

const Nav = () => {
	const [responsive, setResponsive] = useState(false);
	const { isAuthenticated, logout } = useAuth();
	const navigate = useNavigate();

	const toggleResponsive = () => {
		setResponsive(!responsive);
	};

	const handleNavLinkClick = () => {
		// Close the responsive menu after clicking a nav link on mobile
		if (responsive) {
			setResponsive(false);
		}
	};

	const handleLogout = () => {
		logout();
		window.location.reload();
		navigate("/login");
	};

	return (
		<header>
			<nav className={`topnav ${responsive ? "responsive" : ""}`} id="myTopnav">
				<Link to="/" onClick={handleNavLinkClick}>
					Home
				</Link>
				{isAuthenticated && (
					<>
						<Link to="/Dashboard" onClick={handleNavLinkClick}>
							Dashboard
						</Link>

						<Link to="/Report-Table" onClick={handleNavLinkClick}>
							Report Table
						</Link>
						<Link to="/Report-Card" onClick={handleNavLinkClick}>
							Report Card
						</Link>
						<Link to="#" onClick={handleLogout}>
							Logout
						</Link>
					</>
				)}
				{!isAuthenticated && (
					<>
						<Link to="/register" onClick={handleNavLinkClick}>
							Register
						</Link>
						<Link to="/login" onClick={handleNavLinkClick}>
							Login
						</Link>
					</>
				)}
				<Link to="#" className="icon" onClick={toggleResponsive}>
					<i className="fa fa-bars"></i>
				</Link>
			</nav>
		</header>
	);
};

export default Nav;
