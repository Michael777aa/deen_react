import { create } from 'zustand';
import { ChatMessage } from '@/types';

type ChatState = {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  sendMessage: (content: string) => Promise<void>;
  clearMessages: () => void;
};

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [
    {
      id: '1',
      role: 'system',
      content: 'I am an AI assistant that can help with Islamic knowledge. Ask me anything about Islam, the Quran, Hadith, or Islamic practices.',
      timestamp: new Date().toISOString(),
    },
    {
      id: '2',
      role: 'assistant',
      content: 'Assalamu alaikum! I am your Islamic knowledge assistant. How can I help you today?',
      timestamp: new Date().toISOString(),
    },
  ],
  isLoading: false,
  error: null,
  addMessage: (message) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      ...message,
    };
    set((state) => ({
      messages: [...state.messages, newMessage],
    }));
  },
  sendMessage: async (content) => {
    const userMessage: Omit<ChatMessage, 'id' | 'timestamp'> = {
      role: 'user',
      content,
    };
    
    get().addMessage(userMessage);
    set({ isLoading: true });
    
    try {
      // Simulate API call to AI service
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, this would be an API call to your AI service
      let response = '';
      
      if (content.toLowerCase().includes('quran')) {
        response = "The Quran is the central religious text of Islam. Muslims believe it was revealed to the Prophet Muhammad (peace be upon him) by the angel Gabriel over a period of approximately 23 years, beginning in 610 CE.";
      } else if (content.toLowerCase().includes('prayer') || content.toLowerCase().includes('salah')) {
        response = "Prayer (Salah) is one of the Five Pillars of Islam. Muslims pray five times a day: Fajr (dawn), Dhuhr (noon), Asr (afternoon), Maghrib (sunset), and Isha (night).";
      } else if (content.toLowerCase().includes('hadith')) {
        response = "Hadith are the recorded sayings, actions, and silent approvals of the Prophet Muhammad (peace be upon him). They are considered the second most important source of Islamic law and guidance after the Quran.";
      } else if (content.toLowerCase().includes('dua')) {
        response = "Dua is the act of supplication or asking Allah for assistance, guidance, or blessings. It is a form of worship and a way to communicate directly with Allah.";
      } else {
        response = "Thank you for your question. In Islam, seeking knowledge is highly encouraged. The Prophet Muhammad (peace be upon him) said: 'Seeking knowledge is obligatory upon every Muslim.' Is there something specific about Islamic teachings you would like to know more about?";
      }
      
      const assistantMessage: Omit<ChatMessage, 'id' | 'timestamp'> = {
        role: 'assistant',
        content: response,
      };
      
      get().addMessage(assistantMessage);
      set({ isLoading: false });
    } catch (error) {
      set({ error: 'Failed to get response', isLoading: false });
    }
  },
  clearMessages: () => {
    set({
      messages: [
        {
          id: '1',
          role: 'system',
          content: 'I am an AI assistant that can help with Islamic knowledge. Ask me anything about Islam, the Quran, Hadith, or Islamic practices.',
          timestamp: new Date().toISOString(),
        },
        {
          id: '2',
          role: 'assistant',
          content: 'Assalamu alaikum! I am your Islamic knowledge assistant. How can I help you today?',
          timestamp: new Date().toISOString(),
        },
      ],
    });
  },
}));