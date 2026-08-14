import { Navigate, useLocation } from "react-router-dom";

import { useAuth } from "@/contexts/AuthContext";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  const location = useLocation();

  /*
   * ==========================================================
   * Loading State
   * ==========================================================
   *
   * Prevent redirecting while authentication state is being
   * restored from localStorage.
   */

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted">
          Loading...
        </div>
      </div>
    );
  }

  /*
   * ==========================================================
   * Authentication Check
   * ==========================================================
   */

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location.pathname,
        }}
      />
    );
  }

  return children;
}