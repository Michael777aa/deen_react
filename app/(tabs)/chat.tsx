import React, { useState, useRef, useEffect, useCallback } from 'react';
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
} from 'react-native';
import { ChatMessage } from '@/components/ChatMessage';
import { colors } from '@/constants/colors';
import { useSettingsStore } from '@/store/useSettingsStore';
import { Send, Mic, Link as LinkIcon } from 'lucide-react-native';
import { Audio } from 'expo-av';
import { ErrorToast } from '@/components/ErrorToast';
import { SuggestedQuestions } from '@/components/SuggestedQuestions';
import { useChatStore } from '@/hooks/useChatgpt';
import { useAuth } from '@/context/auth';

const SUGGESTED_QUESTIONS = [
  'What are the five pillars of Islam?',
  'How to perform Tayammum?',
  'Explain Surah Al-Kahf benefits',
  "Authentic du'a for anxiety",
  'Rules of inheritance in Islam',
];

export default function IslamicAssistantScreen() {
  const {
    messages,
    sendMessage,
    sendVoiceMessage,
    isLoading,
    sessionId,
    blockchainHash,
    relatedLinks,
    startNewSession,
    error,
    clearError,
  } = useChatStore();

  const { user } = useAuth(); // ✅ VALID HOOK USAGE

  const { darkMode } = useSettingsStore();
  const theme = darkMode ? 'dark' : 'light';
  const [input, setInput] = useState('');
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const handleSend = useCallback(async () => {
    if (input.trim() === '' || isLoading || !user?.email) return;
    Keyboard.dismiss();
    await sendMessage(input.trim(), user.email); // ✅ PASS EMAIL
    setInput('');
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
      if (status !== 'granted') {
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
      console.error('Recording error:', err);
      Alert.alert('Error', 'Could not start recording');
    }
  }, []);

  const stopRecording = useCallback(async () => {
    setIsRecording(false);
    if (!recording) return;

    try {
      await recording.stopAndUnloadAsync();
      await Audio.setAudioModeAsync({ 
        allowsRecordingIOS: false, 
        playsInSilentModeIOS: true 
      });

      const uri = recording.getURI();
      if (uri && user?.email) {
        await sendVoiceMessage(uri, user.email); // ✅ PASS EMAIL
      }
    } catch (err) {
      console.error('Recording error:', err);
    } finally {
      setRecording(null);
    }
  }, [recording, sendVoiceMessage, user?.email]);

  const handleQuestionSelect = useCallback((question: string) => {
    setInput(question);
  }, []);

  const renderItem = useCallback(({ item }: { item: any }) => (
    <ChatMessage message={item} />
  ), []);

  const renderFooter = useCallback(() => {
    if (!relatedLinks?.length) return null;

    return (
      <View style={[styles.linksContainer, { backgroundColor: colors[theme].card }]}>
        <Text style={[styles.linksTitle, { color: colors[theme].text }]}>
          Related Islamic Resources
        </Text>
        {relatedLinks.map((link: string, index: number) => (
          <TouchableOpacity
            key={`link-${index}`}
            style={styles.linkItem}
            onPress={() => Linking.openURL(link)}
            activeOpacity={0.7}
          >
            <LinkIcon size={16} color={colors[theme].primary} style={styles.linkIcon} />
            <Text
              style={[styles.linkText, { color: colors[theme].primary }]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {link.replace(/^https?:\/\/(www\.)?/, '')}
            </Text>
          </TouchableOpacity>
        ))}
        {blockchainHash && (
          <Text style={[styles.blockchainText, { color: colors[theme].text }]}>
            Session verified on blockchain: {blockchainHash.slice(0, 16)}...
          </Text>
        )}
      </View>
    );
  }, [relatedLinks, blockchainHash, theme]);

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
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      {error && (
        <ErrorToast 
          message={error} 
          onDismiss={clearError} 
          theme={theme}
        />
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
        ListFooterComponent={renderFooter}
        keyboardDismissMode="on-drag"
        initialNumToRender={10}
        maxToRenderPerBatch={5}
        windowSize={7}
      />

      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={colors[theme].primary} />
          <Text style={[styles.loadingText, { color: colors[theme].text }]}>
            Analyzing with Islamic knowledge...
          </Text>
        </View>
      )}

      <View style={[styles.inputContainer, {
        backgroundColor: colors[theme].card,
        borderTopColor: colors[theme].border,
      }]}>
        <TouchableOpacity 
          style={styles.voiceButton} 
          onPress={toggleRecording}
          disabled={isLoading}
        >
          <Mic
            size={24}
            color={isRecording ? colors[theme].error : colors[theme].primary}
            fill={isRecording ? colors[theme].error : 'none'}
          />
          {isRecording && (
            <View style={[styles.recordingIndicator, { backgroundColor: colors[theme].error }]} />
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
          onSubmitEditing={handleSend}
          editable={!isLoading}
          returnKeyType="send"
        />

        <TouchableOpacity
          style={[
            styles.sendButton,
            {
              backgroundColor: colors[theme].primary,
              opacity: input.trim() === '' || isLoading ? 0.5 : 1,
            },
          ]}
          onPress={handleSend}
          disabled={input.trim() === '' || isLoading}
        >
          <Send size={20} color="#FFF" />
        </TouchableOpacity>
      </View>

      {messages.length > 2 && (
        <TouchableOpacity
          style={[styles.newSessionButton, { backgroundColor: colors[theme].primary }]}
          onPress={startNewSession}
          activeOpacity={0.8}
        >
          <Text style={styles.newSessionButtonText}>Start New Session</Text>
        </TouchableOpacity>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  messageList: { padding: 16, paddingBottom: 20 },
  loadingContainer: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 8,
  },
  loadingText: { marginLeft: 8, fontSize: 14 },
  inputContainer: {
    flexDirection: 'row', alignItems: 'center', padding: 12, borderTopWidth: 1,
  },
  voiceButton: { padding: 8, position: 'relative' },
  recordingIndicator: {
    position: 'absolute', top: 4, right: 4, width: 8, height: 8, borderRadius: 4,
  },
  input: {
    flex: 1, borderRadius: 20, borderWidth: 1,
    paddingHorizontal: 16, paddingVertical: 10,
    maxHeight: 100, fontSize: 16, marginHorizontal: 8,
  },
  sendButton: {
    width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center',
  },
  linksContainer: {
    padding: 16, borderRadius: 12, margin: 16, marginTop: 8,
  },
  linksTitle: {
    fontSize: 16, fontWeight: '600', marginBottom: 12,
  },
  linkItem: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 8,
  },
  linkIcon: { marginRight: 8 },
  linkText: { flex: 1, fontSize: 14 },
  blockchainText: { fontSize: 12, marginTop: 12, fontStyle: 'italic' },
  newSessionButton: {
    margin: 16, padding: 12, borderRadius: 8, alignItems: 'center',
  },
  newSessionButtonText: {
    color: '#FFFFFF', fontWeight: 'bold',
  },
});
