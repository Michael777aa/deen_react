import React from 'react';
import { View, Text, StyleSheet, Linking, TouchableOpacity } from 'react-native';
import { colors } from '@/constants/colors';
import { useSettingsStore } from '@/store/useSettingsStore';
import { Link } from 'lucide-react-native';
import Markdown from 'react-native-markdown-display';

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

  if (!isAssistant && !isUser) return null;

  // ChatGPT-like color scheme
  const chatGPTColors = {
    userBubble: darkMode ? '#3b82f6' : '#2563eb', // Blue-600 in dark, Blue-700 in light
    assistantBubble: darkMode ? '#262626' : '#f3f4f6', // Gray-800 in dark, Gray-100 in light
    userText: '#ffffff',
    assistantText: darkMode ? '#f3f4f6' : '#111827', // Gray-100 in dark, Gray-900 in light
    codeBackground: darkMode ? '#374151' : '#e5e7eb', // Gray-700 in dark, Gray-200 in light
    codeText: darkMode ? '#f9fafb' : '#111827', // Gray-50 in dark, Gray-900 in light
    link: '#3b82f6', // Blue-500
  };

  const markdownStyles:any = {
    body: {
      color: isUser ? chatGPTColors.userText : chatGPTColors.assistantText,
      fontSize: 16,
      lineHeight: 24, // Slightly more line height for better readability
    },
    heading1: {
      fontSize: 24,
      fontWeight: '600',
      color: isUser ? chatGPTColors.userText : chatGPTColors.assistantText,
      marginTop: 16,
      marginBottom: 8,
    },
    heading2: {
      fontSize: 20,
      fontWeight: '600',
      color: isUser ? chatGPTColors.userText : chatGPTColors.assistantText,
      marginTop: 16,
      marginBottom: 8,
    },
    heading3: {
      fontSize: 18,
      fontWeight: '600',
      color: isUser ? chatGPTColors.userText : chatGPTColors.assistantText,
      marginTop: 14,
      marginBottom: 6,
    },
    link: {
      color: chatGPTColors.link,
      textDecorationLine: 'underline',
    },
    paragraph: {
      marginTop: 0,
      marginBottom: 12,
    },
    list_item: {
      color: isUser ? chatGPTColors.userText : chatGPTColors.assistantText,
      marginBottom: 4,
    },
    bullet_list: {
      marginTop: 8,
      marginBottom: 8,
      paddingLeft: 20,
    },
    ordered_list: {
      marginTop: 8,
      marginBottom: 8,
      paddingLeft: 20,
    },
    code_inline: {
      backgroundColor: chatGPTColors.codeBackground,
      color: chatGPTColors.codeText,
      paddingHorizontal: 4,
      borderRadius: 4,
      fontFamily: 'monospace',
    },
    code_block: {
      backgroundColor: chatGPTColors.codeBackground,
      color: chatGPTColors.codeText,
      padding: 12,
      borderRadius: 8,
      fontFamily: 'monospace',
      marginVertical: 12,
      overflow: 'hidden',
    },
    fence: {
      backgroundColor: chatGPTColors.codeBackground,
      color: chatGPTColors.codeText,
      padding: 12,
      borderRadius: 8,
      fontFamily: 'monospace',
      marginVertical: 12,
    },
    blockquote: {
      backgroundColor: darkMode ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)',
      borderLeftWidth: 4,
      borderLeftColor: chatGPTColors.link,
      paddingLeft: 12,
      marginVertical: 12,
      paddingVertical: 8,
    },
  };

  const renderMessageContent = () => {
    // If it's a user message, render as plain text with URL handling
    if (isUser) {
      return message.content.split(URL_REGEX).map((part, index) => {
        if (part.match(URL_REGEX)) {
          const displayUrl = part.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');

          return (
            <TouchableOpacity
              key={`link-${index}`}
              style={[
                styles.linkContainer,
                {
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                },
              ]}
              onPress={() => Linking.openURL(part)}
              activeOpacity={0.8}
            >
              <Link size={14} color="#ffffff" />
              <Text
                style={[
                  styles.linkText,
                  { color: '#ffffff' }
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
            key={`text-${index}`}
            style={[
              styles.text,
              {
                color: chatGPTColors.userText,
              },
            ]}
          >
            {part}
          </Text>
        );
      });
    }

    // For assistant messages, use Markdown component
    return (
      <Markdown 
        style={markdownStyles}
        mergeStyle={true}
        rules={{
          link: (node, children, parent, styles) => (
            <Text key={node.key} style={styles.link}>
              {children}
            </Text>
          ),
        }}
      >
        {message.content}
      </Markdown>
    );
  };

  return (
    <View style={[
      styles.container,
      { 
        backgroundColor: darkMode ? '#171717' : '#ffffff',
        paddingVertical: 12,
        paddingHorizontal: 16,
      }
    ]}>
      <View style={[
        styles.bubble,
        {
          backgroundColor: isUser ? chatGPTColors.userBubble : chatGPTColors.assistantBubble,
          borderTopLeftRadius: isUser ? 18 : 8,
          borderTopRightRadius: isUser ? 8 : 18,
          borderBottomLeftRadius: 8,
          borderBottomRightRadius: 8,
          shadowColor: 'transparent',
        }
      ]}>
        {renderMessageContent()}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  bubble: {
    maxWidth: '90%',
    padding: 16,
    borderRadius: 18,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
  },
  linkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginTop: 8,
    borderWidth: 1,
    flexShrink: 1,
  },
  linkText: {
    marginLeft: 6,
    fontSize: 14,
    flexShrink: 1,
  },
});