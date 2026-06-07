import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

export default function RequireAdmin({ children }) {
  const isLoggedIn = useSelector((s) => s.auth.isLoggedIn);
  const role = useSelector((s) => s.auth.user?.role ?? null);
  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}
