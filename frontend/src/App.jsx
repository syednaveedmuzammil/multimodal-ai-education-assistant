import { Routes, Route, Navigate } from "react-router-dom";

// ==============================
// Public Pages
// ==============================

import Login from "@/pages/Login";
import Register from "@/pages/Register";

// ==============================
// Implemented Protected Pages
// ==============================

import Dashboard from "@/pages/Dashboard";
import Chat from "@/pages/Chat";
import Notes from "@/pages/Notes";
import Quiz from "@/pages/Quiz";
import Profile from "@/pages/Profile";

// ==============================
// Route Protection
// ==============================

import ProtectedRoute from "@/components/common/ProtectedRoute";

export default function App() {
  return (
    <Routes>

      {/* =========================================
          Public Routes
      ========================================= */}

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />


      {/* =========================================
          Protected Routes
      ========================================= */}

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/chat"
        element={
          <ProtectedRoute>
            <Chat />
          </ProtectedRoute>
        }
      />

      <Route
        path="/notes"
        element={
          <ProtectedRoute>
            <Notes />
          </ProtectedRoute>
        }
      />

      <Route
        path="/quiz"
        element={
          <ProtectedRoute>
            <Quiz />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />


      {/* =========================================
          Default Route
      ========================================= */}

      <Route
        path="/"
        element={
          <Navigate
            to="/dashboard"
            replace
          />
        }
      />


      {/* =========================================
          Future / Unknown Routes
      ========================================= */}

      <Route
        path="*"
        element={
          <Navigate
            to="/dashboard"
            replace
          />
        }
      />

    </Routes>
  );
}