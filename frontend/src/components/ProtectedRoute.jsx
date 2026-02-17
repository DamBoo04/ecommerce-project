import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, adminOnly = false }) {
  // Get token and user from localStorage
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  // Not logged in → redirect to login
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // Admin route → only allow admins
  if (adminOnly && user.role !== "admin") {
    alert("You are not authorized to access this page");
    return <Navigate to="/" replace />;
  }

  // User route → if admin tries to access normal pages (optional)
  if (!adminOnly && user.role === "admin") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  // Authorized → render children
  return children;
}
