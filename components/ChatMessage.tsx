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

  if (!isAssistant && !isUser) return null;

  const messageParts = useMemo(() => {
    return message.content.split(URL_REGEX).map((part, index) => {
      if (part.match(URL_REGEX)) {
        const displayUrl = part.replace(/^https?:\/\/(www\.)?/, '');

        return (
          <TouchableOpacity
            key={`link-${index}`}
            style={[
              styles.linkContainer,
              {
                backgroundColor: isUser ? 'rgba(255,255,255,0.2)' : colors[theme].background,
                borderColor: colors[theme].border,
              },
            ]}
            onPress={() => Linking.openURL(part)}
            activeOpacity={0.8}
          >
            <Link size={14} color={colors[theme].primary} />
            <Text
              style={[
                styles.linkText,
                { color: colors[theme].primary }
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
              color: isUser ? '#fff' : colors[theme].text,
              textAlign: 'left',
            },
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
      { justifyContent: isUser ? 'flex-end' : 'flex-start' }
    ]}>
      <View style={[
        styles.bubble,
        {
          backgroundColor: isUser ? colors[theme].primary : colors[theme].card,
          borderTopLeftRadius: isUser ? 16 : 4,
          borderTopRightRadius: isUser ? 4 : 16,
          shadowColor: theme === 'dark' ? '#000' : '#888',
        }
      ]}>
        {messageParts}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    marginVertical: 6,
  },
  bubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  text: {
    fontSize: 16,
    lineHeight: 22,
  },
  linkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 12,
    marginTop: 6,
    borderWidth: 1,
    flexShrink: 1,
  },
  linkText: {
    marginLeft: 6,
    fontSize: 14,
    flexShrink: 1,
  },
});
