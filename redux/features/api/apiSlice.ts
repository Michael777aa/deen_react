import { tokenCache } from "@/lib/utils/cache";
import axios from "axios";

export const API_BASE_URL = "https://deen-backend-scale-1.onrender.com/api/v1";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});
api.interceptors.request.use(async (config) => {
  const token = await tokenCache?.getToken("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
