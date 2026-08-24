import api from "@/services/api";

/*
 * ============================================================
 * Authentication Service
 * ============================================================
 *
 * Frontend authentication API layer.
 *
 * Expected FastAPI endpoints:
 *
 * POST /auth/register
 * POST /auth/login
 * GET  /auth/me
 *
 * The backend will return a JWT access token after
 * successful authentication.
 * ============================================================
 */

/**
 * Register a new user.
 *
 * POST /auth/register
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
 * Login an existing user.
 *
 * POST /auth/login
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
 * GET /auth/me
 *
 * The Axios interceptor automatically attaches:
 *
 * Authorization: Bearer <token>
 */
export async function getCurrentUser() {
  const response = await api.get("/auth/me");

  return response.data;
}

/**
 * Backend logout.
 *
 * Currently the frontend clears its local token.
 *
 * If the backend later implements token revocation,
 * this function can be updated accordingly.
 */
export function logoutUser() {
  return Promise.resolve();
}