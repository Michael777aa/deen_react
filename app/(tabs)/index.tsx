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
  Platform,
  Vibration
} from 'react-native';
import { router } from 'expo-router';
import { useAuthStore } from '@/store/useAuthStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { Card } from '@/components/Card';
import { colors } from '@/constants/colors';
import { prayerTimes, getNextPrayer } from '@/mocks/prayerTimes';
import { PrayerTimeCard } from '@/components/PrayerTimeCard';
import { StreamCard } from '@/components/StreamCard';
import { getLiveStreams, getUpcomingStreams } from '@/mocks/streamData';
import { 
  MessageCircle, 
  Calendar, 
  BookOpen, 
  Settings, 
  MapPin, 
  BookMarked, 
  Compass, 
  Moon, 
  ShoppingBag, 
  Utensils,
  Bell,
  Star,
  Clock,
  Heart,
  Zap,
  Sun,
  Volume2,
  Vibrate,
  Video,
  User,
  Users as UsersIcon
} from 'lucide-react-native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.7;

export default function HomeScreen() {
  const { user, isAuthenticated } = useAuthStore();
  const { darkMode, notifications, prayerReminders } = useSettingsStore();
  const theme = darkMode ? 'dark' : 'light';
  const [refreshing, setRefreshing] = useState(false);
  const [greeting, setGreeting] = useState('');
  const [notificationType, setNotificationType] = useState('adhan'); // 'adhan', 'vibration', 'text'
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
    {
      id: '2',
      title: 'Ramadan Preparation',
      description: 'Get ready for the blessed month with these essential tips',
      image: 'https://images.unsplash.com/photo-1532635241-17e820acc59f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      route: '/ramadan'
    },
    {
      id: '3',
      title: 'Islamic Finance Basics',
      description: 'Learn about halal investments and financial planning',
      image: 'https://images.unsplash.com/photo-1579621970588-a35d0e7ab9b6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      route: '/finance'
    }
  ];
  
  // Get live and upcoming streams
  const liveStreams = getLiveStreams();
  const upcomingStreams = getUpcomingStreams().slice(0, 3);
  
  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/(auth)/login');
    }
    
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
  }, [isAuthenticated]);

  const nextPrayer = getNextPrayer();
  
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const toggleNotificationOptions = () => {
    if (showNotificationOptions) {
      Animated.timing(notificationOptionsAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true
      }).start(() => setShowNotificationOptions(false));
    } else {
      setShowNotificationOptions(true);
      Animated.timing(notificationOptionsAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true
      }).start();
    }
  };

  const setNotificationPreference = (type: string) => {
    setNotificationType(type);
    toggleNotificationOptions();
    
    // Provide feedback based on selection
    if (Platform.OS !== 'web') {
      if (type === 'vibration') {
        Vibration.vibrate([0, 100, 50, 100]);
      } else if (type === 'adhan') {
        // Would play a sound here in a real app
        Vibration.vibrate(100);
      } else {
        Vibration.vibrate(50);
      }
    }
  };

  if (!user) {
    return null;
  }

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors[theme].background }]}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      showsVerticalScrollIndicator={false}
    >
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
                  {user.name}
                </Text>
                <Text style={styles.subtitle}>
                  May Allah bless your day
                </Text>
              </View>
              <TouchableOpacity onPress={() => router.push('/settings')} style={styles.avatarContainer}>
                <Image
                  source={{ uri: user.photoURL || 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80' }}
                  style={styles.avatar}
                />
                <View style={styles.onlineIndicator} />
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
      </Animated.View>

      {/* Next Prayer Card - Redesigned */}
      <Animated.View style={[styles.prayerCardContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <Card style={styles.prayerCard}>
          <View style={styles.prayerCardHeader}>
            <View style={styles.prayerCardTitle}>
              <Bell size={18} color={colors[theme].primary} />
              <Text style={[styles.prayerCardTitleText, { color: colors[theme].text }]}>
                Next Prayer
              </Text>
            </View>
            <TouchableOpacity 
              style={styles.notificationAction}
              onPress={toggleNotificationOptions}
            >
              {notificationType === 'adhan' && <Volume2 size={16} color={colors[theme].primary} />}
              {notificationType === 'vibration' && <Vibrate size={16} color={colors[theme].primary} />}
              {notificationType === 'text' && <Bell size={16} color={colors[theme].primary} />}
            </TouchableOpacity>
          </View>
          
          <View style={styles.prayerCardContent}>
            <View style={styles.prayerCardInfo}>
              <Text style={[styles.prayerName, { color: colors[theme].text }]}>
                {nextPrayer.name}
              </Text>
              <Text style={[styles.prayerTime, { color: colors[theme].primary }]}>
                {nextPrayer.time}
              </Text>
              <View style={styles.prayerTimeRemaining}>
                <Clock size={14} color={colors[theme].inactive} />
                <Text style={[styles.prayerTimeRemainingText, { color: colors[theme].inactive }]}>
                  {nextPrayer.timeRemaining} remaining
                </Text>
              </View>
            </View>
            
            <View style={[styles.prayerCardIconContainer, { backgroundColor: colors[theme].primary + '15' }]}>
              <Text style={styles.prayerCardIcon}>
                {nextPrayer.name === 'Fajr' ? '🌅' : 
                 nextPrayer.name === 'Dhuhr' ? '☀️' : 
                 nextPrayer.name === 'Asr' ? '🌤️' : 
                 nextPrayer.name === 'Maghrib' ? '🌇' : '🌙'}
              </Text>
            </View>
          </View>
          
          <View style={styles.prayerCardActions}>
            <TouchableOpacity 
              style={[styles.prayerCardButton, { backgroundColor: colors[theme].primary + '15' }]}
              onPress={() => router.push('/prayers')}
            >
              <Text style={[styles.prayerCardButtonText, { color: colors[theme].primary }]}>
                All Prayer Times
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.prayerCardButton, { backgroundColor: colors[theme].primary }]}
              onPress={() => router.push('/qibla')}
            >
              <Text style={styles.prayerCardButtonText2}>
                Qibla Direction
              </Text>
            </TouchableOpacity>
          </View>
          
          {showNotificationOptions && (
            <Animated.View 
              style={[
                styles.notificationOptions,
                { opacity: notificationOptionsAnim }
              ]}
            >
              <TouchableOpacity 
                style={[
                  styles.notificationOption,
                  notificationType === 'adhan' && styles.selectedNotificationOption
                ]}
                onPress={() => setNotificationPreference('adhan')}
              >
                <Volume2 size={16} color={colors[theme].text} />
                <Text style={[styles.notificationOptionText, { color: colors[theme].text }]}>Adhan</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.notificationOption,
                  notificationType === 'vibration' && styles.selectedNotificationOption
                ]}
                onPress={() => setNotificationPreference('vibration')}
              >
                <Vibrate size={16} color={colors[theme].text} />
                <Text style={[styles.notificationOptionText, { color: colors[theme].text }]}>Vibration</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.notificationOption,
                  notificationType === 'text' && styles.selectedNotificationOption
                ]}
                onPress={() => setNotificationPreference('text')}
              >
                <Bell size={16} color={colors[theme].text} />
                <Text style={[styles.notificationOptionText, { color: colors[theme].text }]}>Text Only</Text>
              </TouchableOpacity>
            </Animated.View>
          )}
        </Card>
      </Animated.View>

      {/* Daily Inspiration - Redesigned */}
      <Animated.View style={[styles.quoteContainer, { opacity: fadeAnim }]}>
        <Card style={styles.quoteCard}>
          <View style={styles.quoteHeader}>
            <Heart size={20} color={colors[theme].primary} />
            <Text style={[styles.quoteLabel, { color: colors[theme].primary }]}>
              Daily Inspiration
            </Text>
          </View>
          <Text style={[styles.quoteText, { color: colors[theme].text }]}>
            "The best among you are those who have the best character."
          </Text>
          <Text style={[styles.quoteSource, { color: colors[theme].inactive }]}>
            - Prophet Muhammad (peace be upon him)
          </Text>
          <View style={styles.quoteActions}>
            <TouchableOpacity style={styles.quoteAction}>
              <Heart size={16} color={colors[theme].primary} />
              <Text style={[styles.quoteActionText, { color: colors[theme].primary }]}>
                Save
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quoteAction}>
              <MessageCircle size={16} color={colors[theme].inactive} />
              <Text style={[styles.quoteActionText, { color: colors[theme].inactive }]}>
                Share
              </Text>
            </TouchableOpacity>
          </View>
        </Card>
      </Animated.View>

      {/* Live Streams Section - Redesigned */}
      {liveStreams.length > 0 && (
        <>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors[theme].text }]}>
              Live Now
            </Text>
            <TouchableOpacity onPress={() => router.push('/streams')}>
              <Text style={[styles.seeAllText, { color: colors[theme].primary }]}>
                See All
              </Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.liveStreamContainer}>
            <TouchableOpacity 
              style={styles.liveStreamCard}
              onPress={() => router.push(`/streams/${liveStreams[0].id}`)}
            >
              <Image 
                source={{ uri: liveStreams[0].thumbnailUrl }} 
                style={styles.liveStreamImage}
              />
              <View style={styles.liveStreamOverlay}>
                <View style={styles.liveStreamIndicator}>
                  <Text style={styles.liveStreamIndicatorText}>LIVE</Text>
                </View>
                <View style={styles.liveStreamContent}>
                  <Text style={styles.liveStreamTitle} numberOfLines={2}>
                    {liveStreams[0].title}
                  </Text>
                  <Text style={styles.liveStreamMosque}>
                    {liveStreams[0].mosqueName}
                  </Text>
                  <View style={styles.liveStreamViewers}>
                    <UsersIcon size={14} color="#FFFFFF" />
                    <Text style={styles.liveStreamViewersText}>
                      {liveStreams[0].viewCount} watching
                    </Text>
                  </View>
                  <TouchableOpacity style={styles.watchNowButton}>
                    <Text style={styles.watchNowText}>Watch Now</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </>
      )}

      {/* Upcoming Streams - Redesigned */}
      {upcomingStreams.length > 0 && (
        <>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors[theme].text }]}>
              Upcoming Streams
            </Text>
            <TouchableOpacity onPress={() => router.push('/streams')}>
              <Text style={[styles.seeAllText, { color: colors[theme].primary }]}>
                See All
              </Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.upcomingStreamsScroll}
          >
            {upcomingStreams.map((stream) => (
              <TouchableOpacity 
                key={stream.id}
                style={[styles.upcomingStreamCard, { backgroundColor: colors[theme].card }]}
                onPress={() => router.push(`/streams/${stream.id}`)}
              >
                <Image 
                  source={{ uri: stream.thumbnailUrl }} 
                  style={styles.upcomingStreamImage}
                />
                <View style={styles.upcomingStreamContent}>
                  <Text 
                    style={[styles.upcomingStreamTitle, { color: colors[theme].text }]}
                    numberOfLines={2}
                  >
                    {stream.title}
                  </Text>
                  <Text style={[styles.upcomingStreamMosque, { color: colors[theme].inactive }]}>
                    {stream.mosqueName}
                  </Text>
                  <View style={styles.upcomingStreamTime}>
                    <Clock size={12} color={colors[theme].primary} />
                    <Text style={[styles.upcomingStreamTimeText, { color: colors[theme].primary }]}>
                      {new Date(stream.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </>
      )}

      {/* Quick Actions - Redesigned */}
      <Text style={[styles.sectionTitle, { color: colors[theme].text, marginTop: 24 }]}>
        Quick Actions
      </Text>
      
      <View style={styles.quickActionsGrid}>
        <TouchableOpacity 
          style={[styles.actionGridItem, { backgroundColor: colors[theme].card }]}
          onPress={() => router.push('/quran')}
        >
          <View style={[styles.actionIconContainer, { backgroundColor: '#4CAF50' + '20' }]}>
            <BookOpen size={24} color="#4CAF50" />
          </View>
          <Text style={[styles.actionText, { color: colors[theme].text }]}>
            Quran
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionGridItem, { backgroundColor: colors[theme].card }]}
          onPress={() => router.push('/prayers')}
        >
          <View style={[styles.actionIconContainer, { backgroundColor: '#2196F3' + '20' }]}>
            <Calendar size={24} color="#2196F3" />
          </View>
          <Text style={[styles.actionText, { color: colors[theme].text }]}>
            Prayer Times
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionGridItem, { backgroundColor: colors[theme].card }]}
          onPress={() => router.push('/qibla')}
        >
          <View style={[styles.actionIconContainer, { backgroundColor: '#FF9800' + '20' }]}>
            <Compass size={24} color="#FF9800" />
          </View>
          <Text style={[styles.actionText, { color: colors[theme].text }]}>
            Qibla
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionGridItem, { backgroundColor: colors[theme].card }]}
          onPress={() => router.push('/map')}
        >
          <View style={[styles.actionIconContainer, { backgroundColor: '#9C27B0' + '20' }]}>
            <MapPin size={24} color="#9C27B0" />
          </View>
          <Text style={[styles.actionText, { color: colors[theme].text }]}>
            Mosques
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionGridItem, { backgroundColor: colors[theme].card }]}
          onPress={() => router.push('/duas')}
        >
          <View style={[styles.actionIconContainer, { backgroundColor: '#E91E63' + '20' }]}>
            <BookMarked size={24} color="#E91E63" />
          </View>
          <Text style={[styles.actionText, { color: colors[theme].text }]}>
            Duas
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionGridItem, { backgroundColor: colors[theme].card }]}
          onPress={() => router.push('/dhikr')}
        >
          <View style={[styles.actionIconContainer, { backgroundColor: '#607D8B' + '20' }]}>
            <Moon size={24} color="#607D8B" />
          </View>
          <Text style={[styles.actionText, { color: colors[theme].text }]}>
            Dhikr
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionGridItem, { backgroundColor: colors[theme].card }]}
          onPress={() => router.push('/streams')}
        >
          <View style={[styles.actionIconContainer, { backgroundColor: '#F44336' + '20' }]}>
            <Video size={24} color="#F44336" />
          </View>
          <Text style={[styles.actionText, { color: colors[theme].text }]}>
            Streams
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionGridItem, { backgroundColor: colors[theme].card }]}
          onPress={() => router.push('/scanner')}
        >
          <View style={[styles.actionIconContainer, { backgroundColor: '#00BCD4' + '20' }]}>
            <ShoppingBag size={24} color="#00BCD4" />
          </View>
          <Text style={[styles.actionText, { color: colors[theme].text }]}>
            Halal Scanner
          </Text>
        </TouchableOpacity>
      </View>

      {/* Featured Content Carousel - Redesigned */}
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors[theme].text }]}>
          Featured Content
        </Text>
        <TouchableOpacity onPress={() => router.push('/learn')}>
          <Text style={[styles.seeAllText, { color: colors[theme].primary }]}>
            See All
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.featuredCarousel}
        pagingEnabled
        onMomentumScrollEnd={(e) => {
          const contentOffset = e.nativeEvent.contentOffset.x;
          const viewSize = width - 32;
          setActiveSlide(Math.floor(contentOffset / viewSize));
        }}
      >
        {featuredContent.map((item, index) => (
          <TouchableOpacity 
            key={item.id}
            style={styles.featuredCard}
            onPress={() => router.push(item.route)}
          >
            <Image 
              source={{ uri: item.image }} 
              style={styles.featuredImage}
            />
            <View style={styles.featuredOverlay}>
              <View style={styles.featuredContent}>
                <Text style={styles.featuredTitle}>{item.title}</Text>
                <Text style={styles.featuredDescription}>{item.description}</Text>
                <View style={styles.featuredButton}>
                  <Text style={styles.featuredButtonText}>View Guide</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.carouselIndicators}>
        {featuredContent.map((_, index) => (
          <View 
            key={index} 
            style={[
              styles.carouselIndicator, 
              index === activeSlide && styles.carouselIndicatorActive
            ]} 
          />
        ))}
      </View>

      {/* Islamic Calendar - Redesigned */}
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors[theme].text }]}>
          Islamic Calendar
        </Text>
        <TouchableOpacity onPress={() => router.push('/islamic-calendar')}>
          <Text style={[styles.seeAllText, { color: colors[theme].primary }]}>
            Full Calendar
          </Text>
        </TouchableOpacity>
      </View>

      <Card style={styles.calendarCard}>
        <View style={styles.calendarHeader}>
          <View>
            <Text style={[styles.calendarTitle, { color: colors[theme].text }]}>
              Ramadan 1445
            </Text>
            <Text style={[styles.calendarSubtitle, { color: colors[theme].inactive }]}>
              Begins in 45 days
            </Text>
          </View>
          <View style={[styles.calendarDate, { backgroundColor: colors[theme].primary + '20' }]}>
            <Text style={[styles.calendarDateText, { color: colors[theme].primary }]}>
              15 Sha'ban 1445
            </Text>
          </View>
        </View>
        
        <View style={styles.upcomingEvents}>
          <Text style={[styles.upcomingEventsTitle, { color: colors[theme].text }]}>
            Upcoming Events
          </Text>
          
          <View style={styles.eventItem}>
            <View style={[styles.eventIcon, { backgroundColor: '#4CAF50' + '20' }]}>
              <Moon size={16} color="#4CAF50" />
            </View>
            <View style={styles.eventInfo}>
              <Text style={[styles.eventTitle, { color: colors[theme].text }]}>
                Laylat al-Bara'at
              </Text>
              <Text style={[styles.eventDate, { color: colors[theme].inactive }]}>
                15 Sha'ban • 2 days from now
              </Text>
            </View>
          </View>
          
          <View style={styles.eventItem}>
            <View style={[styles.eventIcon, { backgroundColor: '#FF9800' + '20' }]}>
              <Sun size={16} color="#FF9800" />
            </View>
            <View style={styles.eventInfo}>
              <Text style={[styles.eventTitle, { color: colors[theme].text }]}>
                First day of Ramadan
              </Text>
              <Text style={[styles.eventDate, { color: colors[theme].inactive }]}>
                1 Ramadan • 45 days from now
              </Text>
            </View>
          </View>
        </View>
      </Card>

      {/* Premium Upgrade - Redesigned */}
      <TouchableOpacity 
        style={[
          styles.premiumCard, 
          { 
            backgroundColor: colors[theme].primary,
            shadowColor: colors[theme].primary,
          }
        ]}
        onPress={() => router.push('/premium')}
      >
        <View style={styles.premiumContent}>
          <View style={styles.premiumIcon}>
            <Star size={24} color="#FFFFFF" fill="#FFFFFF" />
          </View>
          <View style={styles.premiumText}>
            <Text style={styles.premiumTitle}>
              Upgrade to Premium
            </Text>
            <Text style={styles.premiumDescription}>
              Unlock exclusive content, advanced features, and ad-free experience
            </Text>
          </View>
        </View>
        <View style={styles.premiumButtonContainer}>
          <Text style={styles.premiumButton}>
            Upgrade
          </Text>
        </View>
      </TouchableOpacity>
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