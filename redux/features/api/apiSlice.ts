import axios from "axios";

export const API_BASE_URL = "http://localhost:4335/api/v1";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});
// api.interceptors.request.use(async (config) => {
//   const token = await tokenCache?.getToken("accessToken");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

export default api;
