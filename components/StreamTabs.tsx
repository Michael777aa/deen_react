// src/components/StreamTabs.tsx
import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  ScrollView
} from 'react-native';
import { router } from 'expo-router';
import { useSettingsStore } from '@/store/useSettingsStore';
import { colors } from '@/constants/colors';
import { Video, Calendar, Clock, Plus } from 'lucide-react-native';
import { useAuth } from '@/context/auth';
import { StreamType } from '@/types/stream.enum';
import StreamCard from './StreamCard';
import { Stream } from '@/types/stream';
import { StreamService } from '@/redux/features/streams/streamApi';

const CATEGORIES: StreamType[] = [
  StreamType.KHUTBAH,
  StreamType.LECTURE,
  StreamType.QURAN,
  StreamType.DUA,
  StreamType.OTHER
];

export const StreamTabs = () => {
  const { darkMode } = useSettingsStore();
  const { user } = useAuth();
  const theme = darkMode ? 'dark' : 'light';

  const [activeTab, setActiveTab] = useState<'live' | 'upcoming' | 'recorded'>('live');
  const [selectedCategory, setSelectedCategory] = useState<StreamType | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [streams, setStreams] = useState<Stream[]>([]);

  const fetchStreams = useCallback(async () => {
    try {
      setLoading(true);
      let data: Stream[];

      if (selectedCategory) {
        data = await StreamService.getStreamsByType(selectedCategory);
      } else {
        switch (activeTab) {
          case 'live':
            data = await StreamService.getLiveStreams();
            break;
          case 'upcoming':
            data = await StreamService.getUpcomingStreams();
            break;
          case 'recorded':
            data = await StreamService.getRecordedStreams();
            break;
          default:
            data = await StreamService.getAllStreams();
        }
      }

      setStreams(data || []);
    } catch (error) {
      console.error('Error fetching streams:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [activeTab, selectedCategory]);

  useEffect(() => {
    fetchStreams();
  }, [fetchStreams]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchStreams();
  }, [fetchStreams]);

  const renderTabItem = (tab: 'live' | 'upcoming' | 'recorded') => {
    const icons = { live: Video, upcoming: Calendar, recorded: Clock };
    const Icon = icons[tab];
    const isActive = activeTab === tab;

    return (
      <TouchableOpacity
        key={tab}
        style={[styles.tab, isActive && { borderBottomColor: colors[theme].primary }]}
        onPress={() => {
          setActiveTab(tab);
          setSelectedCategory(null); // reset category filter
        }}
      >
        <Icon size={18} color={isActive ? colors[theme].primary : colors[theme].inactive} />
        <Text style={[styles.tabText, { color: isActive ? colors[theme].primary : colors[theme].inactive }]}>
          {tab.charAt(0).toUpperCase() + tab.slice(1)}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderCategoryItem = ({ item }: { item: StreamType }) => {
    const isSelected = selectedCategory === item;
    return (
      <TouchableOpacity
        style={[
          styles.categoryChip,
          isSelected && { backgroundColor: colors[theme].primary }
        ]}
        onPress={() => setSelectedCategory(isSelected ? null : item)}
      >
        <Text style={[
          styles.categoryChipText,
          isSelected && { color: '#FFFFFF' }
        ]}>
          {item.charAt(0).toUpperCase() + item.slice(1)}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={[styles.emptyText, { color: colors[theme].inactive }]}>
        No {activeTab} streams available
      </Text>
      {user && (
        <TouchableOpacity
          style={[styles.createButton, { backgroundColor: colors[theme].primary }]}
          onPress={() => router.push('/streams/create')}
        >
          <Plus size={18} color="#FFFFFF" />
          <Text style={styles.createButtonText}>Create Stream</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (loading && !refreshing) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors[theme].background }]}>
        <ActivityIndicator size="large" color={colors[theme].primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors[theme].background }]}>
    {/* Top Tabs */}
    <View style={styles.tabContainer}>
      {(['live', 'upcoming', 'recorded'] as const).map(renderTabItem)}
    </View>
  
    {/* Horizontal Category Filter */}
    <ScrollView
      horizontal
      contentContainerStyle={styles.categoryFilters}
      showsHorizontalScrollIndicator={false}
    >
      <TouchableOpacity
        style={[
          styles.categoryChip,
          !selectedCategory && { backgroundColor: colors[theme].primary },
        ]}
        onPress={() => setSelectedCategory(null)}
      >
        <Text style={[
          styles.categoryChipText,
          !selectedCategory && { color: '#FFFFFF' }
        ]}>
          All
        </Text>
      </TouchableOpacity>
  
      {CATEGORIES.map((item) => (
  <View key={item}>{renderCategoryItem({ item })}</View>
))}

    </ScrollView>
  
    {/* Stream List */}
    <ScrollView
      contentContainerStyle={styles.streamsList}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[colors[theme].primary]}
          tintColor={colors[theme].primary}
        />
      }
      showsVerticalScrollIndicator={false}
    >
      {streams.length === 0 ? (
        renderEmptyState()
      ) : (
        streams.map((stream) => (
          <StreamCard key={stream._id} stream={stream} />
        ))
      )}
    </ScrollView>
  </View>
  
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    backgroundColor: '#fff'
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    marginRight: 24,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent'
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6
  },
  categoryFilters: {
    paddingHorizontal: 16,
    paddingVertical: 12
  },
  categoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F0F0F0',
    marginRight: 8
  },
  categoryChipText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666666'
  },
  streamsList: {
    padding: 16
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center'
  },
  emptyText: {
    fontSize: 16,
    marginBottom: 16
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8
  },
  createButtonText: {
    color: '#FFFFFF',
    marginLeft: 8,
    fontWeight: '600'
  }
});

export default StreamTabs;
