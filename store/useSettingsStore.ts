import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

type NotificationType = 'adhan' | 'vibration' | 'text';

type SettingsState = {
  darkMode: boolean;
  language: string;
  notifications: boolean;
  prayerReminders: boolean;
  dailyQuote: boolean;
  notificationType: NotificationType;
  locationEnabled: boolean;
  downloadEnabled: boolean;
  fontSizeQuran: number;
  fontSizeApp: number;
  appTheme: string;
  toggleDarkMode: () => void;
  setLanguage: (language: string) => void;
  toggleNotifications: () => void;
  togglePrayerReminders: () => void;
  toggleDailyQuote: () => void;
  setNotificationType: (type: NotificationType) => void;
  toggleLocationEnabled: () => void;
  toggleDownloadEnabled: () => void;
  setFontSizeQuran: (size: number) => void;
  setFontSizeApp: (size: number) => void;
  setAppTheme: (theme: string) => void;
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      darkMode: false,
      language: 'en',
      notifications: true,
      prayerReminders: true,
      dailyQuote: true,
      notificationType: 'adhan',
      locationEnabled: true,
      downloadEnabled: true,
      fontSizeQuran: 18,
      fontSizeApp: 16,
      appTheme: 'default',
      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
      setLanguage: (language) => set({ language }),
      toggleNotifications: () => set((state) => ({ notifications: !state.notifications })),
      togglePrayerReminders: () => set((state) => ({ prayerReminders: !state.prayerReminders })),
      toggleDailyQuote: () => set((state) => ({ dailyQuote: !state.dailyQuote })),
      setNotificationType: (type) => set({ notificationType: type }),
      toggleLocationEnabled: () => set((state) => ({ locationEnabled: !state.locationEnabled })),
      toggleDownloadEnabled: () => set((state) => ({ downloadEnabled: !state.downloadEnabled })),
      setFontSizeQuran: (size) => set({ fontSizeQuran: size }),
      setFontSizeApp: (size) => set({ fontSizeApp: size }),
      setAppTheme: (theme) => set({ appTheme: theme }),
    }),
    {
      name: 'settings-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);