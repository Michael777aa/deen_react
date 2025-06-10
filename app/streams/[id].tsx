import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Platform,
  Dimensions
} from 'react-native';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { useSettingsStore } from '@/store/useSettingsStore';
import { colors } from '@/constants/colors';
import { streams, getStreamsByMosque, getStreamById } from '@/mocks/streamData';
import { Stream } from '@/types';
import { StreamCard } from '@/components/StreamCard';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Share, 
  Heart, 
  MessageCircle, 
  Clock, 
  Users, 
  Video,
  ChevronLeft
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function StreamDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { darkMode } = useSettingsStore();
  const theme = darkMode ? 'dark' : 'light';
  
  const [stream, setStream] = useState<Stream | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [relatedStreams, setRelatedStreams] = useState<Stream[]>([]);
  const [showComments, setShowComments] = useState(false);
  
  useEffect(() => {
    // Find the stream by ID
    const foundStream = getStreamById(id as string);
    if (foundStream) {
      setStream(foundStream);
      
      // Get related streams from the same mosque
      const related = getStreamsByMosque(foundStream.mosqueId)
        .filter(s => s.id !== id)
        .slice(0, 5);
      setRelatedStreams(related);
    }
    
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  }, [id]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString([], { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
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

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleBackPress = () => {
    router.back();
  };

  if (!stream) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors[theme].background }]}>
        <ActivityIndicator size="large" color={colors[theme].primary} />
      </View>
    );
  }

  return (
    <>
      <Stack.Screen 
        options={{
          title: "",
          headerShown: false
        }}
      />
      <ScrollView 
        style={[styles.container, { backgroundColor: colors[theme].background }]}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.videoContainer}>
          {isLoading ? (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="#FFFFFF" />
            </View>
          ) : (
            <>
              <Image 
                source={{ uri: stream.thumbnailUrl }} 
                style={styles.videoPlaceholder}
              />
              <View style={styles.videoControls}>
                <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
                  <ChevronLeft size={24} color="#FFFFFF" />
                </TouchableOpacity>
                
                <View style={styles.centerControls}>
                  <TouchableOpacity style={styles.playButton} onPress={togglePlayPause}>
                    {isPlaying ? (
                      <Pause size={32} color="#FFFFFF" />
                    ) : (
                      <Play size={32} color="#FFFFFF" fill="#FFFFFF" />
                    )}
                  </TouchableOpacity>
                </View>
                
                <View style={styles.bottomControls}>
                  <TouchableOpacity style={styles.controlButton} onPress={toggleMute}>
                    {isMuted ? (
                      <VolumeX size={20} color="#FFFFFF" />
                    ) : (
                      <Volume2 size={20} color="#FFFFFF" />
                    )}
                  </TouchableOpacity>
                  
                  <View style={styles.progressContainer}>
                    <View style={styles.progressBar}>
                      <View style={[styles.progress, { width: '30%' }]} />
                    </View>
                    <Text style={styles.timeText}>12:34 / 45:00</Text>
                  </View>
                  
                  <TouchableOpacity style={styles.controlButton}>
                    <Maximize size={20} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              </View>
            </>
          )}
          
          {stream.type === 'live' && (
            <View style={styles.liveIndicator}>
              <Text style={styles.liveText}>LIVE</Text>
            </View>
          )}
        </View>
        
        <View style={styles.streamInfo}>
          <Text style={[styles.streamTitle, { color: colors[theme].text }]}>
            {stream.title}
          </Text>
          
          <View style={styles.metaRow}>
            {stream.type === 'live' ? (
              <View style={styles.metaItem}>
                <Users size={16} color={colors[theme].inactive} />
                <Text style={[styles.metaText, { color: colors[theme].inactive }]}>
                  {formatViewCount(stream.viewCount)} watching now
                </Text>
              </View>
            ) : (
              <View style={styles.metaItem}>
                <Clock size={16} color={colors[theme].inactive} />
                <Text style={[styles.metaText, { color: colors[theme].inactive }]}>
                  {formatDate(stream.startTime)}
                </Text>
              </View>
            )}
            
            <View style={styles.metaItem}>
              <Video size={16} color={colors[theme].inactive} />
              <Text style={[styles.metaText, { color: colors[theme].inactive }]}>
                {stream.category ? stream.category.charAt(0).toUpperCase() + stream.category.slice(1) : 'Other'}
              </Text>
            </View>
          </View>
          
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton}>
              <Heart size={20} color={colors[theme].inactive} />
              <Text style={[styles.actionText, { color: colors[theme].inactive }]}>
                Like
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => setShowComments(!showComments)}
            >
              <MessageCircle size={20} color={colors[theme].inactive} />
              <Text style={[styles.actionText, { color: colors[theme].inactive }]}>
                Comment
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <Share size={20} color={colors[theme].inactive} />
              <Text style={[styles.actionText, { color: colors[theme].inactive }]}>
                Share
              </Text>
            </TouchableOpacity>
          </View>
          
          <View style={[styles.divider, { backgroundColor: colors[theme].border }]} />
          
          <View style={styles.mosqueInfo}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1584286595398-a8c264b1dea4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80' }} 
              style={styles.mosqueLogo}
            />
            <View style={styles.mosqueDetails}>
              <Text style={[styles.mosqueName, { color: colors[theme].text }]}>
                {stream.mosqueName}
              </Text>
              <Text style={[styles.imamName, { color: colors[theme].inactive }]}>
                {stream.imamName || 'Imam'}
              </Text>
            </View>
            <TouchableOpacity 
              style={[styles.subscribeButton, { backgroundColor: colors[theme].primary }]}
            >
              <Text style={styles.subscribeText}>Subscribe</Text>
            </TouchableOpacity>
          </View>
          
          <View style={[styles.divider, { backgroundColor: colors[theme].border }]} />
          
          <View style={styles.descriptionContainer}>
            <Text style={[styles.descriptionTitle, { color: colors[theme].text }]}>
              Description
            </Text>
            <Text style={[styles.description, { color: colors[theme].text }]}>
              {stream.description}
            </Text>
            
            {stream.tags && stream.tags.length > 0 && (
              <View style={styles.tags}>
                {stream.tags.map((tag: string, index: number) => (
                  <TouchableOpacity 
                    key={index}
                    style={[styles.tag, { backgroundColor: colors[theme].card }]}
                  >
                    <Text style={[styles.tagText, { color: colors[theme].primary }]}>
                      #{tag}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
          
          {showComments && (
            <View style={styles.commentsSection}>
              <Text style={[styles.commentsTitle, { color: colors[theme].text }]}>
                Comments
              </Text>
              
              <View style={[styles.commentInput, { backgroundColor: colors[theme].card }]}>
                <Text style={[styles.commentPlaceholder, { color: colors[theme].inactive }]}>
                  Add a comment...
                </Text>
              </View>
              
              <Text style={[styles.noComments, { color: colors[theme].inactive }]}>
                Be the first to comment on this stream
              </Text>
            </View>
          )}
          
          {relatedStreams.length > 0 && (
            <View style={styles.relatedSection}>
              <Text style={[styles.relatedTitle, { color: colors[theme].text }]}>
                More from {stream.mosqueName}
              </Text>
              
              {relatedStreams.map((relatedStream) => (
                <StreamCard 
                  key={relatedStream.id} 
                  stream={relatedStream}
                  compact
                />
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoContainer: {
    width: '100%',
    height: 240,
    backgroundColor: '#000000',
    position: 'relative',
  },
  videoPlaceholder: {
    width: '100%',
    height: '100%',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoControls: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 10,
  },
  centerControls: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomControls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  controlButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressContainer: {
    flex: 1,
    marginHorizontal: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
    backgroundColor: '#FF0000',
  },
  timeText: {
    color: '#FFFFFF',
    fontSize: 12,
    marginTop: 4,
  },
  liveIndicator: {
    position: 'absolute',
    top: 16,
    right: 16,
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
  streamInfo: {
    padding: 16,
  },
  streamTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  metaText: {
    fontSize: 14,
    marginLeft: 6,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  actionButton: {
    alignItems: 'center',
  },
  actionText: {
    fontSize: 12,
    marginTop: 4,
  },
  divider: {
    height: 1,
    marginVertical: 16,
  },
  mosqueInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mosqueLogo: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  mosqueDetails: {
    flex: 1,
    marginLeft: 12,
  },
  mosqueName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  imamName: {
    fontSize: 14,
  },
  subscribeButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  subscribeText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  descriptionContainer: {
    marginBottom: 16,
  },
  descriptionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '500',
  },
  commentsSection: {
    marginTop: 8,
    marginBottom: 16,
  },
  commentsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  commentInput: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  commentPlaceholder: {
    fontSize: 14,
  },
  noComments: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
  relatedSection: {
    marginTop: 8,
  },
  relatedTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
});