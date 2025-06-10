import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator
} from 'react-native';
import { useChatStore } from '@/store/useChatStore';
import { ChatMessage } from '@/components/ChatMessage';
import { colors } from '@/constants/colors';
import { useSettingsStore } from '@/store/useSettingsStore';
import { Send } from 'lucide-react-native';
import { ChatMessage as ChatMessageType } from '@/types';

export default function ChatScreen() {
  const { messages, sendMessage, isLoading } = useChatStore();
  const { darkMode } = useSettingsStore();
  const theme = darkMode ? 'dark' : 'light';
  
  const [input, setInput] = useState('');
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    // Scroll to bottom when messages change
    if (flatListRef.current && messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const handleSend = async () => {
    if (input.trim() === '' || isLoading) return;
    
    const message = input.trim();
    setInput('');
    await sendMessage(message);
  };

  const renderItem = ({ item }: { item: ChatMessageType }) => (
    <ChatMessage message={item} />
  );

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors[theme].background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <FlatList
        ref={flatListRef}
        data={messages.filter(m => m.role !== 'system')}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messageList}
        onLayout={() => flatListRef.current?.scrollToEnd({ animated: false })}
      />
      
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={colors[theme].primary} />
          <Text style={[styles.loadingText, { color: colors[theme].text }]}>
            Thinking...
          </Text>
        </View>
      )}
      
      <View style={[
        styles.inputContainer, 
        { 
          backgroundColor: colors[theme].card,
          borderTopColor: colors[theme].border
        }
      ]}>
        <TextInput
          style={[
            styles.input, 
            { 
              backgroundColor: colors[theme].background,
              color: colors[theme].text,
              borderColor: colors[theme].border
            }
          ]}
          placeholder="Ask anything about Islam..."
          placeholderTextColor={colors[theme].inactive}
          value={input}
          onChangeText={setInput}
          multiline
          maxLength={500}
          onSubmitEditing={handleSend}
          editable={!isLoading}
        />
        <TouchableOpacity 
          style={[
            styles.sendButton, 
            { 
              backgroundColor: colors[theme].primary,
              opacity: input.trim() === '' || isLoading ? 0.5 : 1
            }
          ]}
          onPress={handleSend}
          disabled={input.trim() === '' || isLoading}
        >
          <Send size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messageList: {
    padding: 16,
    paddingBottom: 20,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 100,
    fontSize: 16,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
});