import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { useColorScheme, View, Text, Image, StyleSheet, Animated } from "react-native";
import { useSettingsStore } from "@/store/useSettingsStore";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { colors } from "@/constants/colors";
import { AuthProvider } from "@/context/auth";

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
  const [appIsReady, setAppIsReady] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const fadeAnim = new Animated.Value(1);
  const scaleAnim = new Animated.Value(1);
  
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
    async function prepare() {
      try {
        // Pre-load fonts, make any API calls you need to do here
        await new Promise(resolve => setTimeout(resolve, 2000)); // Artificial delay for splash screen
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  useEffect(() => {
    if (loaded && appIsReady) {
      // Hide the native splash screen
      SplashScreen.hideAsync();
      
      // Animate the logo
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        // Fade out our custom splash screen
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        })
      ]).start(() => {
        setShowSplash(false);
      });
    }
  }, [loaded, appIsReady]);

  if (!loaded || !appIsReady || showSplash) {
    return (
      <Animated.View style={[
        styles.splashContainer, 
        { 
          backgroundColor: darkMode ? colors.dark.background : colors.light.background,
          opacity: fadeAnim 
        }
      ]}>
        <View style={styles.splashContent}>
          <Animated.View style={[
            styles.logoContainer,
            { transform: [{ scale: scaleAnim }] }
          ]}>
            <View style={[styles.logoCircle, { backgroundColor: colors.light.primary }]}>
              <Text style={styles.logoIcon}>☪️</Text>
            </View>
          </Animated.View>
          <Text style={[
            styles.appTitle, 
            { color: darkMode ? colors.dark.text : colors.light.text }
          ]}>
            Deen Daily
          </Text>
          <Text style={[
            styles.appTagline, 
            { color: darkMode ? colors.dark.inactive : colors.light.inactive }
          ]}>
            Your daily companion for Islamic lifestyle
          </Text>
        </View>
      </Animated.View>
    );
  }

  return (
    <AuthProvider>
        <RootLayoutNav />
        </AuthProvider>
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
      <Stack.Screen 
        name="islamic-calendar" 
        options={{ 
          title: "Islamic Calendar",
          headerBackTitle: "Back",
        }} 
      />
      <Stack.Screen 
        name="streams/[id]" 
        options={{ 
          title: "Live Stream",
          headerBackTitle: "Back",
        }} 
      />
    </Stack>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  splashContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    marginBottom: 24,
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logoIcon: {
    fontSize: 60,
  },
  appTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  appTagline: {
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});