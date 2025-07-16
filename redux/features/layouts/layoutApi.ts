import api from "../api/apiSlice";

export const getLayout = async () => {
  const response = await api.get("/layout/current");
  return response.data;
};
