import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  FlatList,
  RefreshControl
} from 'react-native';
import { Stack } from 'expo-router';
import { useSettingsStore } from '@/store/useSettingsStore';
import { colors } from '@/constants/colors';
import { StreamCard } from '@/components/StreamCard';
import { 
  getLiveStreams, 
  getUpcomingStreams, 
  getRecordedStreams,
  getStreamsByCategory,
  StreamCategory
} from '@/mocks/streamData';
import { Video, Calendar, Clock, Filter } from 'lucide-react-native';

export default function StreamsScreen() {
  const { darkMode } = useSettingsStore();
  const theme = darkMode ? 'dark' : 'light';
  const [activeTab, setActiveTab] = useState<'live' | 'upcoming' | 'recorded'>('live');
  const [selectedCategory, setSelectedCategory] = useState<StreamCategory | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const liveStreams = getLiveStreams();
  const upcomingStreams = getUpcomingStreams();
  const recordedStreams = getRecordedStreams();

  const filteredStreams = selectedCategory 
    ? getStreamsByCategory(selectedCategory) 
    : activeTab === 'live' 
      ? liveStreams 
      : activeTab === 'upcoming' 
        ? upcomingStreams 
        : recordedStreams;

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate a refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const renderCategoryFilter = () => {
    const categories: StreamCategory[] = ['khutbah', 'lecture', 'quran', 'dua', 'other'];
    
    return (
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryFilters}
      >
        <TouchableOpacity 
          style={[
            styles.categoryChip,
            !selectedCategory && { backgroundColor: colors[theme].primary }
          ]}
          onPress={() => setSelectedCategory(null)}
        >
          <Text 
            style={[
              styles.categoryChipText, 
              !selectedCategory && { color: '#FFFFFF' }
            ]}
          >
            All
          </Text>
        </TouchableOpacity>
        
        {categories.map((category) => (
          <TouchableOpacity 
            key={category}
            style={[
              styles.categoryChip,
              selectedCategory === category && { backgroundColor: colors[theme].primary }
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text 
              style={[
                styles.categoryChipText, 
                selectedCategory === category && { color: '#FFFFFF' }
              ]}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };

  return (
    <>
      <Stack.Screen 
        options={{
          title: "Live Streams",
          headerTitleStyle: { fontWeight: 'bold' }
        }}
      />
      <View style={[styles.container, { backgroundColor: colors[theme].background }]}>
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[
              styles.tab, 
              activeTab === 'live' && [styles.activeTab, { borderBottomColor: colors[theme].primary }]
            ]}
            onPress={() => setActiveTab('live')}
          >
            <Video 
              size={18} 
              color={activeTab === 'live' ? colors[theme].primary : colors[theme].inactive} 
            />
            <Text 
              style={[
                styles.tabText, 
                { color: activeTab === 'live' ? colors[theme].primary : colors[theme].inactive }
              ]}
            >
              Live
            </Text>
            {liveStreams.length > 0 && (
              <View style={[styles.badge, { backgroundColor: colors[theme].primary }]}>
                <Text style={styles.badgeText}>{liveStreams.length}</Text>
              </View>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.tab, 
              activeTab === 'upcoming' && [styles.activeTab, { borderBottomColor: colors[theme].primary }]
            ]}
            onPress={() => setActiveTab('upcoming')}
          >
            <Calendar 
              size={18} 
              color={activeTab === 'upcoming' ? colors[theme].primary : colors[theme].inactive} 
            />
            <Text 
              style={[
                styles.tabText, 
                { color: activeTab === 'upcoming' ? colors[theme].primary : colors[theme].inactive }
              ]}
            >
              Upcoming
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.tab, 
              activeTab === 'recorded' && [styles.activeTab, { borderBottomColor: colors[theme].primary }]
            ]}
            onPress={() => setActiveTab('recorded')}
          >
            <Clock 
              size={18} 
              color={activeTab === 'recorded' ? colors[theme].primary : colors[theme].inactive} 
            />
            <Text 
              style={[
                styles.tabText, 
                { color: activeTab === 'recorded' ? colors[theme].primary : colors[theme].inactive }
              ]}
            >
              Recorded
            </Text>
          </TouchableOpacity>
        </View>
        
        {renderCategoryFilter()}
        
        <FlatList
          data={filteredStreams}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <StreamCard stream={item} />}
          contentContainerStyle={styles.streamsList}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyText, { color: colors[theme].inactive }]}>
                No {activeTab} streams available
              </Text>
            </View>
          }
        />
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
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    marginRight: 24,
  },
  activeTab: {
    borderBottomWidth: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  badge: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 6,
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  categoryFilters: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
  },
  categoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F0F0F0',
    marginRight: 8,
  },
  categoryChipText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666666',
  },
  streamsList: {
    padding: 16,
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
  },
});