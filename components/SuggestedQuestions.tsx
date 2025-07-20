// components/SuggestedQuestions.tsx
import React, { useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { colors } from '@/constants/colors';

interface SuggestedQuestionsProps {
  questions: string[];
  onSelect: (question: string) => void;
  theme: 'light' | 'dark';
}

export const SuggestedQuestions: React.FC<SuggestedQuestionsProps> = ({ 
  questions, 
  onSelect,
  theme
}) => {
  const handlePress = useCallback((question: string) => {
    onSelect(question);
  }, [onSelect]);

  return (
    <View style={[styles.container, { backgroundColor: colors[theme].background }]}>
      <Text style={[styles.title, { color: colors[theme].text }]}>
        Quick Questions
      </Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.questionsContainer}
      >
        {questions.map((question, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.questionButton,
              { backgroundColor: colors[theme].card }
            ]}
            onPress={() => handlePress(question)}
            activeOpacity={0.7}
          >
            <Text 
              style={[
                styles.questionText,
                { color: colors[theme].text }
              ]}
              numberOfLines={2}
            >
              {question}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  questionsContainer: {
    paddingBottom: 4,
  },
  questionButton: {
    padding: 12,
    borderRadius: 12,
    marginRight: 12,
    maxWidth: 200,
  },
  questionText: {
    fontSize: 14,
  },
});