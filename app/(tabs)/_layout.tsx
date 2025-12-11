import React from "react";
import { Tabs } from "expo-router";
import { useSettingsStore } from "@/store/useSettingsStore";
import { colors } from "@/constants/colors";
import { Home, BookOpen, ShoppingBag, User } from "lucide-react-native";
import { Utensils } from "lucide-react-native";
import { useTranslation } from "react-i18next";

export default function TabLayout() {
  const { darkMode } = useSettingsStore();
  const theme = darkMode ? "dark" : "light";
  const { t } = useTranslation(); // Translation hook

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors[theme].primary,
        tabBarInactiveTintColor: colors[theme].inactive,
        tabBarStyle: {
          position: "absolute",
          bottom: 20,
          left: 20,
          right: 20,
          height: 82.5,
          borderTopWidth: 0,
          elevation: 100, // Android shadow
          shadowColor: "#000", // iOS shadow
          shadowOpacity: 0.1,
          shadowRadius: 10,
          paddingBottom: 10,
          paddingTop: 10,
        },
      }}
    >
      {/* Main Tabs */}
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          title: t("Home"),
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="quran"
        options={{
          title: t("Quran"),
          tabBarIcon: ({ color, size }) => (
            <BookOpen size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="scanner"
        options={{
          title: "Products",
          tabBarIcon: ({ color, size }) => (
            <ShoppingBag size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="restaurants"
        options={{
          title: "Restaurant",
          tabBarIcon: ({ color, size }) => (
            <Utensils size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t("Profile"),
          headerShown: false,
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
        }}
      />

      {/* Hidden Tabs (accessible via routing but not shown in tab bar) */}
      <Tabs.Screen
        name="map"
        options={{
          headerShown: false,
          href: null,
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          headerShown: false,
          href: null,
          tabBarStyle: { display: "none" }, // hide bottom tabs
        }}
      />
      <Tabs.Screen
        name="prayers"
        options={{
          headerShown: false,
          href: null,
        }}
      />
    </Tabs>
  );
}
