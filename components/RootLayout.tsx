import { router, Stack } from "expo-router";
import { useSettingsStore } from "@/store/useSettingsStore";
import { useAuth } from "@/context/auth";
import { useEffect, useState } from "react";

const screenList = [
  "(tabs)", "(auth)", "analytics", "settings", "premium", "qibla",
  "duas", "dhikr", "learn", "umrah", "islamic-calendar",
  "product/report", "scanner/info",
];

const dynamicScreens = [
  { name: "quran/[surah]", title: "Quran" },
  { name: "product/[id]", title: "Product Details" },
  { name: "streams/[id]", title: "Live Stream" },
];

export default function RootLayoutNav() {
  const { darkMode } = useSettingsStore();
    const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const backgroundColor = darkMode ? "#121212" : "#FFFFFF";
  const tintColor = darkMode ? "#FFFFFF" : "#212121";

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/(auth)/login");
    }
  }, [isLoading, user]);

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor },
        headerTintColor: tintColor,
        headerBackTitle: "Back",
        contentStyle: { backgroundColor },
      }}
    >
      {screenList.map((name) => (
        <Stack.Screen key={name} name={name} options={{ headerShown: false }} />
      ))}
      {dynamicScreens.map(({ name, title }) => (
        <Stack.Screen key={name} name={name} options={{ title, headerBackTitle: "Back" }} />
      ))}
    </Stack>
  );
}
