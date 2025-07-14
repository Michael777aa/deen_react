import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useAuth } from '@/context/auth';
import { colors } from '@/constants/colors';
import { useSettingsStore } from '@/store/useSettingsStore';
import { router } from 'expo-router';

export default function EnterCodeResetScreen() {
  const { darkMode } = useSettingsStore();
  const theme = darkMode ? 'dark' : 'light';
  const { resetPasswordWithCode } = useAuth();

  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setError('');
    setSuccess('');
    
    if (!code || !newPassword || !confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      setIsSubmitting(true);
      await resetPasswordWithCode(code, newPassword);
      setSuccess('Password reset successfully!');
      setTimeout(() => router.replace('/login'), 2000);
    } catch (err: any) {
      setError(err.message || 'Reset failed. The code may be invalid or expired.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors[theme].background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.wrapper}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={[styles.title, { color: colors[theme].text }]}>Reset Password</Text>
          <Text style={[styles.subtitle, { color: colors[theme].inactive }]}>
            Enter the 4-digit code from your email and a new password
          </Text>

          <TextInput
            placeholder="Enter 4-digit code"
            value={code}
            onChangeText={setCode}
            keyboardType="numeric"
            maxLength={4}
            style={[styles.input, { 
              backgroundColor: colors[theme].card, 
              color: colors[theme].text,
              borderColor: colors[theme].border 
            }]}
            placeholderTextColor={colors[theme].inactive}
          />

          <TextInput
            placeholder="New Password"
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
            style={[styles.input, { 
              backgroundColor: colors[theme].card, 
              color: colors[theme].text,
              borderColor: colors[theme].border 
            }]}
            placeholderTextColor={colors[theme].inactive}
          />

          <TextInput
            placeholder="Confirm New Password"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            style={[styles.input, { 
              backgroundColor: colors[theme].card, 
              color: colors[theme].text,
              borderColor: colors[theme].border 
            }]}
            placeholderTextColor={colors[theme].inactive}
          />

          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          {success ? <Text style={styles.successText}>{success}</Text> : null}

          <TouchableOpacity 
            style={styles.button} 
            onPress={handleSubmit} 
            disabled={isSubmitting}
          >
            <Text style={styles.buttonText}>
              {isSubmitting ? 'Resetting...' : 'Reset Password'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  wrapper: { flex: 1 },
  scrollContent: { 
    flexGrow: 1, 
    justifyContent: 'center', 
    padding: 24 
  },
  title: { 
    fontSize: 26, 
    fontWeight: '700', 
    textAlign: 'center', 
    marginBottom: 6 
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 24,
    color: '#666',
  },
  input: { 
    height: 48, 
    borderRadius: 12, 
    paddingHorizontal: 16, 
    fontSize: 15, 
    marginBottom: 16,
    borderWidth: 1 
  },
  button: { 
    backgroundColor: '#1C64F2', 
    paddingVertical: 14, 
    borderRadius: 12, 
    alignItems: 'center' 
  },
  buttonText: { 
    color: 'white', 
    fontWeight: '600', 
    fontSize: 16 
  },
  errorText: { 
    color: '#f44336', 
    fontSize: 13, 
    textAlign: 'center', 
    marginBottom: 12 
  },
  successText: { 
    color: '#4caf50', 
    fontSize: 13, 
    textAlign: 'center', 
    marginBottom: 12 
  },
});