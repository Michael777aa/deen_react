import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { router } from "expo-router";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { colors } from "@/constants/colors";
import { useSettingsStore } from "@/store/useSettingsStore";
import { useAuth } from "@/context/auth";
import * as Animatable from "react-native-animatable";
import { MaterialIcons } from "@expo/vector-icons";

export default function SignupScreen() {
  const { darkMode } = useSettingsStore();
  const theme = darkMode ? "dark" : "light";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validationError, setValidationError] = useState("");
  const { signup, isLoading, error, user } = useAuth();

  useEffect(() => {
    if (user) {
      router.replace("/(tabs)");
    }
  }, [user]);

  const validateForm = () => {
    if (!name || !email || !password || !confirmPassword) {
      setValidationError("All fields are required");
      return false;
    }

    if (password !== confirmPassword) {
      setValidationError("Passwords do not match");
      return false;
    }

    if (password.length < 6) {
      setValidationError("Password must be at least 6 characters");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setValidationError("Please enter a valid email address");
      return false;
    }

    setValidationError("");
    return true;
  };

  const handleSignup = async () => {
    if (validateForm()) {
      await signup(email, password, name);
    }
  };

  const navigateToLogin = () => {
    router.push("/login");
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors[theme].background }]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={[styles.title, { color: colors[theme].text }]}>
            Create Account
          </Text>
          <Text style={[styles.subtitle, { color: colors[theme].inactive }]}>
            Join our community and start your Islamic journey
          </Text>

          {(validationError || error) && (
            <Animatable.View
              animation="fadeInDown"
              duration={300}
              style={styles.errorContainer}
            >
              <MaterialIcons name="error-outline" size={20} color="#D32F2F" />
              <Text style={styles.errorMessage}>
                {validationError || error?.message}
              </Text>
            </Animatable.View>
          )}

          <View style={styles.form}>
            <Input
              label="Full Name"
              placeholder="Enter your full name"
              value={name}
              onChangeText={setName}
            />

            <Input
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Input
              label="Password"
              placeholder="Create a password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={false}
            />

            <Input
              label="Confirm Password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={false}
            />

            <Button
              title="Sign Up"
              onPress={handleSignup}
              loading={isLoading}
              style={styles.signupButton}
            />
          </View>

          <View style={styles.termsContainer}>
            <Text style={[styles.termsText, { color: colors[theme].inactive }]}>
              By signing up, you agree to our{" "}
              <Text
                style={[styles.termsLink, { color: colors[theme].primary }]}
              >
                Terms of Service
              </Text>{" "}
              and{" "}
              <Text
                style={[styles.termsLink, { color: colors[theme].primary }]}
              >
                Privacy Policy
              </Text>
            </Text>
          </View>

          <View style={styles.loginContainer}>
            <Text style={[styles.loginText, { color: colors[theme].text }]}>
              Already have an account?
            </Text>
            <TouchableOpacity onPress={navigateToLogin}>
              <Text
                style={[styles.loginLink, { color: colors[theme].primary }]}
              >
                Login
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
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 40,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 8,
    marginBottom: 30,
  },
  form: {
    width: "100%",
  },
  signupButton: {
    marginTop: 20,
  },
  termsContainer: {
    marginTop: 20,
  },
  termsText: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
  termsLink: {
    fontWeight: "500",
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 30,
    marginBottom: 20,
  },
  loginText: {
    fontSize: 16,
  },
  loginLink: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 5,
  },
  errorText: {
    color: "#F44336",
    textAlign: "center",
    marginBottom: 20,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fdecea",
    borderLeftWidth: 4,
    borderLeftColor: "#f44336",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  errorMessage: {
    color: "#D32F2F",
    marginLeft: 8,
    fontSize: 14,
    flexShrink: 1,
  },
});
