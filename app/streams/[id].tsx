// src/screens/StreamDetailScreen.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Dimensions,
  TextInput
} from 'react-native';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { useSettingsStore } from '@/store/useSettingsStore';
import { colors } from '@/constants/colors';
import { Stream } from '@/types/stream';
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
  Video as VideoIcon,
  ChevronLeft,
  Send
} from 'lucide-react-native';
import { useAuth } from '@/context/auth';
import StreamCard from '@/components/StreamCard';
import { StreamStatus } from '@/types/stream.enum';
import { StreamService } from '@/redux/features/streams/streamApi';

const { width } = Dimensions.get('window');

const StreamDetailScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { darkMode } = useSettingsStore();
  const { user } = useAuth();
  const theme = darkMode ? 'dark' : 'light';
  
  const [stream, setStream] = useState<Stream | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [relatedStreams, setRelatedStreams] = useState<Stream[]>([]);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  
  const fetchStream = useCallback(async () => {
    try {
      setIsLoading(true);
      const fetchedStream = await StreamService.getStreamById(id);
      setStream(fetchedStream);
      
      const related = await StreamService.getStreamsByType(fetchedStream.type);
      setRelatedStreams(related.filter((s:any) => s._id !== id).slice(0, 3));
      setIsLiked(false);
    } catch (error) {
      console.error('Error fetching stream:', error);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchStream();
  }, [fetchStream]);

  const handleLike = async () => {
    if (!stream) return;
    
    try {
      const updatedStream = await StreamService.likeStream(stream._id);
      setStream(updatedStream);
      setIsLiked(!isLiked);
    } catch (error) {
      console.error('Error liking stream:', error);
    }
  };

  const handleAddComment = async () => {
    if (!stream || !user || !commentText.trim()) return;
    
    try {
      const updatedStream = await StreamService.addComment(stream._id, user.email, commentText);
      setStream(updatedStream);
      setCommentText('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const formatDate = (dateString: string | Date) => {
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

  const togglePlayPause = () => setIsPlaying(!isPlaying);
  const toggleMute = () => setIsMuted(!isMuted);
  const handleBackPress = () => router.back();

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors[theme].background }]}>
        <ActivityIndicator size="large" color={colors[theme].primary} />
      </View>
    );
  }

  if (!stream) {
    return (
      <View style={[styles.container, { backgroundColor: colors[theme].background }]}>
        <Text >
          Stream not found
        </Text>
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
          <Image 
            source={{ uri: stream.thumbnailUrl || 'https://via.placeholder.com/300' }} 
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
                <Text style={styles.timeText}>00:00 / {stream.isPrivate || '--:--'}</Text>
              </View>
              
              <TouchableOpacity style={styles.controlButton}>
                <Maximize size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
          
          {stream.status === StreamStatus.LIVE  && (
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
            {stream.status === StreamStatus.LIVE ? (
              <View style={styles.metaItem}>
                <Users size={16} color={colors[theme].inactive} />
                <Text style={[styles.metaText, { color: colors[theme].inactive }]}>
                  {formatViewCount(stream.currentViewers || 0)} watching now
                </Text>
              </View>
            ) : (
              <View style={styles.metaItem}>
                <Clock size={16} color={colors[theme].inactive} />
                <Text style={[styles.metaText, { color: colors[theme].inactive }]}>
                  {formatDate(stream.scheduledStartTime)}
                </Text>
              </View>
            )}
            
            <View style={styles.metaItem}>
              <VideoIcon size={16} color={colors[theme].inactive} />
              <Text style={[styles.metaText, { color: colors[theme].inactive }]}>
                {stream.type?.charAt(0).toUpperCase() + stream.type?.slice(1)}
              </Text>
            </View>
          </View>
          
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleLike}
            >
              <Heart 
                size={20} 
                color={isLiked ? colors[theme].primary : colors[theme].inactive} 
                fill={isLiked ? colors[theme].primary : 'none'}
              />
              <Text style={[
                styles.actionText, 
                { color: isLiked ? colors[theme].primary : colors[theme].inactive }
              ]}>
                {stream.likes || 0}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => setShowComments(!showComments)}
            >
              <MessageCircle size={20} color={colors[theme].inactive} />
              <Text style={[styles.actionText, { color: colors[theme].inactive }]}>
                {stream.comments?.length || 0}
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
              source={{ uri: 'https://via.placeholder.com/100' }} 
              style={styles.mosqueLogo}
            />
            <View style={styles.mosqueDetails}>
              <Text style={[styles.mosqueName, { color: colors[theme].text }]}>
                {stream.center}
              </Text>
              <Text style={[styles.imamName, { color: colors[theme].inactive }]}>
                {stream.imam}
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
                Comments ({stream.comments?.length || 0})
              </Text>
              
              {user && (
                <View style={[styles.commentInputContainer, { backgroundColor: colors[theme].card }]}>
                  <TextInput
                    style={[styles.commentInput, { color: colors[theme].text }]}
                    placeholder="Add a comment..."
                    placeholderTextColor={colors[theme].inactive}
                    value={commentText}
                    onChangeText={setCommentText}
                  />
                  <TouchableOpacity 
                    style={styles.commentButton}
                    onPress={handleAddComment}
                    disabled={!commentText.trim()}
                  >
                    <Send size={20} color={commentText.trim() ? colors[theme].primary : colors[theme].inactive} />
                  </TouchableOpacity>
                </View>
              )}
              
              {stream.comments && stream.comments.length > 0 ? (
                stream.comments.map((comment, index) => (
                  <View key={index} style={styles.commentItem}>
                    <Image 
                      source={{ uri: 'https://via.placeholder.com/50' }} 
                      style={styles.commentAvatar}
                    />
                    <View style={styles.commentContent}>
                      <Text style={[styles.commentAuthor, { color: colors[theme].text }]}>
                        {comment.userId}
                      </Text>
                      <Text style={[styles.commentText, { color: colors[theme].text }]}>
                        {comment.text}
                      </Text>
                      <Text style={[styles.commentTime, { color: colors[theme].inactive }]}>
                        {new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </Text>
                    </View>
                  </View>
                ))
              ) : (
                <Text style={[styles.noComments, { color: colors[theme].inactive }]}>
                  Be the first to comment on this stream
                </Text>
              )}
            </View>
          )}
          
          {relatedStreams.length > 0 && (
            <View style={styles.relatedSection}>
              <Text style={[styles.relatedTitle, { color: colors[theme].text }]}>
                More from {stream.center}
              </Text>
              
              {relatedStreams.map((relatedStream) => (
                <StreamCard 
                  key={relatedStream._id} 
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
};

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
    aspectRatio: 16/9,
    backgroundColor: '#000',
    position: 'relative',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoPlaceholder: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  videoControls: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
    padding: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerControls: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  controlButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressContainer: {
    flex: 1,
    marginHorizontal: 10,
  },
  progressBar: {
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
  
  },
  timeText: {
    color: '#FFF',
    fontSize: 12,
    marginTop: 4,
  },
  liveIndicator: {
    position: 'absolute',
    top: 16,
    right: 16,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  liveText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  streamInfo: {
    padding: 16,
  },
  streamTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 8,
  },
  metaText: {
    fontSize: 14,
    marginLeft: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 16,
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
    marginBottom: 16,
  },
  mosqueLogo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  mosqueDetails: {
    flex: 1,
  },
  mosqueName: {
    fontSize: 16,
    fontWeight: '600',
  },
  imamName: {
    fontSize: 14,
    marginTop: 2,
  },
  subscribeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  subscribeText: {
    color: '#FFF',
    fontWeight: '600',
  },
  descriptionContainer: {
    marginBottom: 16,
  },
  descriptionTitle: {
    fontSize: 16,
    fontWeight: '600',
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
    marginTop: 8,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 12,
  },
  commentsSection: {
    marginTop: 16,
  },
  commentsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 16,
  },
  commentInput: {
    flex: 1,
    fontSize: 14,
  },
  commentButton: {
    marginLeft: 8,
  },
  commentItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  commentAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  commentContent: {
    flex: 1,
  },
  commentAuthor: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  commentText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
  commentTime: {
    fontSize: 12,
  },
  noComments: {
    fontSize: 14,
    textAlign: 'center',
    marginVertical: 16,
  },
  relatedSection: {
    marginTop: 24,
  },
  relatedTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
});

export default StreamDetailScreen;