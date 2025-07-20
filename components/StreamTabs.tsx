// src/components/StreamTabs.tsx
import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
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
          case 'live': data = await StreamService.getLiveStreams(); break;
          case 'upcoming': data = await StreamService.getUpcomingStreams(); break;
          case 'recorded': data = await StreamService.getRecordedStreams(); break;
          default: data = await StreamService.getAllStreams();
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

  useEffect(() => { fetchStreams(); }, [fetchStreams]);

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
        style={[styles.tabItem, isActive && { borderBottomColor: colors[theme].primary }]}
        onPress={() => {
          setActiveTab(tab);
          setSelectedCategory(null);
        }}
      >
        <Icon size={16} color={isActive ? colors[theme].primary : colors[theme].inactive} />
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
          isSelected && { color: '#FFF' }
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
          <Plus size={18} color="#FFF" />
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
      <View style={styles.tabsRow}>
        {(['live', 'upcoming', 'recorded'] as const).map(renderTabItem)}
      </View>

      <ScrollView
  horizontal
  contentContainerStyle={styles.categoriesRow}
  showsHorizontalScrollIndicator={false}
>
  {[null, ...CATEGORIES].map((item) => {
    const isSelected = selectedCategory === item;
    const label = item ? item.charAt(0).toUpperCase() + item.slice(1) : 'All';

    return (
      <TouchableOpacity
        key={item ?? 'all'}
        onPress={() => setSelectedCategory(item)}
        style={[
          styles.categoryChip,
          isSelected && styles.categoryChipSelected,
        ]}
      >
        <Text
          style={[
            styles.categoryChipText,
            isSelected && styles.categoryChipTextSelected,
          ]}
        >
          {label}
        </Text>
      </TouchableOpacity>
    );
  })}
</ScrollView>


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
        {streams.length === 0 ? renderEmptyState() : streams.map((stream) => (
          <StreamCard key={stream._id} stream={stream} />
        ))}
      </ScrollView>
    </View>
  );
};

// styles update only; rest of your component logic remains the same
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#f9f9f9',
  },
  tabItem: {
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 4,
  },
  categoriesRow: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },


  streamsList: {
    paddingHorizontal: 16,
    paddingBottom: 30,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 16,
    marginBottom: 16,
    color: '#999',
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3B82F6',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
    elevation: 2,
  },
  createButtonText: {
    color: '#FFF',
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
  },
  categoryChip: {
    backgroundColor: '#F2F2F2',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginRight: 8,
    minHeight: 34,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryChipSelected: {
    backgroundColor: '#22C55E', // Tailwind green-500 like style (or colors[theme].primary)
  },
  categoryChipText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#444',
  },
  categoryChipTextSelected: {
    color: '#FFF',
  },
  
});


export default StreamTabs;
