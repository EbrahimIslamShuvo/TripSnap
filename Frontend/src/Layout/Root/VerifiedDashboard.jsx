import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const VerifiedDashboard = ({ children, role }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/" />;
  }

  let decoded;

  try {
    decoded = jwtDecode(token);
  } catch {
    return <Navigate to="/" />;
  }

  // 🔥 ROLE PROTECTION
  if (role && decoded.role !== role) {
    return <Navigate to="/tripsnap" />;
  }

  return children;
};

export default VerifiedDashboard;