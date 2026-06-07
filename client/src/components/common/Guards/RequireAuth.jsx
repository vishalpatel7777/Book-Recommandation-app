import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

export default function RequireAuth({ children }) {
  const isLoggedIn = useSelector((s) => s.auth.isLoggedIn);
  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
