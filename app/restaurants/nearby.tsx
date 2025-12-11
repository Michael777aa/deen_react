import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  Dimensions,
  ActivityIndicator,
  Animated,
  Platform,
} from "react-native";
import { Stack, router } from "expo-router";
import { useSettingsStore } from "@/store/useSettingsStore";
import { colors } from "@/constants/colors";
import { useRestaurantStore } from "@/store/useRestaurantStore";
import { Search, Filter, X, ArrowLeft, MapPin } from "lucide-react-native";

const { width, height } = Dimensions.get("window");

const cuisineTypes = [
  { id: "1", name: "Indonesian" },
  { id: "2", name: "Korean" },
  { id: "3", name: "Turkish" },
  { id: "4", name: "Japanese" },
  { id: "5", name: "Indian" },
  { id: "6", name: "Western" },
  { id: "7", name: "Others" },
];

const halalStandards = [
  { id: "1", name: "Muslim Certified", icon: "🕌" },
  { id: "2", name: "Self Certified", icon: "✓" },
  { id: "3", name: "Seafood", icon: "🐟" },
  { id: "4", name: "Veggie", icon: "🥗" },
  { id: "5", name: "Halal Meat", icon: "🥩" },
  { id: "6", name: "Salam", icon: "☪️" },
];

export default function NearbyRestaurantsScreen() {
  const { darkMode } = useSettingsStore();
  const theme = darkMode ? "dark" : "light";
  const { restaurants } = useRestaurantStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [selectedStandards, setSelectedStandards] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const modalAnimation = useRef(new Animated.Value(0)).current;
  const mapAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      setUserLocation({
        latitude: 37.7749,
        longitude: -122.4194,
      });
      Animated.timing(mapAnimation, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const toggleCuisineSelection = (cuisineId: string) => {
    setSelectedCuisines((prev) =>
      prev.includes(cuisineId)
        ? prev.filter((id) => id !== cuisineId)
        : [...prev, cuisineId]
    );
  };

  const toggleStandardSelection = (standardId: string) => {
    setSelectedStandards((prev) =>
      prev.includes(standardId)
        ? prev.filter((id) => id !== standardId)
        : [...prev, standardId]
    );
  };

  const goBack = () => router.back();

  const showFilterModal = () => {
    setIsFilterModalVisible(true);
    Animated.timing(modalAnimation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const hideFilterModal = () => {
    Animated.timing(modalAnimation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setIsFilterModalVisible(false));
  };

  const modalTranslateY = modalAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [600, 0],
  });

  return (
    <>
      <Stack.Screen
        options={{ title: "Nearby Restaurants", headerShown: false }}
      />
      <View
        style={[
          styles.container,
          { backgroundColor: colors[theme].background },
        ]}
      >
        {/* Header */}
        <View
          style={[styles.customHeader, { backgroundColor: colors[theme].card }]}
        >
          <TouchableOpacity onPress={goBack} style={styles.backButton}>
            <ArrowLeft size={24} color={colors[theme].text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors[theme].text }]}>
            Nearby Restaurants
          </Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Search + Filter */}
        <View style={styles.searchFilterContainer}>
          <View
            style={[
              styles.searchContainer,
              {
                backgroundColor: colors[theme].card,
                borderColor: colors[theme].border,
              },
            ]}
          >
            <Search size={20} color={colors[theme].inactive} />
            <TextInput
              style={[styles.searchInput, { color: colors[theme].text }]}
              placeholder="Search for Restaurant"
              placeholderTextColor={colors[theme].inactive}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <TouchableOpacity
            style={[
              styles.filterButton,
              { backgroundColor: colors[theme].card },
            ]}
            onPress={showFilterModal}
          >
            <Filter size={20} color={colors[theme].text} />
          </TouchableOpacity>
        </View>

        {/* Map */}
        <View style={styles.mapContainer}>
          {isLoading ? (
            <View
              style={[
                styles.loadingContainer,
                { backgroundColor: colors[theme].card },
              ]}
            >
              <ActivityIndicator size="large" color={colors[theme].primary} />
              <Text style={[styles.loadingText, { color: colors[theme].text }]}>
                Loading map...
              </Text>
            </View>
          ) : Platform.OS === "web" ? (
            <View
              style={[
                styles.webMapPlaceholder,
                { backgroundColor: colors[theme].card },
              ]}
            >
              <Text style={[styles.webMapText, { color: colors[theme].text }]}>
                Map view is not available on web.
              </Text>
              <Text
                style={[
                  styles.webMapSubtext,
                  { color: colors[theme].inactive },
                ]}
              >
                Please use the mobile app to view the map.
              </Text>
            </View>
          ) : (
            <Animated.View
              style={[
                styles.mapPlaceholder,
                {
                  backgroundColor: colors[theme].border + "50",
                  opacity: mapAnimation,
                },
              ]}
            >
              {/* Fake grid */}
              {Array.from({ length: 10 }).map((_, i) => (
                <View
                  key={`grid-line-${i}`}
                  style={{
                    position: "absolute",
                    top: i * 40,
                    left: 0,
                    right: 0,
                    height: 1,
                    backgroundColor: colors[theme].border,
                  }}
                />
              ))}
              <Text
                style={[
                  styles.mapPlaceholderText,
                  { color: colors[theme].inactive },
                ]}
              >
                Map would display here with nearby restaurants
              </Text>

              {userLocation && (
                <View
                  style={[
                    styles.userLocationMarker,
                    { backgroundColor: colors[theme].primary },
                  ]}
                >
                  <View
                    style={[
                      styles.userLocationDot,
                      { backgroundColor: "#FFFFFF" },
                    ]}
                  />
                </View>
              )}

              {restaurants.slice(0, 5).map((restaurant, index) => (
                <TouchableOpacity
                  key={restaurant.id}
                  style={[
                    styles.restaurantMarker,
                    {
                      backgroundColor: colors[theme].card,
                      top: 100 + index * 50,
                      left: 50 + index * 40,
                    },
                  ]}
                  onPress={() => router.push(`/restaurants/${restaurant.id}`)}
                >
                  <MapPin size={16} color={colors[theme].primary} />
                  <Text
                    style={[
                      styles.restaurantMarkerText,
                      { color: colors[theme].text },
                    ]}
                  >
                    {restaurant.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </Animated.View>
          )}
        </View>

        {/* Filter Modal */}
        <Modal
          visible={isFilterModalVisible}
          animationType="none"
          transparent
          onRequestClose={hideFilterModal}
        >
          <View style={styles.modalOverlay}>
            <Animated.View
              style={[
                styles.modalContent,
                {
                  backgroundColor: colors[theme].background,
                  transform: [{ translateY: modalTranslateY }],
                },
              ]}
            >
              {/* Header */}
              <View style={styles.modalHeader}>
                <Text
                  style={[styles.modalTitle, { color: colors[theme].text }]}
                >
                  Filter
                </Text>
                <TouchableOpacity onPress={hideFilterModal}>
                  <X size={24} color={colors[theme].text} />
                </TouchableOpacity>
              </View>

              <View style={styles.modalBody}>
                <Text
                  style={[
                    styles.filterSectionTitle,
                    { color: colors[theme].text },
                  ]}
                >
                  Cuisine
                </Text>
                <View style={styles.cuisineContainer}>
                  {cuisineTypes.map((cuisine) => (
                    <TouchableOpacity
                      key={cuisine.id}
                      style={[
                        styles.cuisineButton,
                        {
                          backgroundColor: selectedCuisines.includes(cuisine.id)
                            ? colors[theme].primary
                            : "transparent",
                          borderColor: selectedCuisines.includes(cuisine.id)
                            ? colors[theme].primary
                            : colors[theme].border,
                        },
                      ]}
                      onPress={() => toggleCuisineSelection(cuisine.id)}
                    >
                      <Text
                        style={[
                          styles.cuisineText,
                          {
                            color: selectedCuisines.includes(cuisine.id)
                              ? "#FFFFFF"
                              : colors[theme].text,
                          },
                        ]}
                      >
                        {cuisine.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <View style={styles.divider} />

                <Text
                  style={[
                    styles.filterSectionTitle,
                    { color: colors[theme].text },
                  ]}
                >
                  Halal Standard
                </Text>
                <View style={styles.standardsContainer}>
                  {halalStandards.map((standard) => (
                    <TouchableOpacity
                      key={standard.id}
                      style={[
                        styles.standardButton,
                        {
                          borderColor: selectedStandards.includes(standard.id)
                            ? colors[theme].primary
                            : colors[theme].border,
                          backgroundColor: colors[theme].card,
                        },
                      ]}
                      onPress={() => toggleStandardSelection(standard.id)}
                    >
                      <Text style={styles.standardIcon}>{standard.icon}</Text>
                      <Text
                        style={[
                          styles.standardText,
                          {
                            color: selectedStandards.includes(standard.id)
                              ? colors[theme].primary
                              : colors[theme].text,
                          },
                        ]}
                      >
                        {standard.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <View style={styles.modalActions}>
                  <TouchableOpacity
                    style={[
                      styles.resetButton,
                      { borderColor: colors[theme].border },
                    ]}
                    onPress={() => {
                      setSelectedCuisines([]);
                      setSelectedStandards([]);
                    }}
                  >
                    <Text
                      style={[
                        styles.resetButtonText,
                        { color: colors[theme].text },
                      ]}
                    >
                      Reset
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.applyButton,
                      { backgroundColor: colors[theme].primary },
                    ]}
                    onPress={hideFilterModal}
                  >
                    <Text style={styles.applyButtonText}>Apply</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Animated.View>
          </View>
        </Modal>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  customHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 48,
  },
  backButton: { padding: 8 },
  headerTitle: { fontSize: 18, fontWeight: "bold" },
  searchFilterContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    zIndex: 10,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 12,
    height: 48,
    marginRight: 12,
  },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 16 },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  mapContainer: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 16, fontSize: 16 },
  webMapPlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  webMapText: { fontSize: 18, fontWeight: "bold", marginBottom: 8 },
  webMapSubtext: { fontSize: 14 },
  mapPlaceholder: { flex: 1, position: "relative" },
  mapPlaceholderText: {
    position: "absolute",
    top: 20,
    left: 0,
    right: 0,
    textAlign: "center",
    fontSize: 14,
  },
  userLocationMarker: {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: 24,
    height: 24,
    borderRadius: 12,
    marginLeft: -12,
    marginTop: -12,
    justifyContent: "center",
    alignItems: "center",
  },
  userLocationDot: { width: 10, height: 10, borderRadius: 5 },
  restaurantMarker: {
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  restaurantMarkerText: { fontSize: 12, fontWeight: "500", marginLeft: 4 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
    paddingBottom: 30,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
  },
  modalTitle: { fontSize: 20, fontWeight: "bold" },
  modalBody: { flex: 1 },
  filterSectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 12,
  },
  cuisineContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  cuisineButton: {
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  cuisineText: { fontSize: 14, fontWeight: "500" },
  divider: { height: 1, backgroundColor: "#E0E0E0", marginVertical: 16 },
  standardsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  standardButton: {
    width: "30%",
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    marginBottom: 12,
  },
  standardIcon: { fontSize: 24, marginBottom: 8 },
  standardText: { fontSize: 12, textAlign: "center" },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    marginBottom: 24,
  },
  resetButton: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginRight: 8,
  },
  resetButtonText: { fontSize: 16, fontWeight: "600" },
  applyButton: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginLeft: 8,
  },
  applyButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "600" },
});
