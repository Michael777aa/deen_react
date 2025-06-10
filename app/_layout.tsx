import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { useColorScheme } from "react-native";
import { useSettingsStore } from "@/store/useSettingsStore";
import { trpc, trpcClient } from "@/lib/trpc";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

// Create a client
const queryClient = new QueryClient();

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { darkMode } = useSettingsStore();
  const colorScheme = useColorScheme();
  
  const [loaded, error] = useFonts({
    ...FontAwesome.font,
  });

  // Sync system color scheme with our settings
  useEffect(() => {
    if (colorScheme) {
      // Only sync if user hasn't explicitly set a preference
      const userHasSetPreference = useSettingsStore.getState().darkMode !== null;
      if (!userHasSetPreference) {
        useSettingsStore.getState().toggleDarkMode();
      }
    }
  }, [colorScheme]);

  useEffect(() => {
    if (error) {
      console.error(error);
    }
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <RootLayoutNav />
      </QueryClientProvider>
    </trpc.Provider>
  );
}

function RootLayoutNav() {
  const { darkMode } = useSettingsStore();
  const theme = darkMode ? 'dark' : 'light';
  
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: darkMode ? '#121212' : '#FFFFFF',
        },
        headerTintColor: darkMode ? '#FFFFFF' : '#212121',
        headerBackTitle: "Back",
        contentStyle: {
          backgroundColor: darkMode ? '#121212' : '#FFFFFF',
        },
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen 
        name="chat/[id]" 
        options={{ 
          title: "AI Assistant",
          headerBackTitle: "Back",
        }} 
      />
      <Stack.Screen 
        name="analytics" 
        options={{ 
          title: "Analytics",
          headerBackTitle: "Back",
        }} 
      />
      <Stack.Screen 
        name="settings" 
        options={{ 
          title: "Settings",
          headerBackTitle: "Back",
        }} 
      />
      <Stack.Screen 
        name="premium" 
        options={{ 
          title: "Premium",
          headerBackTitle: "Back",
        }} 
      />
      <Stack.Screen 
        name="qibla" 
        options={{ 
          title: "Qibla Compass",
          headerBackTitle: "Back",
        }} 
      />
      <Stack.Screen 
        name="duas" 
        options={{ 
          title: "Dua Collection",
          headerBackTitle: "Back",
        }} 
      />
      <Stack.Screen 
        name="dhikr" 
        options={{ 
          title: "Dhikr Counter",
          headerBackTitle: "Back",
        }} 
      />
      <Stack.Screen 
        name="learn" 
        options={{ 
          title: "Learn Islam",
          headerBackTitle: "Back",
        }} 
      />
      <Stack.Screen 
        name="umrah" 
        options={{ 
          title: "Umrah Guide",
          headerBackTitle: "Back",
        }} 
      />
      <Stack.Screen 
        name="quran/[surah]" 
        options={{ 
          title: "Quran",
          headerBackTitle: "Back",
        }} 
      />
      <Stack.Screen 
        name="product/[id]" 
        options={{ 
          title: "Product Details",
          headerBackTitle: "Back",
        }} 
      />
      <Stack.Screen 
        name="product/report" 
        options={{ 
          title: "Report Issue",
          headerBackTitle: "Back",
        }} 
      />
      <Stack.Screen 
        name="scanner/info" 
        options={{ 
          title: "Scanner Info",
          headerBackTitle: "Back",
        }} 
      />
    </Stack>
  );
}