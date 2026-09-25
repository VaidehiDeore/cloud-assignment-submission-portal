import { Navigate } from "react-router-dom";
import { isLoggedIn, getUser } from "../utils/auth";

export default function ProtectedRoute({ children, roles }) {
  if (!isLoggedIn()) return <Navigate to="/login" replace />;

  const user = getUser();
  if (roles && user && !roles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
