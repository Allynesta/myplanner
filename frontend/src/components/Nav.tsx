/**
 * Nav Component
 *
 * This component renders a responsive top navigation bar.
 * It displays links conditionally based on whether the user is authenticated.
 * The menu can collapse into a mobile-friendly version using a hamburger icon.
 */

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext"; // Auth context to manage authentication state
import "../styles/nav.css"; // CSS for the navbar

const Nav = () => {
	const [responsive, setResponsive] = useState(false); // Toggle for responsive menu
	const { isAuthenticated, logout } = useAuth(); // Access authentication state and logout function
	const navigate = useNavigate();

	// Toggle the responsive class on the navbar
	const toggleResponsive = () => {
		setResponsive(!responsive);
	};

	// Collapse the menu when a nav link is clicked (on smaller screens)
	const handleNavLinkClick = () => {
		if (responsive) {
			setResponsive(false);
		}
	};

	// Handle logout: clear auth state, reload the page, and navigate to login
	const handleLogout = () => {
		logout();
		window.location.reload(); // Refresh to reset state
		navigate("/login");
	};

	return (
		<header>
			<nav className={`topnav ${responsive ? "responsive" : ""}`} id="myTopnav">
				{/* Logo link to home */}
				<Link to="/" className="logo" onClick={handleNavLinkClick}>
					MyPlanner
				</Link>

				{/* Links for authenticated users */}
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

				{/* Links for guests (not authenticated) */}
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

				{/* Hamburger menu icon (only visible on small screens) */}
				<Link to="#" className="icon" onClick={toggleResponsive}>
					<i className="fa fa-bars">☰</i>
				</Link>
			</nav>
		</header>
	);
};

export default Nav;
