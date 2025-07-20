// services/api.ts
import * as FileSystem from "expo-file-system";
import api from "../api/apiSlice";
import axios from "axios";

export const analyzeText = async (
  userEmail: string,
  text: string,
  sessionId?: string
) => {
  const response = await axios.post(
    "http://localhost:4330/api/v1/chatgpt/analyze",
    {
      userEmail,
      text,
      sessionId,
    }
  );

  return response.data;
};

export const analyzeVoice = async (
  audioUri: string,
  userEmail: string,
  sessionId?: string
) => {
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
  formData.append("userEmail", userEmail);
  if (sessionId) {
    formData.append("sessionId", sessionId);
  }

  const response = await axios.post(
    "http://localhost:4330/api/v1/chatgpt/analyze/voice",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

export default api;
