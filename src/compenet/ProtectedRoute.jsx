import { Navigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";

const ProtectedRoute = ({ allowedRole }) => {
  const token = Cookies.get("token");
  const userRole = Cookies.get("role");
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && userRole !== allowedRole) {
    return <Navigate to={`/${userRole}/dashboard`} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;