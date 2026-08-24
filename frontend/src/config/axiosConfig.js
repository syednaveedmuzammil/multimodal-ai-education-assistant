import APP_CONFIG from "@/config/appConfig";
import { getAccessToken } from "@/utils/storage";

const axiosConfig = {
  baseURL:
    APP_CONFIG.apiBaseUrl ||
    "http://localhost:8000/api",

  headers: {
    "Content-Type": "application/json",
  },
};

/*
 * ============================================================
 * Request Interceptor
 * ============================================================
 *
 * Automatically attaches the JWT access token to requests.
 *
 * Result:
 *
 * Authorization: Bearer <JWT>
 *
 * TODO (Backend Integration):
 * This becomes active when the frontend starts making
 * authenticated requests to FastAPI.
 * ============================================================
 */

export const attachAuthToken = (config) => {
  const token = getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
};

export default axiosConfig;