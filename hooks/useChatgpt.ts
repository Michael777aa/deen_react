import { analyzeText, analyzeVoice } from "@/redux/features/chatgpt/chatgptApi";
import { create } from "zustand";

interface ChatState {
  messages: Array<{
    id: string;
    role: "user" | "assistant" | "system";
    content: string;
    timestamp?: number;
  }>;
  sessionId: string | null;
  blockchainHash: string | null;
  relatedLinks: string[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (text: string, userEmail: string) => Promise<void>;
  sendVoiceMessage: (audioUri: string, userEmail: string) => Promise<void>;
  startNewSession: () => void;
  clearError: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  sessionId: null,
  blockchainHash: null,
  relatedLinks: [],
  isLoading: false,
  error: null,

  sendMessage: async (text, userEmail) => {
    try {
      set({ isLoading: true });
      const { messages, sessionId } = get();

      set({
        messages: [
          ...messages,
          {
            id: Date.now().toString(),
            role: "user",
            content: text,
            timestamp: Date.now(),
          },
        ],
      });

      const response = await analyzeText(
        userEmail,
        text,
        sessionId || undefined
      );

      set({
        messages: [
          ...get().messages,
          {
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,

            role: "assistant",
            content: response.result,
            timestamp: Date.now(),
          },
        ],
        sessionId: response.sessionId,
        blockchainHash: response.blockchainHash,
        relatedLinks: response.links,
        isLoading: false,
      });
    } catch (err) {
      console.error("sendMessage error:", err);
      set({ isLoading: false, error: "Failed to send message." });
    }
  },

  sendVoiceMessage: async (audioUri, userEmail) => {
    try {
      set({ isLoading: true });
      const { messages, sessionId } = get();

      const response = await analyzeVoice(
        audioUri,
        userEmail,
        sessionId || undefined
      );

      set({
        messages: [
          ...messages,
          {
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            role: "user",
            content: "Voice message",
            timestamp: Date.now(),
          },
          {
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            role: "assistant",
            content: response.result,
            timestamp: Date.now(),
          },
        ],

        relatedLinks: response.links,
        isLoading: false,
      });
    } catch (err) {
      console.error("sendVoiceMessage error:", err);
      set({ isLoading: false, error: "Failed to send voice message." });
    }
  },

  startNewSession: () => {
    set({
      messages: [],
      sessionId: null,
      blockchainHash: null,
      relatedLinks: [],
    });
  },

  clearError: () => {
    set({ error: null });
  },
}));
