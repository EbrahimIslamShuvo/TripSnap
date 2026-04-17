import { Navigate } from "react-router-dom";

const VerifiedUser = ({ children }) => {
  const token = localStorage.getItem("token");

  // no token → block
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // token exists → allow access
  return children;
};

export default VerifiedUser;