import { create } from "zustand";

type AnalyticsState = {
  data: any | null;
  isLoading: boolean;
  error: string | null;
  fetchAnalytics: () => Promise<void>;
};

// Mock analytics data
const mockAnalyticsData: any = {
  dailyActivity: [5, 8, 12, 7, 10, 15, 9],
  featureUsage: [
    { name: "AI Chat", count: 45 },
    { name: "Prayer Times", count: 78 },
    { name: "Quran Reading", count: 32 },
    { name: "Duas", count: 28 },
    { name: "Articles", count: 15 },
  ],
  prayerTracking: [
    { name: "Fajr", completed: 5, total: 7 },
    { name: "Dhuhr", completed: 6, total: 7 },
    { name: "Asr", completed: 7, total: 7 },
    { name: "Maghrib", completed: 7, total: 7 },
    { name: "Isha", completed: 6, total: 7 },
  ],
};

export const useAnalyticsStore = create<AnalyticsState>((set) => ({
  data: null,
  isLoading: false,
  error: null,
  fetchAnalytics: async () => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      set({ data: mockAnalyticsData, isLoading: false });
    } catch (error) {
      set({ error: "Failed to fetch analytics", isLoading: false });
    }
  },
}));
