import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  /*
   * ==========================================
   * TODO (Backend Integration)
   * Replace this with AuthContext or JWT check.
   *
   * Example:
   * const { isAuthenticated } = useAuth();
   * ==========================================
   */

  const isAuthenticated = true;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}