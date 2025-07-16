// src/components/StreamCard.tsx
import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image,
  ImageBackground
} from 'react-native';
import { router } from 'expo-router';
import { colors } from '@/constants/colors';
import { Stream } from '@/types/stream';
import { 
  Clock, 
  Users, 
  Heart, 
  MessageCircle,
  Video as VideoIcon,
  Calendar as CalendarIcon
} from 'lucide-react-native';
import { StreamStatus } from '@/types/stream.enum';

interface StreamCardProps {
  stream: Stream;
  compact?: boolean;
}

const StreamCard: React.FC<StreamCardProps> = ({ stream, compact = false }) => {
  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString([], { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatViewCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const getStatusIcon = () => {
    const statusIcons:any = {
      LIVE: <VideoIcon size={14} color="#FF0000" />,
      UPCOMING: <CalendarIcon size={14} color="#FFA500" />,
      RECORDED: <Clock size={14} color="#888888" />
    };
  
    return statusIcons[stream.status?.toUpperCase()] || (
      <VideoIcon size={14} color="#888888" />
    );
  };
  

  if (compact) {
    return (
      <TouchableOpacity 
        style={[styles.compactContainer, { backgroundColor: colors.light.card }]}
        onPress={() => router.push(`/streams/${stream._id}`)}
      >
        <Image 
          source={{ uri: stream.thumbnailUrl || 'https://via.placeholder.com/300' }} 
          style={styles.compactImage}
        />
        <View style={styles.compactContent}>
          <Text style={[styles.compactTitle, { color: colors.light.text }]} numberOfLines={2}>
            {stream.title}
          </Text>
          <Text style={[styles.compactMosque, { color: colors.light.inactive }]}>
            {stream.center}
          </Text>
          <View style={styles.compactMeta}>
            {getStatusIcon()}
            <Text style={[styles.compactMetaText, { color: colors.light.inactive }]}>
              {stream?.status === StreamStatus.LIVE ? 
                `${formatViewCount(stream.currentViewers || 0)} watching` : 
                formatDate(stream.scheduledStartTime)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity 
      style={[styles.container, { marginBottom: 16 }]}
      onPress={() => router.push(`/streams/${stream._id}`)}
    >
      <ImageBackground
        source={{ uri: stream.thumbnailUrl || 'https://via.placeholder.com/300' }}
        style={styles.thumbnail}
        imageStyle={styles.thumbnailImage}
      >
        {stream?.status === StreamStatus.LIVE && (
          <View style={styles.liveBadge}>
            <Text style={styles.liveText}>LIVE</Text>
          </View>
        )}
        <View style={styles.thumbnailOverlay}>
          <View style={styles.viewers}>
            <Users size={14} color="#FFFFFF" />
            <Text style={styles.viewersText}>{formatViewCount(stream.currentViewers || 0)}</Text>
          </View>
        </View>
      </ImageBackground>

      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.light.text }]} numberOfLines={2}>
          {stream.title}
        </Text>
        
        <View style={styles.meta}>
          <Text style={[styles.mosque, { color: colors.light.inactive }]}>
            {stream.center} • {stream.imam}
          </Text>
          <View style={styles.typeBadge}>
            <Text style={styles.typeText}>
              {stream.type?.charAt(0).toUpperCase() + stream.type?.slice(1)}
            </Text>
          </View>
        </View>

        <View style={styles.stats}>
          <View style={styles.stat}>
            <Heart size={14} color={colors.light.inactive} />
            <Text style={[styles.statText, { color: colors.light.inactive }]}>
              {formatViewCount(stream.likes || 0)}
            </Text>
          </View>
          <View style={styles.stat}>
            <MessageCircle size={14} color={colors.light.inactive} />
            <Text style={[styles.statText, { color: colors.light.inactive }]}>
              {stream.comments?.length || 0}
            </Text>
          </View>
          <View style={styles.stat}>
            <Clock size={14} color={colors.light.inactive} />
            <Text style={[styles.statText, { color: colors.light.inactive }]}>
              {formatDate(stream.scheduledStartTime)}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  thumbnail: {
    width: '100%',
    height: 180,
    justifyContent: 'flex-end',
  },
  thumbnailImage: {
    borderRadius: 12,
  },
  thumbnailOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 12,
    justifyContent: 'flex-end',
  },
  liveBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#FF0000',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  liveText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  viewers: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  viewersText: {
    color: '#FFFFFF',
    fontSize: 12,
    marginLeft: 4,
  },
  content: {
    padding: 12,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  meta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  mosque: {
    fontSize: 12,
    flex: 1,
  },
  typeBadge: {
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  typeText: {
    fontSize: 12,
    color: '#666666',
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 12,
    marginLeft: 4,
  },
  compactContainer: {
    flexDirection: 'row',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 12,
  },
  compactImage: {
    width: 120,
    height: 80,
  },
  compactContent: {
    flex: 1,
    padding: 8,
  },
  compactTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  compactMosque: {
    fontSize: 12,
    marginBottom: 4,
  },
  compactMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  compactMetaText: {
    fontSize: 12,
    marginLeft: 4,
  },
});

export default StreamCard;