import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import { ChatMessage as ChatMessageType } from '@/types';
import { colors } from '@/constants/colors';
import { useSettingsStore } from '@/store/useSettingsStore';

const { width } = Dimensions.get('window');
const MAX_IMAGE_WIDTH = width * 0.6;

interface ChatMessageProps {
  message: ChatMessageType;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const { darkMode } = useSettingsStore();
  const theme = darkMode ? 'dark' : 'light';
  const isUser = message.role === 'user';

  return (
    <View style={[
      styles.container,
      isUser ? styles.userContainer : styles.assistantContainer,
    ]}>
      <View style={[
        styles.bubble,
        isUser 
          ? [styles.userBubble, { backgroundColor: colors[theme].primary }] 
          : [styles.assistantBubble, { backgroundColor: colors[theme].card }],
      ]}>
        {message.imageUri && (
          <Image 
            source={{ uri: message.imageUri }} 
            style={styles.messageImage}
            resizeMode="cover"
          />
        )}
        
        {message.content && (
          <Text style={[
            styles.text,
            isUser 
              ? { color: '#FFFFFF' } 
              : { color: colors[theme].text },
          ]}>
            {message.content}
          </Text>
        )}
      </View>
      <Text style={[
        styles.timestamp,
        { color: colors[theme].inactive }
      ]}>
        {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    maxWidth: '80%',
  },
  userContainer: {
    alignSelf: 'flex-end',
  },
  assistantContainer: {
    alignSelf: 'flex-start',
  },
  bubble: {
    borderRadius: 16,
    padding: 12,
    overflow: 'hidden',
  },
  userBubble: {
    borderBottomRightRadius: 4,
  },
  assistantBubble: {
    borderBottomLeftRadius: 4,
  },
  text: {
    fontSize: 16,
    lineHeight: 22,
  },
  messageImage: {
    width: MAX_IMAGE_WIDTH,
    height: MAX_IMAGE_WIDTH * 0.75,
    borderRadius: 8,
    marginBottom: 8,
  },
  timestamp: {
    fontSize: 12,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
});