import api from "../api/apiSlice";

// 📌 Get all duas
export const getAllDuas = async () => {
  const response = await api.get("/dua");
  return response.data;
};

// 📌 Get dua by ID
export const getDuaById = async (id: string) => {
  const response = await api.get(`/dua/${id}`);
  return response.data;
};

// 📌 Get duas by category
export const getDuasByCategory = async (categoryId: string) => {
  const response = await api.get(`/dua/category/${categoryId}`);
  return response.data;
};

// 📌 Create new dua (Moderator only)
export const createDua = async (dua: {
  category: string;
  title: string;
  arabic: string;
  transliteration?: string;
  translation: string;
  reference?: string;
}) => {
  const response = await api.post("/dua/create", dua);
  return response.data;
};

// 📌 Update dua
export const updateDua = async (id: string, dua: Partial<typeof createDua>) => {
  const response = await api.put(`/dua/${id}`, dua);
  return response.data;
};

// 📌 Delete dua
export const deleteDua = async (id: string) => {
  const response = await api.delete(`/dua/${id}`);
  return response.data;
};
