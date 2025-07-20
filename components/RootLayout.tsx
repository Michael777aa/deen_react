import { Stack } from "expo-router";
import { useSettingsStore } from "@/store/useSettingsStore";

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
  const backgroundColor = darkMode ? "#121212" : "#FFFFFF";
  const tintColor = darkMode ? "#FFFFFF" : "#212121";

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
