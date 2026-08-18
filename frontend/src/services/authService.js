import api from "@/services/api";

/*
 * ============================================================
 * Authentication Service
 * ============================================================
 *
 * Authentication API layer for LearnMate AI.
 *
 * Current frontend development uses MOCK authentication in
 * AuthContext because the FastAPI backend is not implemented yet.
 *
 * These functions define the contract that will be used once
 * the backend is connected.
 * ============================================================
 */

/**
 * Register a new user.
 *
 * Backend:
 * POST /api/auth/register
 */
export async function registerUser({
  name,
  email,
  password,
}) {
  const response = await api.post("/auth/register", {
    name,
    email,
    password,
  });

  return response.data;
}

/**
 * Login a user.
 *
 * Backend:
 * POST /api/auth/login
 */
export async function loginUser({
  email,
  password,
}) {
  const response = await api.post("/auth/login", {
    email,
    password,
  });

  return response.data;
}

/**
 * Get the currently authenticated user.
 *
 * Backend:
 * GET /api/auth/me
 */
export async function getCurrentUser() {
  const response = await api.get("/auth/me");

  return response.data;
}

/**
 * Logout.
 *
 * Currently handled entirely on the frontend.
 *
 * TODO (Backend Integration):
 * Add a backend logout/revocation request if the final
 * authentication architecture requires token revocation.
 */
export function logoutUser() {
  return Promise.resolve();
}