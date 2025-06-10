import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { router } from 'expo-router';
import { useSettingsStore } from '@/store/useSettingsStore';
import { colors } from '@/constants/colors';
import { Play, Clock, Users, Video } from 'lucide-react-native';
import { Stream } from '@/mocks/streamData';

interface StreamCardProps {
  stream: Stream;
  compact?: boolean;
}

export const StreamCard: React.FC<StreamCardProps> = ({ stream, compact = false }) => {
  const { darkMode } = useSettingsStore();
  const theme = darkMode ? 'dark' : 'light';

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatViewCount = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const handlePress = () => {
    router.push(`/streams/${stream.id}`);
  };

  if (compact) {
    return (
      <TouchableOpacity 
        style={[styles.compactContainer, { backgroundColor: colors[theme].card }]}
        onPress={handlePress}
      >
        <View style={styles.compactImageContainer}>
          <Image source={{ uri: stream.thumbnailUrl }} style={styles.compactImage} />
          {stream.type === 'live' && (
            <View style={styles.liveIndicator}>
              <Text style={styles.liveText}>LIVE</Text>
            </View>
          )}
        </View>
        <View style={styles.compactContent}>
          <Text 
            style={[styles.compactTitle, { color: colors[theme].text }]}
            numberOfLines={2}
          >
            {stream.title}
          </Text>
          <Text style={[styles.compactMosque, { color: colors[theme].inactive }]}>
            {stream.mosqueName}
          </Text>
          <View style={styles.compactMeta}>
            {stream.type === 'upcoming' ? (
              <View style={styles.metaItem}>
                <Clock size={12} color={colors[theme].inactive} />
                <Text style={[styles.metaText, { color: colors[theme].inactive }]}>
                  {formatDate(stream.startTime)}
                </Text>
              </View>
            ) : (
              <View style={styles.metaItem}>
                <Users size={12} color={colors[theme].inactive} />
                <Text style={[styles.metaText, { color: colors[theme].inactive }]}>
                  {formatViewCount(stream.viewCount)} viewers
                </Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity 
      style={[styles.container, { backgroundColor: colors[theme].card }]}
      onPress={handlePress}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: stream.thumbnailUrl }} style={styles.image} />
        {stream.type === 'live' && (
          <View style={styles.liveIndicator}>
            <Text style={styles.liveText}>LIVE</Text>
          </View>
        )}
        {stream.type !== 'live' && (
          <View style={styles.playButton}>
            <Play size={24} color="#FFFFFF" fill="#FFFFFF" />
          </View>
        )}
      </View>
      
      <View style={styles.content}>
        <Text 
          style={[styles.title, { color: colors[theme].text }]}
          numberOfLines={2}
        >
          {stream.title}
        </Text>
        
        <View style={styles.mosqueRow}>
          <Text style={[styles.mosque, { color: colors[theme].inactive }]}>
            {stream.mosqueName}
          </Text>
          <Text style={[styles.imam, { color: colors[theme].inactive }]}>
            • {stream.imamName}
          </Text>
        </View>
        
        <View style={styles.metaRow}>
          {stream.type === 'upcoming' ? (
            <View style={styles.metaItem}>
              <Clock size={14} color={colors[theme].inactive} />
              <Text style={[styles.metaText, { color: colors[theme].inactive }]}>
                {formatDate(stream.startTime)}
              </Text>
            </View>
          ) : (
            <View style={styles.metaItem}>
              <Users size={14} color={colors[theme].inactive} />
              <Text style={[styles.metaText, { color: colors[theme].inactive }]}>
                {formatViewCount(stream.viewCount)} viewers
              </Text>
            </View>
          )}
          
          <View style={styles.metaItem}>
            <Video size={14} color={colors[theme].inactive} />
            <Text style={[styles.metaText, { color: colors[theme].inactive }]}>
              {stream.category}
            </Text>
          </View>
        </View>
        
        {!compact && (
          <Text 
            style={[styles.description, { color: colors[theme].inactive }]}
            numberOfLines={2}
          >
            {stream.description}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  imageContainer: {
    height: 180,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  liveIndicator: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#FF0000',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  liveText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -24 }, { translateY: -24 }],
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  mosqueRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  mosque: {
    fontSize: 14,
  },
  imam: {
    fontSize: 14,
    marginLeft: 4,
  },
  metaRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  metaText: {
    fontSize: 12,
    marginLeft: 4,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
  },
  // Compact styles
  compactContainer: {
    flexDirection: 'row',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 12,
    height: 80,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  compactImageContainer: {
    width: 120,
    position: 'relative',
  },
  compactImage: {
    width: '100%',
    height: '100%',
  },
  compactContent: {
    flex: 1,
    padding: 8,
    justifyContent: 'space-between',
  },
  compactTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  compactMosque: {
    fontSize: 12,
  },
  compactMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});