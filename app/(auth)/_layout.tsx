import { Stack } from "expo-router";
import { useSettingsStore } from "@/store/useSettingsStore";

export default function AuthLayout() {
  const { darkMode } = useSettingsStore();

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: darkMode ? "#121212" : "#FFFFFF",
        },
        headerTintColor: darkMode ? "#FFFFFF" : "#212121",
        contentStyle: {
          backgroundColor: darkMode ? "#121212" : "#FFFFFF",
        },
      }}
    >
      <Stack.Screen
        name="login"
        options={{
          title: "Login",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="signup"
        options={{
          title: "Sign Up",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="password-reset"
        options={{
          title: "Reset Password",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="forgot-password"
        options={{
          title: "Forgot Password",
          headerShown: false,
        }}
      />
    </Stack>
  );
}
