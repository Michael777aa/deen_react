// src/components/StreamTabs.tsx
import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  ActivityIndicator
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

  const renderCategoryFilter = () => (
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
        <Text style={[
          styles.categoryChipText,
          !selectedCategory && { color: '#FFFFFF' }
        ]}>
          All
        </Text>
      </TouchableOpacity>

      {CATEGORIES.map((category) => (
        <TouchableOpacity
          key={category}
          style={[
            styles.categoryChip,
            selectedCategory === category && { backgroundColor: colors[theme].primary }
          ]}
          onPress={() => setSelectedCategory(category)}
        >
          <Text style={[
            styles.categoryChipText,
            selectedCategory === category && { color: '#FFFFFF' }
          ]}>
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

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
      <View style={styles.tabContainer}>
        {(['live', 'upcoming', 'recorded'] as const).map((tab) => {
          const icons = {
            live: Video,
            upcoming: Calendar,
            recorded: Clock
          };
          const Icon = icons[tab];
          
          return (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tab,
                activeTab === tab && [
                  styles.activeTab, 
                  { borderBottomColor: colors[theme].primary }
                ]
              ]}
              onPress={() => setActiveTab(tab)}
            >
              <Icon
                size={18}
                color={activeTab === tab ? colors[theme].primary : colors[theme].inactive}
              />
              <Text style={[
                styles.tabText,
                { 
                  color: activeTab === tab ? colors[theme].primary : colors[theme].inactive 
                }
              ]}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {renderCategoryFilter()}

      <FlatList
        data={streams}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <StreamCard
            stream={item}
          />
        )}
        contentContainerStyle={styles.streamsList}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            colors={[colors[theme].primary]}
            tintColor={colors[theme].primary}
          />
        }
        ListEmptyComponent={renderEmptyState()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
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
      justifyContent: 'center',
    },
    emptyText: {
      fontSize: 16,
      marginBottom: 16,
    },
    createButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 8,
    },
    createButtonText: {
      color: '#FFFFFF',
      marginLeft: 8,
      fontWeight: '600',
    },
  });
export default StreamTabs;
