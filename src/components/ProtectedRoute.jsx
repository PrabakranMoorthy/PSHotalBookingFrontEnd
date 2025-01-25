import React from "react";
import { Navigate } from "react-router-dom";

// ProtectedRoute component: Protect routes based on user role (admin/user)
const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");
  const user = token ? JSON.parse(atob(token.split(".")[1])) : null; // Decode JWT token
  const userRole = user?.role;

  // If there's no token or user role isn't allowed, redirect to login
  if (!token || !allowedRoles.includes(userRole)) {
    return <Navigate to="/login" />;
  }

  return children; // If role is allowed, render the component
};

export default ProtectedRoute;
