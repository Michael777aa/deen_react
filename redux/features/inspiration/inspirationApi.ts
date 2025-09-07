import api from "../api/apiSlice";

export const getInspiration = async () => {
  const response = await api.get("/inspiration/daily");
  return response.data;
};

export const createInspiration = async (quote: string, attribution: string) => {
  const response = await api.post("/inspiration/create", {
    quote,
    attribution,
  });

  return response.data;
};
