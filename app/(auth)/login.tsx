import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView,
  SafeAreaView
} from 'react-native';
import { router } from 'expo-router';
import { useSettingsStore } from '@/store/useSettingsStore';
import { colors } from '@/constants/colors';
import { useAuth } from "@/context/auth";

export default function LoginScreen() {
  const { signInWithGoogle, signInWithKakao, signInWithNaver, user } = useAuth();
  const { darkMode } = useSettingsStore();
  const theme = darkMode ? 'dark' : 'light';

  useEffect(() => {
    if (user) {
      router.replace('/(tabs)');
    }
  }, [user]);

  const navigateToSignup = () => {
    router.push('/signup');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors[theme].background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.logoContainer}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1564121211835-e88c852648ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80' }}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          <Text style={[styles.title, { color: colors[theme].text }]}>Welcome Back</Text>
          <Text style={[styles.subtitle, { color: colors[theme].inactive }]}>
            Sign in to continue your Islamic journey
          </Text>

          <View style={styles.form}>
            <View style={styles.dividerContainer}>
              <View style={[styles.divider, { backgroundColor: colors[theme].border }]} />
              <Text style={[styles.dividerText, { color: colors[theme].inactive }]}>Login with</Text>
              <View style={[styles.divider, { backgroundColor: colors[theme].border }]} />
            </View>

            <View style={styles.socialButtons}>
              <TouchableOpacity
                style={[styles.socialButton, styles.naverButton]}
                onPress={signInWithNaver}
              >
                <Image
                  // source={require("@/assets/images/623afbb127d4946aceae2fb0.png")}
                  style={styles.socialIcon}
                />
                <Text style={styles.socialText}>Naver</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.socialButton, styles.kakaoButton]}
                onPress={signInWithKakao}
              >
                <Image
                  // source={require("@/assets/images/5f9c58c2017800001.png")}
                  style={styles.socialIcon}
                />
                <Text style={styles.socialText}>Kakao</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.socialButton, styles.googleButton]}
                onPress={signInWithGoogle}
              >
                <Image
                  // source={require("@/assets/images/google-icon.png")}
                  style={styles.socialIcon}
                />
                <Text style={styles.socialText}>Google</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.signupContainer}>
            <Text style={[styles.signupText, { color: colors[theme].text }]}>
              Don't have an account?
            </Text>
            <TouchableOpacity onPress={navigateToSignup}>
              <Text style={[styles.signupLink, { color: colors[theme].primary }]}>
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
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 30,
  },
  form: {
    width: '100%',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 30,
  },
  divider: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 10,
    fontSize: 14,
  },
  socialButtons: {
    gap: 12,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  socialIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  socialText: {
    fontSize: 16,
    fontWeight: '600',
  },
  naverButton: {
    backgroundColor: '#03C75A',
  },
  kakaoButton: {
    backgroundColor: '#FEE500',
  },
  googleButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  signupText: {
    fontSize: 16,
  },
  signupLink: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 5,
  },
});