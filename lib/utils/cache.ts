import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const createTokenCache = (): {
  getToken: (key: string) => Promise<string | null>;
  saveToken: (key: string, token: any) => Promise<void>; // changed here
  deleteToken: (key: string) => Promise<void>;
} => {
  return {
    getToken: async (key: string) => {
      try {
        const item = await SecureStore.getItemAsync(key);

        if (item) {
          console.log(`${key} was used 🔐 \n`);
        } else {
          console.log("No values stored under key: " + key);
        }
        return item;
      } catch (error) {
        console.error("secure store get item error: ", error);
        await SecureStore.deleteItemAsync(key);
        return null;
      }
    },

    saveToken: (key: string, token: any) => {
      const stringToken =
        typeof token === "string" ? token : JSON.stringify(token);
      return SecureStore.setItemAsync(key, stringToken);
    },

    deleteToken: (key: string) => {
      return SecureStore.deleteItemAsync(key);
    },
  };
};

export const tokenCache =
  Platform.OS !== "web" ? createTokenCache() : undefined;
