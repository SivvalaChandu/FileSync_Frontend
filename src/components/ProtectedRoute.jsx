import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useContext(AuthContext);
  const location = useLocation();

  if (isLoading) {
    return <div>Loading...</div>; // Consider using a proper loading component
  }

  if (!isAuthenticated) {
    return <Navigate to="/sign" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
