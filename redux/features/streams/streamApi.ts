// src/services/stream.service.ts
import api from "@/redux/features/api/apiSlice";
import { Stream, StreamInput, StreamUpdateInput } from "@/types/stream";
import { StreamType } from "@/types/stream.enum";

export const StreamService = {
  async getAllStreams(): Promise<Stream[]> {
    const response = await api.get("/str/streams", {});
    return response.data;
  },

  async getLiveStreams(): Promise<Stream[]> {
    const response = await api.get("/str/streams/live", {});
    return response.data;
  },

  async getUpcomingStreams(): Promise<Stream[]> {
    const response = await api.get("/str/streams/upcoming", {});
    return response.data;
  },

  async getRecordedStreams(): Promise<Stream[]> {
    const response = await api.get("/str/streams/recorded", {});
    return response.data;
  },

  async getStreamsByType(type: StreamType): Promise<Stream[]> {
    const response = await api.get(`/str/streams/type/${type}`, {});
    return response.data;
  },

  async getStreamById(id: string): Promise<Stream> {
    const response = await api.get(`/str/streams/${id}`, {});
    return response.data;
  },

  async createNewStream(input: StreamInput): Promise<Stream> {
    const response = await api.post("/str/streams/create", input, {});
    return response.data;
  },

  async updateChosenStream(
    id: string,
    input: StreamUpdateInput
  ): Promise<Stream> {
    const response = await api.post(`/str/streams/update/${id}`, input, {});
    return response.data;
  },

  async deleteChosenStream(id: string): Promise<void> {
    await api.post(`/str/streams/delete/${id}`, {});
  },

  async startStream(id: string): Promise<Stream> {
    const response = await api.post(`/str/streams/${id}/start`, {});
    return response.data;
  },

  async endStream(id: string): Promise<Stream> {
    const response = await api.post(`/str/streams/${id}/end`, {});
    return response.data;
  },

  async likeStream(id: string): Promise<Stream> {
    const response = await api.post(`/str/streams/${id}/like`, {});
    return response.data;
  },

  async addComment(id: string, userId: string, text: string): Promise<Stream> {
    const response = await api.post(`/str/streams/${id}/comment`, {
      userId,
      text,
    });
    return response.data;
  },

  async quickStartStream(input: StreamInput): Promise<Stream> {
    const response = await api.post("/str/streams/quick-start", input, {});
    return response.data;
  },
};
