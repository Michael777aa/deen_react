// components/SuggestedQuestions.tsx
import React, { useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { colors } from '@/constants/colors';
import { router } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';

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
      
      {/* 🔙 Back Button */}
      <View style={styles.headerRow}>
      <TouchableOpacity
  onPress={() => router.back()}
  style={[
    styles.backButton,
    { backgroundColor: colors[theme].card }
  ]}
  activeOpacity={0.7}
>
  <ArrowLeft size={20} color={colors[theme].text} />
</TouchableOpacity>


        <Text style={[styles.title, { color: colors[theme].text }]}>
          Quick Questions
        </Text>
      </View>

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
    marginTop:30,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  

  title: {
    fontSize: 20,
    fontWeight: '600',
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
