import axios from "axios";

import APP_CONFIG from "@/config/appConfig";

const api = axios.create({
  baseURL: APP_CONFIG.apiBaseUrl || "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;