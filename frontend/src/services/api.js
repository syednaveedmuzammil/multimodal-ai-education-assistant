import axios from "axios";

import axiosConfig, {
  attachAuthToken,
} from "@/config/axiosConfig";

const api = axios.create(axiosConfig);

/*
 * ============================================================
 * Request Interceptor
 * ============================================================
 */

api.interceptors.request.use(
  attachAuthToken,
  (error) => Promise.reject(error)
);

/*
 * ============================================================
 * Response Interceptor
 * ============================================================
 *
 * For now we simply pass successful responses through.
 *
 * JWT expiration handling will be added when the FastAPI
 * backend is connected.
 * ============================================================
 */

api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

export default api;