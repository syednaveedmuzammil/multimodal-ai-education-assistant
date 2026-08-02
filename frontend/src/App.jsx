import { Routes, Route, Navigate } from "react-router-dom";

/*
|--------------------------------------------------------------------------
| Pages
|--------------------------------------------------------------------------
|
| These pages will be created in the next modules.
| For now they are placeholders.
|
*/

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Chat from "./pages/Chat";
import Notes from "./pages/Notes";
import Quiz from "./pages/Quiz";
import Profile from "./pages/Profile";
import ProtectedRoute from "@/components/common/ProtectedRoute";


/*
|--------------------------------------------------------------------------
| Route Protection
|--------------------------------------------------------------------------
|
| TODO:
| Replace with actual authentication check using JWT
|
*/

export default function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/dashboard" element={<Dashboard />} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      {/* Protected Routes */}
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

      {/* Unknown Route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}