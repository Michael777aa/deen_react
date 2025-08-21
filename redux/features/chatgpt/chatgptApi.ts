// services/api.ts
import * as FileSystem from "expo-file-system";
import api from "../api/apiSlice";

export const analyzeText = async (text: string, sessionId?: string) => {
  const response = await api.post("/chatgpt/analyze", {
    text,
    sessionId,
  });

  return response.data;
};

export const analyzeVoice = async (audioUri: string, sessionId?: string) => {
  const fileInfo = await FileSystem.getInfoAsync(audioUri);

  if (!fileInfo.exists) {
    throw new Error("Audio file does not exist");
  }

  const formData = new FormData();
  formData.append("audio", {
    uri: audioUri,
    name: "recording.wav",
    type: "audio/wav",
  } as any);
  if (sessionId) {
    formData.append("sessionId", sessionId);
  }

  const response = await api.post("/chatgpt/analyze/voice", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export default api;
