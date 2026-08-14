import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  /*
   * ==========================================
   * MOCK AUTHENTICATION
   * ==========================================
   *
   * Currently enabled so we can develop and
   * test protected pages without a backend.
   *
   * TODO (Module 4):
   * Replace this with AuthContext / JWT check.
   *
   * Example:
   *
   * const { isAuthenticated } = useAuth();
   *
   * ==========================================
   */

  const isAuthenticated = true;

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  return children;
}