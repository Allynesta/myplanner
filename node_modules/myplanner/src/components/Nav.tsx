import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

const Nav = () => {
	const [isOpen, setIsOpen] = useState(false);
	const { isAuthenticated, logout } = useAuth();
	const navigate = useNavigate();

	const toggleMenu = () => setIsOpen(!isOpen);

	const handleNavLinkClick = () => {
		if (isOpen) setIsOpen(false);
	};

	const handleLogout = () => {
		logout();
		window.location.reload();
		navigate("/login");
	};

	return (
		<header className="bg-gray-800 text-white shadow-md sticky top-0 z-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between h-16 items-center">
					{/* Logo */}
					<Link
						to="/"
						className="text-2xl font-bold hover:text-blue-400"
						onClick={handleNavLinkClick}
					>
						MyPlanner
					</Link>

					{/* Desktop Menu */}
					<div className="hidden md:flex space-x-6">
						{isAuthenticated ? (
							<>
								<Link
									to="/Dashboard"
									className="hover:text-blue-400"
									onClick={handleNavLinkClick}
								>
									Dashboard
								</Link>
								<Link
									to="/Report-Table"
									className="hover:text-blue-400"
									onClick={handleNavLinkClick}
								>
									Report Table
								</Link>
								<Link
									to="/Report-Card"
									className="hover:text-blue-400"
									onClick={handleNavLinkClick}
								>
									Report Card
								</Link>
								<button onClick={handleLogout} className="hover:text-red-400">
									Logout
								</button>
							</>
						) : (
							<>
								<Link
									to="/register"
									className="hover:text-blue-400"
									onClick={handleNavLinkClick}
								>
									Register
								</Link>
								<Link
									to="/login"
									className="hover:text-blue-400"
									onClick={handleNavLinkClick}
								>
									Login
								</Link>
							</>
						)}
					</div>

					{/* Mobile Menu Button */}
					<div className="md:hidden flex items-center">
						<button
							onClick={toggleMenu}
							className="text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-400"
						>
							{/* Hamburger icon */}
							<svg
								className="h-6 w-6"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								aria-hidden="true"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d={
										isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"
									}
								/>
							</svg>
						</button>
					</div>
				</div>
			</div>

			{/* Mobile Menu */}
			{isOpen && (
				<div className="md:hidden bg-gray-800 px-2 pt-2 pb-3 space-y-1">
					{isAuthenticated ? (
						<>
							<Link
								to="/Dashboard"
								className="block px-3 py-2 rounded hover:bg-gray-700"
								onClick={handleNavLinkClick}
							>
								Dashboard
							</Link>
							<Link
								to="/Report-Table"
								className="block px-3 py-2 rounded hover:bg-gray-700"
								onClick={handleNavLinkClick}
							>
								Report Table
							</Link>
							<Link
								to="/Report-Card"
								className="block px-3 py-2 rounded hover:bg-gray-700"
								onClick={handleNavLinkClick}
							>
								Report Card
							</Link>
							<button
								onClick={handleLogout}
								className="w-full text-left px-3 py-2 rounded hover:bg-red-600"
							>
								Logout
							</button>
						</>
					) : (
						<>
							<Link
								to="/register"
								className="block px-3 py-2 rounded hover:bg-gray-700"
								onClick={handleNavLinkClick}
							>
								Register
							</Link>
							<Link
								to="/login"
								className="block px-3 py-2 rounded hover:bg-gray-700"
								onClick={handleNavLinkClick}
							>
								Login
							</Link>
						</>
					)}
				</div>
			)}
		</header>
	);
};

export default Nav;
