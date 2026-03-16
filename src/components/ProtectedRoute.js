import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) return <Navigate to="/" />;

  if (role !== "admin") {
    localStorage.clear();
    return <Navigate to="/" />;
  }

  return children;
}


export default ProtectedRoute;
