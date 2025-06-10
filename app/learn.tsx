import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Image,
  FlatList
} from 'react-native';
import { Stack, router } from 'expo-router';
import { useSettingsStore } from '@/store/useSettingsStore';
import { colors } from '@/constants/colors';
import { Card } from '@/components/Card';
import { Play, BookOpen, Clock, Award } from 'lucide-react-native';
import { learningCourses, learningTopics } from '@/mocks/learningData';

export default function LearnScreen() {
  const { darkMode } = useSettingsStore();
  const theme = darkMode ? 'dark' : 'light';
  const [selectedTab, setSelectedTab] = useState('courses');

  const renderCourseItem = ({ item }: { item: typeof learningCourses[0] }) => (
    <Card style={styles.courseCard}>
      <Image
        source={{ uri: item.imageUrl }}
        style={styles.courseImage}
        resizeMode="cover"
      />
      
      <View style={styles.courseContent}>
        <View style={styles.courseHeader}>
          <Text style={[styles.courseTitle, { color: colors[theme].text }]}>
            {item.title}
          </Text>
          <View style={[styles.levelBadge, { backgroundColor: colors[theme].primary + '20' }]}>
            <Text style={[styles.levelText, { color: colors[theme].primary }]}>
              {item.level}
            </Text>
          </View>
        </View>
        
        <Text style={[styles.courseDescription, { color: colors[theme].inactive }]}>
          {item.description}
        </Text>
        
        <View style={styles.courseStats}>
          <View style={styles.courseStat}>
            <BookOpen size={16} color={colors[theme].primary} />
            <Text style={[styles.courseStatText, { color: colors[theme].text }]}>
              {item.lessons} lessons
            </Text>
          </View>
          
          <View style={styles.courseStat}>
            <Clock size={16} color={colors[theme].primary} />
            <Text style={[styles.courseStatText, { color: colors[theme].text }]}>
              {item.duration}
            </Text>
          </View>
        </View>
        
        <TouchableOpacity 
          style={[styles.startButton, { backgroundColor: colors[theme].primary }]}
        >
          <Play size={16} color="#FFFFFF" fill="#FFFFFF" />
          <Text style={styles.startButtonText}>
            Start Learning
          </Text>
        </TouchableOpacity>
      </View>
    </Card>
  );

  const renderTopicItem = ({ item }: { item: typeof learningTopics[0] }) => (
    <TouchableOpacity style={[styles.topicCard, { backgroundColor: colors[theme].card }]}>
      <View style={[styles.topicIconContainer, { backgroundColor: item.color + '20' }]}>
        <Award size={24} color={item.color} />
      </View>
      <Text style={[styles.topicTitle, { color: colors[theme].text }]}>
        {item.title}
      </Text>
      <Text style={[styles.topicCount, { color: colors[theme].inactive }]}>
        {item.articleCount} articles
      </Text>
    </TouchableOpacity>
  );

  return (
    <>
      <Stack.Screen options={{ title: "Learn Islam" }} />
      <View style={[styles.container, { backgroundColor: colors[theme].background }]}>
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[
              styles.tabButton,
              selectedTab === 'courses' && [
                styles.activeTabButton,
                { borderBottomColor: colors[theme].primary }
              ]
            ]}
            onPress={() => setSelectedTab('courses')}
          >
            <Text 
              style={[
                styles.tabButtonText, 
                { 
                  color: selectedTab === 'courses' 
                    ? colors[theme].primary 
                    : colors[theme].inactive 
                }
              ]}
            >
              Courses
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.tabButton,
              selectedTab === 'topics' && [
                styles.activeTabButton,
                { borderBottomColor: colors[theme].primary }
              ]
            ]}
            onPress={() => setSelectedTab('topics')}
          >
            <Text 
              style={[
                styles.tabButtonText, 
                { 
                  color: selectedTab === 'topics' 
                    ? colors[theme].primary 
                    : colors[theme].inactive 
                }
              ]}
            >
              Topics
            </Text>
          </TouchableOpacity>
        </View>

        {selectedTab === 'courses' ? (
          <FlatList
            data={learningCourses}
            renderItem={renderCourseItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.coursesList}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <ScrollView showsVerticalScrollIndicator={false} style={styles.topicsContainer}>
            <Text style={[styles.sectionTitle, { color: colors[theme].text }]}>
              Popular Topics
            </Text>
            
            <View style={styles.topicsGrid}>
              {learningTopics.map((topic, index) => (
                <View key={index} style={styles.topicCardContainer}>
                  {renderTopicItem({ item: topic })}
                </View>
              ))}
            </View>
          </ScrollView>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  activeTabButton: {
    borderBottomWidth: 2,
  },
  tabButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  coursesList: {
    padding: 16,
    paddingBottom: 40,
  },
  courseCard: {
    marginBottom: 16,
    padding: 0,
    overflow: 'hidden',
  },
  courseImage: {
    width: '100%',
    height: 160,
  },
  courseContent: {
    padding: 16,
  },
  courseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  levelBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  levelText: {
    fontSize: 12,
    fontWeight: '600',
  },
  courseDescription: {
    fontSize: 14,
    marginBottom: 12,
    lineHeight: 20,
  },
  courseStats: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  courseStat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  courseStatText: {
    fontSize: 14,
    marginLeft: 4,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  topicsContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  topicsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  topicCardContainer: {
    width: '48%',
    marginBottom: 16,
  },
  topicCard: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    height: 140,
    justifyContent: 'center',
  },
  topicIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  topicTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  topicCount: {
    fontSize: 12,
    textAlign: 'center',
  },
});