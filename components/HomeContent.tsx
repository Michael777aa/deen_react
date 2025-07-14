import React, { useEffect, useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Image,
  RefreshControl,
  Dimensions,
  ImageBackground,
  Animated,
  Vibration,
  Platform
} from 'react-native';
import { router } from 'expo-router';
import { useSettingsStore } from '@/store/useSettingsStore';
import { Card } from '@/components/Card';
import { colors } from '@/constants/colors';
import { getNextPrayer } from '@/mocks/prayerTimes';
import { getLiveStreams, getUpcomingStreams } from '@/mocks/streamData';
import { 
  MessageCircle, 
  Calendar, 
  BookOpen, 
  MapPin, 
  BookMarked, 
  Compass, 
  Moon, 
  ShoppingBag, 
  Bell,
  Star,
  Clock,
  Heart,
  Sun,
  Volume2,
  Vibrate,
  Video,
  User,
  Users as UsersIcon
} from 'lucide-react-native';
import { useAuth } from '@/context/auth';

const { width } = Dimensions.get('window');

export default function HomeContent() {
  const { user } = useAuth();
  const { darkMode, notifications, prayerReminders } = useSettingsStore();
  const theme = darkMode ? 'dark' : 'light';
  const [refreshing, setRefreshing] = useState(false);
  const [greeting, setGreeting] = useState('');
  const [notificationType, setNotificationType] = useState('adhan');
  const [showNotificationOptions, setShowNotificationOptions] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const notificationOptionsAnim = useRef(new Animated.Value(0)).current;

  const featuredContent = [
    {
      id: '1',
      title: 'Complete Umrah Guide',
      description: 'Step-by-step guide for performing Umrah with duas and rituals',
      image: 'https://images.unsplash.com/photo-1604480132736-44c188fe4d20?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      route: '/umrah'
    },
    // ... rest of your featured content
  ];
  
  useEffect(() => {
    // Set greeting based on time of day
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting('Good morning');
    } else if (hour < 18) {
      setGreeting('Good afternoon');
    } else {
      setGreeting('Good evening');
    }
    
    // Fade in animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true
      })
    ]).start();
    
    // Auto-scroll featured content
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % featuredContent.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const nextPrayer = getNextPrayer();
  
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  // ... rest of your home screen component functions

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors[theme].background }]}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      showsVerticalScrollIndicator={false}
    >
      {/* Your existing home screen content */}
      {/* Modern Gradient Header */}
      <Animated.View style={[styles.headerContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <ImageBackground
          source={{ uri: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80' }}
          style={styles.headerBackground}
          imageStyle={styles.headerBackgroundImage}
        >
          <View style={styles.headerOverlay}>
            <View style={styles.header}>
              <View style={styles.headerLeft}>
                <Text style={styles.greeting}>
                  {greeting},
                </Text>
                <Text style={styles.name}>
                  {user?.name}
                </Text>
                <Text style={styles.subtitle}>
                  May Allah bless your day
                </Text>
              </View>
            </View>
          </View>
        </ImageBackground>
      </Animated.View>

      {/* Rest of your home screen components */}
      {/* ... */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    contentContainer: {
      paddingBottom: 24,
    },
    headerContainer: {
      height: 200,
  
      marginBottom: 20,
    },
    headerBackground: {
      width: '100%',
      height: '100%',
    },
    headerBackgroundImage: {
      borderBottomLeftRadius: 24,
      borderBottomRightRadius: 24,
    },
    headerOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.4)',
      borderBottomLeftRadius: 24,
      borderBottomRightRadius: 24,
      justifyContent: 'flex-end',
      padding: 24,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
    },
    headerLeft: {
      flex: 1,
    },
    greeting: {
      fontSize: 16,
      color: '#FFFFFF',
      opacity: 0.9,
    },
    name: {
      fontSize: 28,
      fontWeight: 'bold',
      color: '#FFFFFF',
      marginTop: 4,
    },
    subtitle: {
      fontSize: 14,
      color: '#FFFFFF',
      opacity: 0.8,
      marginTop: 4,
    },
    avatarContainer: {
      position: 'relative',
    },
    avatar: {
      width: 56,
      height: 56,
      borderRadius: 28,
      borderWidth: 3,
      borderColor: '#FFFFFF',
    },
    onlineIndicator: {
      position: 'absolute',
      bottom: 2,
      right: 2,
      width: 16,
      height: 16,
      borderRadius: 8,
      backgroundColor: '#4CAF50',
      borderWidth: 2,
      borderColor: '#FFFFFF',
    },
    // Prayer Card - Redesigned
    prayerCardContainer: {
      paddingHorizontal: 16,
      marginBottom: 20,
    },
    prayerCard: {
      padding: 16,
    },
    prayerCardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    prayerCardTitle: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    prayerCardTitleText: {
      fontSize: 16,
      fontWeight: '600',
      marginLeft: 8,
    },
    notificationAction: {
      backgroundColor: 'rgba(0,0,0,0.05)',
      width: 32,
      height: 32,
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'center',
    },
    prayerCardContent: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    prayerCardInfo: {
      flex: 1,
    },
    prayerName: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 4,
    },
    prayerTime: {
      fontSize: 18,
      fontWeight: '600',
      marginBottom: 8,
    },
    prayerTimeRemaining: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    prayerTimeRemainingText: {
      fontSize: 14,
      marginLeft: 6,
    },
    prayerCardIconContainer: {
      width: 64,
      height: 64,
      borderRadius: 32,
      justifyContent: 'center',
      alignItems: 'center',
    },
    prayerCardIcon: {
      fontSize: 32,
    },
    prayerCardActions: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    prayerCardButton: {
      flex: 1,
      paddingVertical: 10,
      borderRadius: 8,
      alignItems: 'center',
      marginHorizontal: 4,
    },
    prayerCardButtonText: {
      fontSize: 14,
      fontWeight: '600',
    },
    prayerCardButtonText2: {
      fontSize: 14,
      fontWeight: '600',
      color: '#FFFFFF',
    },
    notificationOptions: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      backgroundColor: 'rgba(0,0,0,0.05)',
      paddingVertical: 12,
      paddingHorizontal: 8,
      marginTop: 16,
      borderRadius: 8,
    },
    notificationOption: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 16,
    },
    selectedNotificationOption: {
      backgroundColor: 'rgba(0,0,0,0.1)',
    },
    notificationOptionText: {
      fontSize: 12,
      marginLeft: 6,
    },
    // Quote Card
    quoteContainer: {
      marginHorizontal: 16,
      marginBottom: 24,
    },
    quoteCard: {
      borderLeftWidth: 4,
      borderLeftColor: '#4CAF50',
    },
    quoteHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    quoteLabel: {
      fontSize: 14,
      fontWeight: '600',
      marginLeft: 8,
    },
    quoteText: {
      fontSize: 16,
      fontStyle: 'italic',
      lineHeight: 24,
      marginBottom: 8,
    },
    quoteSource: {
      fontSize: 14,
      marginBottom: 12,
    },
    quoteActions: {
      flexDirection: 'row',
      borderTopWidth: 1,
      borderTopColor: 'rgba(0,0,0,0.05)',
      paddingTop: 12,
      marginTop: 4,
    },
    quoteAction: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 16,
    },
    quoteActionText: {
      fontSize: 12,
      fontWeight: '600',
      marginLeft: 6,
    },
    // Section Headers
    sectionTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginTop: 16,
      marginBottom: 16,
      marginHorizontal: 16,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 16,
      marginBottom: 16,
      marginHorizontal: 16,
    },
    seeAllText: {
      fontSize: 14,
      fontWeight: '600',
    },
    // Quick Actions - Redesigned
    quickActionsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      marginBottom: 16,
    },
    actionGridItem: {
      width: '23%',
      aspectRatio: 1,
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    actionIconContainer: {
      width: 48,
      height: 48,
      borderRadius: 24,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 8,
    },
    actionText: {
      fontSize: 12,
      fontWeight: '600',
      textAlign: 'center',
    },
    // Featured Carousel
    featuredCarousel: {
      paddingHorizontal: 16,
    },
    featuredCard: {
      width: width - 32,
      height: 200,
      borderRadius: 20,
      overflow: 'hidden',
      marginRight: 16,
    },
    featuredImage: {
      width: '100%',
      height: '100%',
    },
    featuredOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'flex-end',
    },
    featuredContent: {
      padding: 20,
    },
    featuredTitle: {
      color: '#FFFFFF',
      fontSize: 22,
      fontWeight: 'bold',
      marginBottom: 8,
    },
    featuredDescription: {
      color: '#FFFFFF',
      fontSize: 14,
      opacity: 0.9,
      marginBottom: 16,
    },
    featuredButton: {
      backgroundColor: 'rgba(255,255,255,0.2)',
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 20,
      alignSelf: 'flex-start',
    },
    featuredButtonText: {
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: '600',
    },
    carouselIndicators: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: 16,
      marginBottom: 8,
    },
    carouselIndicator: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: 'rgba(0,0,0,0.2)',
      marginHorizontal: 4,
    },
    carouselIndicatorActive: {
      width: 16,
      backgroundColor: '#4CAF50',
    },
    // Calendar Card
    calendarCard: {
      marginHorizontal: 16,
      marginBottom: 24,
    },
    calendarHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    calendarTitle: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    calendarSubtitle: {
      fontSize: 14,
      marginTop: 4,
    },
    calendarDate: {
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 16,
    },
    calendarDateText: {
      fontSize: 12,
      fontWeight: '600',
    },
    upcomingEvents: {
      borderTopWidth: 1,
      borderTopColor: 'rgba(0,0,0,0.05)',
      paddingTop: 16,
    },
    upcomingEventsTitle: {
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 12,
    },
    eventItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    eventIcon: {
      width: 36,
      height: 36,
      borderRadius: 18,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    eventInfo: {
      flex: 1,
    },
    eventTitle: {
      fontSize: 14,
      fontWeight: '600',
      marginBottom: 2,
    },
    eventDate: {
      fontSize: 12,
    },
    // Premium Card
    premiumCard: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 20,
      borderRadius: 20,
      marginHorizontal: 16,
      marginTop: 8,
      marginBottom: 16,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 6,
    },
    premiumContent: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    premiumIcon: {
      marginRight: 16,
    },
    premiumText: {
      flex: 1,
    },
    premiumTitle: {
      color: '#FFFFFF',
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 4,
    },
    premiumDescription: {
      color: '#FFFFFF',
      fontSize: 14,
      opacity: 0.9,
    },
    premiumButtonContainer: {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 20,
    },
    premiumButton: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: 'bold',
    },
    // Live Stream styles
    liveStreamContainer: {
      marginHorizontal: 16,
      marginBottom: 20,
    },
    liveStreamCard: {
      borderRadius: 16,
      overflow: 'hidden',
      height: 220,
    },
    liveStreamImage: {
      width: '100%',
      height: '100%',
    },
    liveStreamOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0,0,0,0.5)',
      padding: 16,
    },
    liveStreamIndicator: {
      alignSelf: 'flex-start',
      backgroundColor: '#FF0000',
      paddingVertical: 4,
      paddingHorizontal: 8,
      borderRadius: 4,
      marginBottom: 8,
    },
    liveStreamIndicatorText: {
      color: '#FFFFFF',
      fontSize: 12,
      fontWeight: 'bold',
    },
    liveStreamContent: {
      flex: 1,
      justifyContent: 'flex-end',
    },
    liveStreamTitle: {
      color: '#FFFFFF',
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 8,
    },
    liveStreamMosque: {
      color: '#FFFFFF',
      fontSize: 14,
      opacity: 0.9,
      marginBottom: 8,
    },
    liveStreamViewers: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    liveStreamViewersText: {
      color: '#FFFFFF',
      fontSize: 14,
      marginLeft: 6,
    },
    watchNowButton: {
      backgroundColor: '#4CAF50',
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 8,
      alignSelf: 'flex-start',
    },
    watchNowText: {
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: '600',
    },
    // Upcoming streams styles
    upcomingStreamsScroll: {
      paddingHorizontal: 16,
    },
    upcomingStreamCard: {
      width: 200,
      borderRadius: 12,
      overflow: 'hidden',
      marginRight: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    upcomingStreamImage: {
      width: '100%',
      height: 120,
    },
    upcomingStreamContent: {
      padding: 12,
    },
    upcomingStreamTitle: {
      fontSize: 14,
      fontWeight: '600',
      marginBottom: 4,
    },
    upcomingStreamMosque: {
      fontSize: 12,
      marginBottom: 8,
    },
    upcomingStreamTime: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    upcomingStreamTimeText: {
      fontSize: 12,
      fontWeight: '500',
      marginLeft: 4,
    },
  });