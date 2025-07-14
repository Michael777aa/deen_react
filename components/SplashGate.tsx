// components/SplashGate.tsx
import React, { useEffect, useState, useMemo } from "react";
import { View, Text, Animated, StyleSheet } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { useColorScheme } from "react-native";
import { useSettingsStore } from "@/store/useSettingsStore";
import { colors } from "@/constants/colors";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";

// ✅ Only call this once and outside the component
SplashScreen.preventAutoHideAsync();

export default function SplashGate({ children }: { children: React.ReactNode }) {
  const colorScheme = useColorScheme();
  const { darkMode } = useSettingsStore();
  const [isReady, setIsReady] = useState(false);
  const fadeAnim = useMemo(() => new Animated.Value(1), []);
  const scaleAnim = useMemo(() => new Animated.Value(1), []);
  const [fontsLoaded] = useFonts({ ...FontAwesome.font });

  useEffect(() => {
    if (colorScheme && useSettingsStore.getState().darkMode === null) {
      useSettingsStore.getState().toggleDarkMode();
    }
  }, [colorScheme]);

  useEffect(() => {
    async function prepare() {
      await new Promise(resolve => setTimeout(resolve, 1500)); // optional delay
    }

    async function runAnimation() {
      await prepare();

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
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ]).start(async () => {
        // ✅ Hide native splash screen after animation
        await SplashScreen.hideAsync();
        setIsReady(true);
      });
    }

    if (fontsLoaded) {
      runAnimation();
    }
  }, [fontsLoaded]);

  if (!isReady) {
    const bgColor = darkMode ? colors.dark.background : colors.light.background;
    const textColor = darkMode ? colors.dark.text : colors.light.text;
    const subTextColor = darkMode ? colors.dark.inactive : colors.light.inactive;

    return (
      <Animated.View style={[styles.splashContainer, { backgroundColor: bgColor, opacity: fadeAnim }]}>
        <View style={styles.splashContent}>
          <Animated.View style={[styles.logoContainer, { transform: [{ scale: scaleAnim }] }]}>
            <View style={[styles.logoCircle, { backgroundColor: colors.light.primary }]}>
              <Text style={styles.logoIcon}>☪️</Text>
            </View>
          </Animated.View>
          <Text style={[styles.appTitle, { color: textColor }]}>Deen Daily</Text>
          <Text style={[styles.appTagline, { color: subTextColor }]}>
            Your daily companion for Islamic lifestyle
          </Text>
        </View>
      </Animated.View>
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  splashContent: {
    alignItems: "center",
    justifyContent: "center",
  },
  logoContainer: {
    marginBottom: 24,
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
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
    fontWeight: "bold",
    marginBottom: 8,
  },
  appTagline: {
    fontSize: 16,
    textAlign: "center",
    paddingHorizontal: 32,
  },
});
