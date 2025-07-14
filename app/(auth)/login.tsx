import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
  TextInput,
} from "react-native";
import { useAuth } from "@/context/auth";
import { useSettingsStore } from "@/store/useSettingsStore";
import { colors } from "@/constants/colors";
import { router } from "expo-router";

export default function LoginScreen() {
  const { login, signInWithGoogle, signInWithKakao, signInWithNaver, user } =
    useAuth();
  const { darkMode } = useSettingsStore();
  const theme = darkMode ? "dark" : "light";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    if (user) {
      router.replace("/(tabs)");
    }
  }, [user]);

  const handleLogin = async () => {
    if (!email || !password) {
      setValidationError("Please enter both email and password");
      return;
    }

    setValidationError("");
    try {
      await login(email, password);
    } catch (err) {
      // Handled in auth context
    }
  };

  const navigateToSignup = () => {
    router.push("/signup");
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors[theme].background }]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={[styles.title, { color: colors[theme].text }]}>
            Welcome Back
          </Text>
          <Text style={[styles.subtitle, { color: colors[theme].inactive }]}>
            Sign in to continue your journey
          </Text>

          {/* Email Login Form */}
          <View style={styles.form}>
            <TextInput
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              style={[
                styles.input,
                {
                  backgroundColor: colors[theme].card,
                  color: colors[theme].text,
                },
              ]}
              placeholderTextColor={colors[theme].inactive}
            />
            <TextInput
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={[
                styles.input,
                {
                  backgroundColor: colors[theme].card,
                  color: colors[theme].text,
                },
              ]}
              placeholderTextColor={colors[theme].inactive}
            />

            {validationError ? (
              <Text style={styles.errorText}>{validationError}</Text>
            ) : null}

            <TouchableOpacity
              style={styles.forgotPassword}
              onPress={() => router.push("/forgot-password")}
            >
              <Text
                style={[
                  styles.forgotPasswordText,
                  { color: colors[theme].primary },
                ]}
              >
                Forgot Password?
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>
          </View>

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View
              style={[
                styles.divider,
                { backgroundColor: colors[theme].border },
              ]}
            />
            <Text
              style={[styles.dividerText, { color: colors[theme].inactive }]}
            >
              OR
            </Text>
            <View
              style={[
                styles.divider,
                { backgroundColor: colors[theme].border },
              ]}
            />
          </View>

          {/* Social Login */}
          <View style={styles.socialButtons}>
            <TouchableOpacity
              style={[styles.socialButton, styles.naverButton]}
              onPress={signInWithNaver}
            >
              <Text style={styles.socialText}>Continue with Naver</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.socialButton, styles.kakaoButton]}
              onPress={signInWithKakao}
            >
              <Text style={styles.socialText}>Continue with Kakao</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.socialButton, styles.googleButton]}
              onPress={signInWithGoogle}
            >
              <Text style={styles.socialText}>Continue with Google</Text>
            </TouchableOpacity>
          </View>

          {/* Signup */}
          <View style={styles.signupContainer}>
            <Text style={[styles.signupText, { color: colors[theme].text }]}>
              Don't have an account?
            </Text>
            <TouchableOpacity onPress={navigateToSignup}>
              <Text
                style={[styles.signupLink, { color: colors[theme].primary }]}
              >
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
  },
  logoContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    textAlign: "center",
    marginTop: 8,
    marginBottom: 24,
  },
  form: {
    marginBottom: 24,
  },
  input: {
    height: 48,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 15,
    marginBottom: 12,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 16,
  },
  forgotPasswordText: {
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: "#1C64F2",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  loginButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  divider: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 10,
    fontSize: 13,
  },
  socialButtons: {
    gap: 12,
  },
  socialButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
  },
  socialText: {
    fontSize: 15,
    fontWeight: "600",
  },
  naverButton: {
    backgroundColor: "#03C75A",
  },
  kakaoButton: {
    backgroundColor: "#FEE500",
  },
  googleButton: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 30,
  },
  signupText: {
    fontSize: 15,
  },
  signupLink: {
    fontSize: 15,
    fontWeight: "bold",
    marginLeft: 6,
  },
  errorText: {
    color: "red",
    fontSize: 13,
    marginBottom: 8,
  },
});
