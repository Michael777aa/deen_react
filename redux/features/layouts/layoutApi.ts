import api from "../api/apiSlice";

export const getLayout = async () => {
  const response = await api.get("/layout");
  return response.data;
};
