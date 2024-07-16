import { useState } from "react";
import { Link } from "react-router-dom";

const Nav = () => {
	const [responsive, setResponsive] = useState(false);

	const toggleResponsive = () => {
		setResponsive(!responsive);
	};

	const handleNavLinkClick = () => {
		// Close the responsive menu after clicking a nav link on mobile
		if (responsive) {
			setResponsive(false);
		}
	};

	return (
		<header>
			{" "}
			<nav className={`topnav ${responsive ? "responsive" : ""}`} id="myTopnav">
				<Link to="/" onClick={handleNavLinkClick}>
					Home
				</Link>
				<Link to="/Dashboard" onClick={handleNavLinkClick}>
					Dashboard
				</Link>
				<Link to="/PlannerPage" onClick={handleNavLinkClick}>
					My Calendar
				</Link>
				<Link to="/Report-Table" onClick={handleNavLinkClick}>
					Report Table
				</Link>
				<Link to="/Report-Card" onClick={handleNavLinkClick}>
					Report Card
				</Link>
				<Link to="#" className="icon" onClick={toggleResponsive}>
					<i className="fa fa-bars"></i>x
				</Link>
			</nav>
		</header>
	);
};

export default Nav;
