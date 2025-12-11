import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Linking,
  Animated,
  Dimensions,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useSettingsStore } from "@/store/useSettingsStore";
import { colors } from "@/constants/colors";
import { useRestaurantStore } from "@/store/useRestaurantStore";
import { Card } from "@/components/Card";
import {
  MapPin,
  Phone,
  Clock,
  Globe,
  Star,
  ChevronLeft,
  Share2,
  Heart,
  ExternalLink,
} from "lucide-react-native";

const { width } = Dimensions.get("window");
const HEADER_MAX_HEIGHT = 250;
const HEADER_MIN_HEIGHT = 90;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

export default function RestaurantDetailScreen() {
  const { id } = useLocalSearchParams();
  const { darkMode } = useSettingsStore();
  const theme = darkMode ? "dark" : "light";
  const { getRestaurantById } = useRestaurantStore();

  const restaurant: any = getRestaurantById(id as string);
  const scrollY = new Animated.Value(0);

  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: "clamp",
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [1, 0.5, 0],
    extrapolate: "clamp",
  });

  const titleOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [0, 0.5, 1],
    extrapolate: "clamp",
  });

  if (!restaurant) {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: colors[theme].background },
        ]}
      >
        <Text style={[styles.errorText, { color: colors[theme].text }]}>
          Restaurant not found
        </Text>
        <TouchableOpacity
          style={[
            styles.backButton,
            { backgroundColor: colors[theme].primary },
          ]}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const openMap = () => {
    const url = `https://maps.google.com/?q=${restaurant.latitude},${restaurant.longitude}`;
    Linking.openURL(url);
  };

  const callRestaurant = () => {
    if (restaurant.phone) {
      Linking.openURL(`tel:${restaurant.phone}`);
    }
  };

  const visitWebsite = () => {
    if (restaurant.website) {
      Linking.openURL(restaurant.website);
    }
  };

  const shareRestaurant = () => {
    // In a real app, implement sharing functionality
    console.log("Share restaurant:", restaurant.name);
  };

  return (
    <View
      style={[styles.container, { backgroundColor: colors[theme].background }]}
    >
      <Animated.View
        style={[
          styles.header,
          {
            height: headerHeight,
            backgroundColor: colors[theme].card,
          },
        ]}
      >
        <Animated.Image
          source={{ uri: restaurant.imageUrl }}
          style={[styles.headerImage, { opacity: headerOpacity }]}
          resizeMode="cover"
        />
        <View style={styles.headerOverlay}>
          <Animated.View
            style={[styles.headerTitle, { opacity: titleOpacity }]}
          >
            <Text style={styles.headerTitleText} numberOfLines={1}>
              {restaurant.name}
            </Text>
          </Animated.View>
          <View style={styles.headerButtons}>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={() => router.back()}
            >
              <ChevronLeft size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={shareRestaurant}
            >
              <Share2 size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>

      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
      >
        <View style={styles.infoContainer}>
          <Text style={[styles.restaurantName, { color: colors[theme].text }]}>
            {restaurant.name}
          </Text>

          <View style={styles.metaContainer}>
            <View
              style={[
                styles.certificationBadge,
                { backgroundColor: colors[theme].primary + "20" },
              ]}
            >
              <Text
                style={[
                  styles.certificationText,
                  { color: colors[theme].primary },
                ]}
              >
                {restaurant.certification}
              </Text>
            </View>
            <Text
              style={[styles.cuisineText, { color: colors[theme].inactive }]}
            >
              {restaurant.cuisine}
            </Text>
            <Text
              style={[styles.distanceText, { color: colors[theme].inactive }]}
            >
              {restaurant.distance}
            </Text>
          </View>

          {/* Rating */}
          <View style={styles.ratingContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={16}
                fill={
                  star <= restaurant.rating
                    ? colors[theme].primary
                    : "transparent"
                }
                color={
                  star <= restaurant.rating
                    ? colors[theme].primary
                    : colors[theme].inactive
                }
              />
            ))}
            <Text style={[styles.ratingText, { color: colors[theme].text }]}>
              {restaurant.rating.toFixed(1)} ({restaurant.reviewCount} reviews)
            </Text>
          </View>

          {/* Contact Info */}
          <Card style={styles.contactCard}>
            <TouchableOpacity style={styles.contactItem} onPress={openMap}>
              <MapPin size={20} color={colors[theme].primary} />
              <Text style={[styles.contactText, { color: colors[theme].text }]}>
                {restaurant.address}
              </Text>
              <ExternalLink size={16} color={colors[theme].inactive} />
            </TouchableOpacity>

            {restaurant.phone && (
              <TouchableOpacity
                style={styles.contactItem}
                onPress={callRestaurant}
              >
                <Phone size={20} color={colors[theme].primary} />
                <Text
                  style={[styles.contactText, { color: colors[theme].text }]}
                >
                  {restaurant.phone}
                </Text>
                <ExternalLink size={16} color={colors[theme].inactive} />
              </TouchableOpacity>
            )}

            {restaurant.hours && (
              <View style={styles.contactItem}>
                <Clock size={20} color={colors[theme].primary} />
                <Text
                  style={[styles.contactText, { color: colors[theme].text }]}
                >
                  {restaurant.hours}
                </Text>
                <View style={{ width: 16 }} />
              </View>
            )}

            {restaurant.website && (
              <TouchableOpacity
                style={styles.contactItem}
                onPress={visitWebsite}
              >
                <Globe size={20} color={colors[theme].primary} />
                <Text
                  style={[styles.contactText, { color: colors[theme].text }]}
                >
                  {restaurant.website}
                </Text>
                <ExternalLink size={16} color={colors[theme].inactive} />
              </TouchableOpacity>
            )}
          </Card>

          {/* Description */}
          <Card style={styles.descriptionCard}>
            <Text style={[styles.sectionTitle, { color: colors[theme].text }]}>
              About
            </Text>
            <Text
              style={[styles.descriptionText, { color: colors[theme].text }]}
            >
              {restaurant.description}
            </Text>
          </Card>

          {/* Menu Highlights */}
          {restaurant.menuHighlights &&
            restaurant.menuHighlights.length > 0 && (
              <Card style={styles.menuCard}>
                <Text
                  style={[styles.sectionTitle, { color: colors[theme].text }]}
                >
                  Menu Highlights
                </Text>
                {restaurant.menuHighlights.map((item: any, index: any) => (
                  <View key={index} style={styles.menuItem}>
                    <Text
                      style={[
                        styles.menuItemName,
                        { color: colors[theme].text },
                      ]}
                    >
                      {item.name}
                    </Text>
                    <Text
                      style={[
                        styles.menuItemPrice,
                        { color: colors[theme].primary },
                      ]}
                    >
                      {item.price}
                    </Text>
                  </View>
                ))}
              </Card>
            )}

          {/* Photos */}
          <Card style={styles.photosCard}>
            <View style={styles.photosSectionHeader}>
              <Text
                style={[styles.sectionTitle, { color: colors[theme].text }]}
              >
                Photos
              </Text>
              <TouchableOpacity>
                <Text
                  style={[styles.seeAllText, { color: colors[theme].primary }]}
                >
                  See All
                </Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.photosContainer}
            >
              <Image
                source={{
                  uri: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
                }}
                style={styles.photoItem}
              />
              <Image
                source={{
                  uri: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
                }}
                style={styles.photoItem}
              />
              <Image
                source={{
                  uri: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
                }}
                style={styles.photoItem}
              />
            </ScrollView>
          </Card>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[
                styles.actionButton,
                { backgroundColor: colors[theme].primary },
              ]}
              onPress={openMap}
            >
              <Text style={styles.actionButtonText}>Get Directions</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.favoriteButton,
                { backgroundColor: colors[theme].card },
              ]}
            >
              <Heart size={20} color={colors[theme].primary} />
            </TouchableOpacity>

            {restaurant.phone && (
              <TouchableOpacity
                style={[
                  styles.callButton,
                  { backgroundColor: colors[theme].card },
                ]}
                onPress={callRestaurant}
              >
                <Phone size={20} color={colors[theme].text} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    overflow: "hidden",
    zIndex: 10,
  },
  headerImage: {
    width: "100%",
    height: "100%",
  },
  headerOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "space-between",
  },
  headerTitle: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: HEADER_MIN_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  headerTitleText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  headerButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    paddingTop: 48,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingTop: HEADER_MAX_HEIGHT,
    paddingBottom: 24,
  },
  infoContainer: {
    padding: 16,
  },
  restaurantName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  metaContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 8,
  },
  certificationBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  certificationText: {
    fontSize: 12,
    fontWeight: "600",
  },
  cuisineText: {
    fontSize: 14,
  },
  distanceText: {
    fontSize: 14,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    marginLeft: 4,
  },
  contactCard: {
    marginBottom: 16,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 12,
  },
  contactText: {
    fontSize: 14,
    flex: 1,
  },
  descriptionCard: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 22,
  },
  menuCard: {
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  menuItemName: {
    fontSize: 14,
    flex: 1,
  },
  menuItemPrice: {
    fontSize: 14,
    fontWeight: "600",
  },
  photosCard: {
    marginBottom: 16,
  },
  photosSectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: "500",
  },
  photosContainer: {
    paddingBottom: 8,
  },
  photoItem: {
    width: 120,
    height: 120,
    borderRadius: 8,
    marginRight: 8,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  actionButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  favoriteButton: {
    width: 48,
    height: 48,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  callButton: {
    width: 48,
    height: 48,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 100,
    marginBottom: 24,
  },
  backButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignSelf: "center",
  },
  backButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
