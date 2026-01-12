import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * ProtectedRoute Component
 * Higher-order route component that protects child routes from unauthorized access.
 *
 * @description
 * - Checks if user is authenticated via AuthContext
 * - Renders child routes (<Outlet />) if authenticated
 * - Redirects to signin page if not authenticated
 * - Uses `replace: true` to prevent back-button navigation to protected routes
 */
const ProtectedRoute = () => {
  const { user } = useAuth();

  /**
   * Authentication Check
   * If no user exists (null/undefined), redirect to signin
   * Preserves original navigation state with `replace: true`
   */
  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  /**
   * Render Protected Child Routes
   * <Outlet /> renders the first matching child route
   * Used in nested route configurations
   */
  return <Outlet />;
};

export default ProtectedRoute;
