import api from "../api/apiSlice";

export const getInspiration = async () => {
  const response = await api.get("/inspiration/daily");
  return response.data;
};
