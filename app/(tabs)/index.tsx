import React, { useEffect, useState, useRef, useCallback } from "react";
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
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { useSettingsStore } from "@/store/useSettingsStore";
import { Card } from "@/components/Card";
import { colors } from "@/constants/colors";
import {
  MessageCircle,
  MapPin,
  BookMarked,
  Moon,
  Bell,
  Star,
  Clock,
  Heart,
  Video,
} from "lucide-react-native";
import { useAuth } from "@/context/auth";
import { getLayout } from "@/redux/features/layouts/layoutApi";
import { IPrayerTime } from "@/types/prayer";
import { useLocation } from "@/context/useLocation";
import { staticBase } from "@/lib/utils/member";
import { featuredContent } from "@/mocks/prayerTimes";
import { Share } from "react-native";
import { getNextPrayer } from "@/redux/features/prayers/prayersApi";

const { width } = Dimensions.get("window");
export default function HomeScreen() {
  const { user } = useAuth();
  const { darkMode } = useSettingsStore();
  const theme = darkMode ? "dark" : "light";
  const [refreshing, setRefreshing] = useState(false);
  const [greeting, setGreeting] = useState("");
  const [activeSlide, setActiveSlide] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const [layout, setLayout] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { location } = useLocation();
  const [nextPrayer, setNextPrayer] = useState<IPrayerTime | null>(null);
  const [loadingPrayer, setLoadingPrayer] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/(auth)/login");
    }
  }, [isLoading, user]);

  useEffect(() => {
    const fetchLayout = async () => {
      try {
        setIsLoading(true);
        const data = await getLayout();
        setLayout(data);
      } catch (error) {
        console.error("Failed to fetch layout:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLayout();
  }, []);

  useEffect(() => {
    const fetchPrayerData = async () => {
      if (location) {
        try {
          setLoadingPrayer(true);
          const nextPrayerData = await getNextPrayer(
            location.latitude,
            location.longitude
          );
          setNextPrayer(nextPrayerData);
        } catch (error) {
          console.error("Error fetching prayer data:", error);
        } finally {
          setLoadingPrayer(false);
        }
      }
    };

    fetchPrayerData();
  }, [location]);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting("Good morning");
    } else if (hour < 18) {
      setGreeting("Good afternoon");
    } else {
      setGreeting("Good evening");
    }

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();

    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % featuredContent.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [user]);

  const shareInspiration = useCallback(async () => {
    try {
      const message = `"The best among you are those who have the best character."\n\n- Prophet Muhammad (peace be upon him)\n\nShared via IslamicConnect App`;

      await Share.share({
        message,
        title: "Daily Islamic Inspiration",
      });
    } catch (err) {
      console.error("Error sharing inspiration:", err);
    }
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    if (location) {
      try {
        const nextPrayerData = await getNextPrayer(
          location.latitude,
          location.longitude
        );
        setNextPrayer(nextPrayerData);
      } catch (error) {
        console.error("Error refreshing prayer data:", error);
      }
    }
    setRefreshing(false);
  }, [location]);

  if (isLoading) return <ActivityIndicator />;
  if (!user) return null;

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
      <Animated.View
        style={[
          styles.headerContainer,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        <ImageBackground
          source={{
            uri: layout?.layoutImages?.[0]
              ? `${staticBase}/${layout.layoutImages[0]}`
              : "https://images.unsplash.com/photo-1519817650390-64a93db51149?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80",
          }}
          style={styles.headerBackground}
          imageStyle={styles.headerBackgroundImage}
        >
          <View style={styles.headerOverlay}>
            <View style={styles.header}>
              <View style={styles.headerLeft}>
                <Text style={styles.greeting}>{greeting},</Text>
                <Text style={styles.name}>{user.name}</Text>
                <Text style={styles.subtitle}>{layout?.blessing}</Text>
              </View>
              <TouchableOpacity
                onPress={() => router.push("/settings")}
                style={styles.avatarContainer}
              >
                <Image
                  source={{
                    uri:
                      user.picture?.replace("http://", "https://") ||
                      "https://images.unsplash.com/photo-1511367461989-f85a21fda167?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80",
                  }}
                  style={styles.avatar}
                />
                <View style={styles.onlineIndicator} />
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
      </Animated.View>

     
      <Animated.View
        style={[
          styles.prayerCardContainer,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        <Card style={styles.prayerCard}>
          <View style={styles.prayerCardHeader}>
            <View style={styles.prayerCardTitle}>
              <Bell size={18} color={colors[theme].primary} />
              <Text
                style={[
                  styles.prayerCardTitleText,
                  { color: colors[theme].text },
                ]}
              >
                Next Prayer
              </Text>
            </View>
          </View>

          <View style={styles.prayerCardActions}>
            <TouchableOpacity
              style={[
                styles.prayerCardButton,
                { backgroundColor: colors[theme].primary + "15" },
              ]}
              onPress={() => router.push("/prayers")}
            >
              <Text
                style={[
                  styles.prayerCardButtonText,
                  { color: colors[theme].primary },
                ]}
              >
                All Prayer Times
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.prayerCardButton,
                { backgroundColor: colors[theme].primary },
              ]}
              onPress={() => router.push("/qibla")}
            >
              <Text style={styles.prayerCardButtonText2}>Qibla Direction</Text>
            </TouchableOpacity>
          </View>
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
              <Text
                style={[
                  styles.quoteActionText,
                  { color: colors[theme].primary },
                ]}
              >
                Save
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.quoteAction}
              onPress={shareInspiration}
            >
              <MessageCircle size={16} color={colors[theme].inactive} />
              <Text
                style={[
                  styles.quoteActionText,
                  { color: colors[theme].inactive },
                ]}
              >
                Share
              </Text>
            </TouchableOpacity>
          </View>
        </Card>
      </Animated.View>

      {/* Live Streams Section - Redesigned */}

      {/* Quick Actions - Redesigned */}
      <Text
        style={[
          styles.sectionTitle,
          { color: colors[theme].text, marginTop: 24 },
        ]}
      >
        Quick Actions
      </Text>

      <View style={styles.quickActionsGrid}>
        <TouchableOpacity
          style={[
            styles.actionGridItem,
            { backgroundColor: colors[theme].card },
          ]}
          onPress={() => router.push("/map")}
        >
          <View
            style={[
              styles.actionIconContainer,
              { backgroundColor: "#9C27B0" + "20" },
            ]}
          >
            <MapPin size={24} color="#9C27B0" />
          </View>
          <Text style={[styles.actionText, { color: colors[theme].text }]}>
            Mosques
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.actionGridItem,
            { backgroundColor: colors[theme].card },
          ]}
          onPress={() => router.push("/duas")}
        >
          <View
            style={[
              styles.actionIconContainer,
              { backgroundColor: "#E91E63" + "20" },
            ]}
          >
            <BookMarked size={24} color="#E91E63" />
          </View>
          <Text style={[styles.actionText, { color: colors[theme].text }]}>
            Duas
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.actionGridItem,
            { backgroundColor: colors[theme].card },
          ]}
          onPress={() => router.push("/dhikr")}
        >
          <View
            style={[
              styles.actionIconContainer,
              { backgroundColor: "#607D8B" + "20" },
            ]}
          >
            <Moon size={24} color="#607D8B" />
          </View>
          <Text style={[styles.actionText, { color: colors[theme].text }]}>
            Dhikr
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.actionGridItem,
            { backgroundColor: colors[theme].card },
          ]}
          onPress={() => router.push("/streams")}
        >
          <View
            style={[
              styles.actionIconContainer,
              { backgroundColor: "#F44336" + "20" },
            ]}
          >
            <Video size={24} color="#F44336" />
          </View>
          <Text style={[styles.actionText, { color: colors[theme].text }]}>
            Streams
          </Text>
        </TouchableOpacity>
      </View>

      {/* Featured Content Carousel - Redesigned */}
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors[theme].text }]}>
          Featured Content
        </Text>
        <TouchableOpacity onPress={() => router.push("/learn")}>
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
        {featuredContent.map((item: any, index) => (
          <TouchableOpacity
            key={item.id}
            style={styles.featuredCard}
            onPress={() => router.push(item.route)}
          >
            <Image source={{ uri: item.image }} style={styles.featuredImage} />
            <View style={styles.featuredOverlay}>
              <View style={styles.featuredContent}>
                <Text style={styles.featuredTitle}>{item.title}</Text>
                <Text style={styles.featuredDescription}>
                  {item.description}
                </Text>
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
              index === activeSlide && styles.carouselIndicatorActive,
            ]}
          />
        ))}
      </View>

      {/* Islamic Calendar - Redesigned */}
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors[theme].text }]}>
          Islamic Calendar
        </Text>
        <TouchableOpacity onPress={() => router.push("/islamic-calendar")}>
          <Text style={[styles.seeAllText, { color: colors[theme].primary }]}>
            Full Calendar
          </Text>
        </TouchableOpacity>
      </View>

      {/* Premium Upgrade - Redesigned */}
      <TouchableOpacity
        style={[
          styles.premiumCard,
          {
            backgroundColor: colors[theme].primary,
            shadowColor: colors[theme].primary,
          },
        ]}
        onPress={() => router.push("/premium")}
      >
        <View style={styles.premiumContent}>
          <View style={styles.premiumIcon}>
            <Star size={24} color="#FFFFFF" fill="#FFFFFF" />
          </View>
          <View style={styles.premiumText}>
            <Text style={styles.premiumTitle}>Upgrade to Premium</Text>
            <Text style={styles.premiumDescription}>
              Unlock exclusive content, advanced features, and ad-free
              experience
            </Text>
          </View>
        </View>
        <View style={styles.premiumButtonContainer}>
          <Text style={styles.premiumButton}>Upgrade</Text>
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
    width: "100%",
    height: "100%",
  },
  headerBackgroundImage: {
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    justifyContent: "flex-end",
    padding: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  headerLeft: {
    flex: 1,
  },
  greeting: {
    fontSize: 16,
    color: "#FFFFFF",
    opacity: 0.9,
  },
  name: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginTop: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#FFFFFF",
    opacity: 0.8,
    marginTop: 4,
  },
  avatarContainer: {
    position: "relative",
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },
  onlineIndicator: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#4CAF50",
    borderWidth: 2,
    borderColor: "#FFFFFF",
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  prayerCardTitle: {
    flexDirection: "row",
    alignItems: "center",
  },
  prayerCardTitleText: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  notificationAction: {
    backgroundColor: "rgba(0,0,0,0.05)",
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  prayerCardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  prayerCardInfo: {
    flex: 1,
  },
  prayerName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  prayerTime: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  prayerTimeRemaining: {
    flexDirection: "row",
    alignItems: "center",
  },
  prayerTimeRemainingText: {
    fontSize: 14,
    marginLeft: 6,
  },
  prayerCardIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  prayerCardIcon: {
    fontSize: 32,
  },
  prayerCardActions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  prayerCardButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 4,
  },
  prayerCardButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  prayerCardButtonText2: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  notificationOptions: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "rgba(0,0,0,0.05)",
    paddingVertical: 12,
    paddingHorizontal: 8,
    marginTop: 16,
    borderRadius: 8,
  },
  notificationOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  selectedNotificationOption: {
    backgroundColor: "rgba(0,0,0,0.1)",
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
    borderLeftColor: "#4CAF50",
  },
  quoteHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  quoteLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
  },
  quoteText: {
    fontSize: 16,
    fontStyle: "italic",
    lineHeight: 24,
    marginBottom: 8,
  },
  quoteSource: {
    fontSize: 14,
    marginBottom: 12,
  },
  quoteActions: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
    paddingTop: 12,
    marginTop: 4,
  },
  quoteAction: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  quoteActionText: {
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 6,
  },
  // Section Headers
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 16,
    marginHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
    marginBottom: 16,
    marginHorizontal: 16,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: "600",
  },
  // Quick Actions - Redesigned
  quickActionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  actionGridItem: {
    width: "23%",
    aspectRatio: 1,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },
  // Featured Carousel
  featuredCarousel: {
    paddingHorizontal: 16,
  },
  featuredCard: {
    width: width - 32,
    height: 200,
    borderRadius: 20,
    overflow: "hidden",
    marginRight: 16,
  },
  featuredImage: {
    width: "100%",
    height: "100%",
  },
  featuredOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  featuredContent: {
    padding: 20,
  },
  featuredTitle: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 8,
  },
  featuredDescription: {
    color: "#FFFFFF",
    fontSize: 14,
    opacity: 0.9,
    marginBottom: 16,
  },
  featuredButton: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  featuredButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  carouselIndicators: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
    marginBottom: 8,
  },
  carouselIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(0,0,0,0.2)",
    marginHorizontal: 4,
  },
  carouselIndicatorActive: {
    width: 16,
    backgroundColor: "#4CAF50",
  },
  // Calendar Card
  calendarCard: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  calendarHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  calendarTitle: {
    fontSize: 18,
    fontWeight: "bold",
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
    fontWeight: "600",
  },
  upcomingEvents: {
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
    paddingTop: 16,
  },
  upcomingEventsTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  eventItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  eventIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  eventInfo: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 2,
  },
  eventDate: {
    fontSize: 12,
  },
  // Premium Card
  premiumCard: {
    flexDirection: "row",
    alignItems: "center",
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
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  premiumIcon: {
    marginRight: 16,
  },
  premiumText: {
    flex: 1,
  },
  premiumTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  premiumDescription: {
    color: "#FFFFFF",
    fontSize: 14,
    opacity: 0.9,
  },
  premiumButtonContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  premiumButton: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  // Live Stream styles
  liveStreamContainer: {
    marginHorizontal: 16,
    marginBottom: 20,
  },
  liveStreamCard: {
    borderRadius: 16,
    overflow: "hidden",
    height: 220,
  },
  liveStreamImage: {
    width: "100%",
    height: "100%",
  },
  liveStreamOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 16,
  },
  liveStreamIndicator: {
    alignSelf: "flex-start",
    backgroundColor: "#FF0000",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  liveStreamIndicatorText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  liveStreamContent: {
    flex: 1,
    justifyContent: "flex-end",
  },
  liveStreamTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  liveStreamMosque: {
    color: "#FFFFFF",
    fontSize: 14,
    opacity: 0.9,
    marginBottom: 8,
  },
  liveStreamViewers: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  liveStreamViewersText: {
    color: "#FFFFFF",
    fontSize: 14,
    marginLeft: 6,
  },
  watchNowButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  watchNowText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  // Upcoming streams styles
  upcomingStreamsScroll: {
    paddingHorizontal: 16,
  },
  upcomingStreamCard: {
    width: 200,
    borderRadius: 12,
    overflow: "hidden",
    marginRight: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  upcomingStreamImage: {
    width: "100%",
    height: 120,
  },
  upcomingStreamContent: {
    padding: 12,
  },
  upcomingStreamTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  upcomingStreamMosque: {
    fontSize: 12,
    marginBottom: 8,
  },
  upcomingStreamTime: {
    flexDirection: "row",
    alignItems: "center",
  },
  upcomingStreamTimeText: {
    fontSize: 12,
    fontWeight: "500",
    marginLeft: 4,
  },
});
