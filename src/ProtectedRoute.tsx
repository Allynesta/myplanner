import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "./AuthContext";

const ProtectedRoute: React.FC = () => {
	const authContext = useContext(AuthContext);
	if (!authContext) {
		throw new Error("AuthContext is not provided");
	}
	const { isAuthenticated } = authContext;

	if (!isAuthenticated) {
		return <Navigate to="/login" />;
	}

	return <Outlet />;
};

export default ProtectedRoute;
