import { tokenCache } from "@/lib/utils/cache";
import axios from "axios";

export const API_BASE_URL = "https://0110f74597a0.ngrok-free.app/api/v1";

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
4;
export default api;
