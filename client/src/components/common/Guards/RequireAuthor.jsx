import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function RequireAuthor({ children }) {
  const { user } = useSelector((s) => s.auth || { user: null });
  if (!user) return <Navigate to="/author/login" replace />;
  if (!["author", "admin"].includes(user.role)) return <Navigate to="/author/login" replace />;
  return children;
}
