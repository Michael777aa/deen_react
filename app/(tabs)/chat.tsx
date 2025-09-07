// IslamicAssistantScreen.tsx

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  Linking,
  Keyboard,
} from "react-native";
import { ChatMessage } from "@/components/ChatMessage";
import { colors } from "@/constants/colors";
import { useSettingsStore } from "@/store/useSettingsStore";
import { Send, Mic, Link as LinkIcon, RefreshCw } from "lucide-react-native";
import { Audio } from "expo-av";
import { ErrorToast } from "@/components/ErrorToast";
import { SuggestedQuestions } from "@/components/SuggestedQuestions";
import { useChatStore } from "@/hooks/useChatgpt";
import { useAuth } from "@/context/auth";

const SUGGESTED_QUESTIONS = [
  "What are the five pillars of Islam?",
  "How to perform Tayammum?",
  "Explain Surah Al-Kahf benefits",
  "Authentic du'a for anxiety",
  "Rules of inheritance in Islam",
  "How to keep discipline in life as a Muslim"
];

export default function IslamicAssistantScreen() {
  const {
    messages,
    sendMessage,
    sendVoiceMessage,
    isLoading,
    startNewSession,
    error,
    clearError,
  } = useChatStore();

  const { user } = useAuth();
  const { darkMode } = useSettingsStore();
  const theme = darkMode ? "dark" : "light";

  const [input, setInput] = useState("");
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const handleSend = useCallback(async () => {
    if (input.trim() === "" || isLoading || !user?.email) return;
    Keyboard.dismiss();
    await sendMessage(input.trim(), user.email);
    setInput("");
  }, [input, isLoading, sendMessage, user?.email]);

  const toggleRecording = useCallback(async () => {
    if (isRecording) {
      await stopRecording();
    } else {
      await startRecording();
    }
  }, [isRecording]);

  const startRecording = useCallback(async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Microphone access is required.");
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      setRecording(recording);
      setIsRecording(true);
    } catch (err) {
      console.error("Recording error:", err);
      Alert.alert("Error", "Could not start recording");
    }
  }, []);

  const stopRecording = useCallback(async () => {
    setIsRecording(false);
    if (!recording) return;

    try {
      await recording.stopAndUnloadAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
      });

      const uri = recording.getURI();
      if (uri && user?.email) {
        await sendVoiceMessage(uri, user.email);
      }
    } catch (err) {
      console.error("Recording error:", err);
    } finally {
      setRecording(null);
    }
  }, [recording, sendVoiceMessage, user?.email]);

  const handleQuestionSelect = useCallback((question: string) => {
    setInput(question);
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: any }) => <ChatMessage message={item} />,
    []
  );



  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages.length]);

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors[theme].background }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      {error && (
        <ErrorToast message={error} onDismiss={clearError} theme={theme} />
      )}

      {messages.length <= 2 && (
        <SuggestedQuestions
          questions={SUGGESTED_QUESTIONS}
          onSelect={handleQuestionSelect}
          theme={theme}
        />
      )}

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messageList}
        keyboardDismissMode="on-drag"
        initialNumToRender={10}
      />

      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={colors[theme].primary} />
          <Text style={[styles.loadingText, { color: colors[theme].text }]}>
            Analyzing with Islamic knowledge...
          </Text>
        </View>
      )}

      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: colors[theme].card,
            borderTopColor: colors[theme].border,
          },
        ]}
      >
        <TouchableOpacity
          style={styles.voiceButton}
          onPress={toggleRecording}
          disabled={isLoading}
        >
          <Mic
            size={24}
            color={isRecording ? colors[theme].error : colors[theme].primary}
            fill={isRecording ? colors[theme].error : "none"}
          />
          {isRecording && (
            <View
              style={[
                styles.recordingIndicator,
                { backgroundColor: colors[theme].error },
              ]}
            />
          )}
        </TouchableOpacity>

        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors[theme].background,
              color: colors[theme].text,
              borderColor: colors[theme].border,
            },
          ]}
          placeholder="Ask about Islam or record voice..."
          placeholderTextColor={colors[theme].inactive}
          value={input}
          onChangeText={setInput}
          multiline
          maxLength={500}
          editable={!isLoading}
          returnKeyType="send"
          blurOnSubmit={false}
          onKeyPress={({ nativeEvent }) => {
            if (nativeEvent.key === "Enter") {
              handleSend();
            }
          }}
        />

        <TouchableOpacity
          style={[
            styles.sendButton,
            {
              backgroundColor: colors[theme].primary,
              opacity: input.trim() === "" || isLoading ? 0.5 : 1,
            },
          ]}
          onPress={handleSend}
          disabled={input.trim() === "" || isLoading}
        >
          <Send size={20} color="#FFF" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[
          styles.floatingNewSession,
          { backgroundColor: colors[theme].primary },
        ]}
        onPress={startNewSession}
        activeOpacity={0.8}
      >
        <RefreshCw size={16} color="#FFF" style={{ marginRight: 6 }} />
        <Text style={styles.newSessionButtonText}>Start New Session</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  messageList: { padding: 16, paddingBottom: 40 },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
  },
  loadingText: { marginLeft: 8, fontSize: 14 },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderTopWidth: 1,
  },
  voiceButton: { padding: 8, position: "relative" },
  recordingIndicator: {
    position: "absolute",
    top: 4,
    right: 4,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  input: {
    flex: 1,
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 100,
    fontSize: 16,
    marginHorizontal: 8,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  linksContainer: {
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 10,
  },
  linksTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  linkItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  linkIcon: { marginRight: 8 },
  linkText: { flex: 1, fontSize: 14 },
  floatingNewSession: {
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    right: 16,
    bottom: 90,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 30,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  newSessionButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 14,
  },
});
