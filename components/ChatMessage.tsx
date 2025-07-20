// components/ChatMessage.tsx
import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Linking, TouchableOpacity } from 'react-native';
import { colors } from '@/constants/colors';
import { useSettingsStore } from '@/store/useSettingsStore';
import { Link } from 'lucide-react-native';

interface ChatMessageProps {
  message: {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp?: number;
  };
}

const URL_REGEX = /(https?:\/\/[^\s]+)/g;

export const ChatMessage: React.FC<ChatMessageProps> = React.memo(({ message }) => {
  const { darkMode } = useSettingsStore();
  const theme = darkMode ? 'dark' : 'light';
  
  const isAssistant = message.role === 'assistant';
  const isUser = message.role === 'user';
  
  // Skip system messages
  if (!isAssistant && !isUser) return null;

  const messageParts = useMemo(() => {
    return message.content.split(URL_REGEX).map((part, index) => {
      if (part.match(URL_REGEX)) {
        const displayUrl = part.replace(/^https?:\/\/(www\.)?/, '');
        
        return (
          <TouchableOpacity 
            key={index} 
            style={styles.linkContainer}
            onPress={() => Linking.openURL(part)}
            activeOpacity={0.7}
          >
            <Link size={14} color={isUser ? '#FFFFFF' : colors[theme].primary} />
            <Text 
              style={[
                styles.linkText,
                isUser ? styles.userLinkText : styles.assistantLinkText
              ]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {displayUrl}
            </Text>
          </TouchableOpacity>
        );
      }
      
      return (
        <Text 
          key={index} 
          style={[
            styles.text,
            isUser ? styles.userText : styles.assistantText
          ]}
        >
          {part}
        </Text>
      );
    });
  }, [message.content, theme, isUser]);

  return (
    <View style={[
      styles.container,
      isUser ? styles.userContainer : styles.assistantContainer
    ]}>
      <View style={[
        styles.bubble,
        isUser ? styles.userBubble : styles.assistantBubble
      ]}>
        {messageParts}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginVertical: 4,
    paddingHorizontal: 16,
  },
  assistantContainer: {
    justifyContent: 'flex-start',
  },
  userContainer: {
    justifyContent: 'flex-end',
  },
  bubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
  },
  assistantBubble: {
    backgroundColor: colors.light.card,
    borderBottomLeftRadius: 4,
  },
  userBubble: {
    backgroundColor: colors.light.primary,
    borderBottomRightRadius: 4,
  },
  text: {
    fontSize: 16,
    lineHeight: 22,
  },
  assistantText: {
    color: colors.dark.text,
  },
  userText: {
    color: '#FFFFFF',
  },
  linkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  linkText: {
    marginLeft: 6,
    fontSize: 14,
    textDecorationLine: 'underline',
    flexShrink: 1,
  },
  assistantLinkText: {
    color: colors.light.primary,
  },
  userLinkText: {
    color: '#FFFFFF',
  },
});