import { API_BASE_URL } from "@/redux/features/api/apiSlice";

export type AuthUser = {
  sub: string;
  email: string;
  name: string;
  picture?: string;
  provider?: string;
  exp?: number;
  userType: string;
};
export const staticBase = API_BASE_URL.replace("/api/v1", "");
