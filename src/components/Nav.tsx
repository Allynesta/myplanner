import { Link } from "react-router-dom";

const Nav = () => {
	return (
		<nav>
			<ul className="navList">
				<li>
					<Link to="/">Home</Link>
				</li>
				<li>
					<Link to="/Dashboard">Dashboard</Link>
				</li>
				<li>
					<Link to="/PlannerPage">My Calendar</Link>
				</li>
				<li>
					<Link to="/Report-Table">Report Table</Link>
				</li>

				<li>
					<Link to="/Report-Card">Report Card</Link>
				</li>
			</ul>
		</nav>
	);
};

export default Nav;
