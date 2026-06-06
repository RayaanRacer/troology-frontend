import { Navigate, Outlet } from "react-router-dom";
import AuthUser from "../services/AdminService";

const ProtectedRoute = () => {
  const { user } = AuthUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
