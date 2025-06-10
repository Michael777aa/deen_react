import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stream, StreamType, StreamCategory } from '@/mocks/streamData';

type StreamState = {
  favoriteStreams: string[];
  watchHistory: {
    streamId: string;
    timestamp: string;
    watchedDuration: number;
  }[];
  notifications: {
    enabled: boolean;
    upcomingReminders: boolean;
    favoriteStreamsOnly: boolean;
  };
  addToFavorites: (streamId: string) => void;
  removeFromFavorites: (streamId: string) => void;
  addToWatchHistory: (streamId: string, duration: number) => void;
  clearWatchHistory: () => void;
  toggleNotifications: () => void;
  toggleUpcomingReminders: () => void;
  toggleFavoriteStreamsOnly: () => void;
  isFavorite: (streamId: string) => boolean;
};

export const useStreamStore = create<StreamState>()(
  persist(
    (set, get) => ({
      favoriteStreams: [],
      watchHistory: [],
      notifications: {
        enabled: true,
        upcomingReminders: true,
        favoriteStreamsOnly: false,
      },
      addToFavorites: (streamId) => {
        set((state) => ({
          favoriteStreams: [...state.favoriteStreams, streamId],
        }));
      },
      removeFromFavorites: (streamId) => {
        set((state) => ({
          favoriteStreams: state.favoriteStreams.filter((id) => id !== streamId),
        }));
      },
      addToWatchHistory: (streamId, duration) => {
        set((state) => {
          // Check if stream is already in history
          const existingIndex = state.watchHistory.findIndex(
            (item) => item.streamId === streamId
          );
          
          if (existingIndex !== -1) {
            // Update existing entry
            const updatedHistory = [...state.watchHistory];
            updatedHistory[existingIndex] = {
              streamId,
              timestamp: new Date().toISOString(),
              watchedDuration: duration,
            };
            return { watchHistory: updatedHistory };
          } else {
            // Add new entry
            return {
              watchHistory: [
                ...state.watchHistory,
                {
                  streamId,
                  timestamp: new Date().toISOString(),
                  watchedDuration: duration,
                },
              ],
            };
          }
        });
      },
      clearWatchHistory: () => {
        set({ watchHistory: [] });
      },
      toggleNotifications: () => {
        set((state) => ({
          notifications: {
            ...state.notifications,
            enabled: !state.notifications.enabled,
          },
        }));
      },
      toggleUpcomingReminders: () => {
        set((state) => ({
          notifications: {
            ...state.notifications,
            upcomingReminders: !state.notifications.upcomingReminders,
          },
        }));
      },
      toggleFavoriteStreamsOnly: () => {
        set((state) => ({
          notifications: {
            ...state.notifications,
            favoriteStreamsOnly: !state.notifications.favoriteStreamsOnly,
          },
        }));
      },
      isFavorite: (streamId) => {
        return get().favoriteStreams.includes(streamId);
      },
    }),
    {
      name: 'stream-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);