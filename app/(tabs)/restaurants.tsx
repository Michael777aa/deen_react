import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  FlatList,
  Image,
  TextInput,
  Modal,
  Dimensions,
  Animated
} from 'react-native';
import { router, Stack } from 'expo-router';
import { useSettingsStore } from '@/store/useSettingsStore';
import { colors } from '@/constants/colors';
import { Card } from '@/components/Card';
import { useRestaurantStore } from '@/store/useRestaurantStore';
import { 
  Search, 
  MapPin, 
  Filter, 
  Star, 
  X, 
  ChevronRight,
  Navigation
} from 'lucide-react-native';

const { width } = Dimensions.get('window');
const CAROUSEL_ITEM_WIDTH = width * 0.7;

const cuisineTypes = [
  { id: '1', name: 'Indonesian' },
  { id: '2', name: 'Korean' },
  { id: '3', name: 'Turkish' },
  { id: '4', name: 'Japanese' },
  { id: '5', name: 'Indian' },
  { id: '6', name: 'Western' },
  { id: '7', name: 'Others' },
];

const halalStandards = [
  { id: '1', name: 'Muslim Certified', icon: '🕌' },
  { id: '2', name: 'Self Certified', icon: '✓' },
  { id: '3', name: 'Seafood', icon: '🐟' },
  { id: '4', name: 'Veggie', icon: '🥗' },
  { id: '5', name: 'Halal Meat', icon: '🥩' },
  { id: '6', name: 'Salam', icon: '☪️' },
];

export default function RestaurantsScreen() {
  const { darkMode } = useSettingsStore();
  const theme = darkMode ? 'dark' : 'light';
  const { restaurants } = useRestaurantStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [selectedStandards, setSelectedStandards] = useState<string[]>([]);
  const [activeCarouselIndex, setActiveCarouselIndex] = useState(0);
  const carouselRef = useRef(null);
  const modalAnimation = useRef(new Animated.Value(0)).current;

  const filteredRestaurants = restaurants.filter(restaurant => 
    restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    restaurant.cuisine.toLowerCase().includes(searchQuery.toLowerCase()) ||
    restaurant.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderCarouselItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.carouselItem}
      onPress={() => router.push(`/restaurants/${item.id}`)}
    >
      <Image source={{ uri: item.imageUrl }} style={styles.carouselImage} />
      <View style={styles.carouselOverlay}>
        <Text style={styles.carouselTitle} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.carouselSubtitle} numberOfLines={1}>{item.cuisine}</Text>
        <View style={styles.carouselMeta}>
          <MapPin size={12} color="#FFFFFF" />
          <Text style={styles.carouselAddress} numberOfLines={1}>{item.address}</Text>
        </View>
        <View style={styles.carouselRating}>
          <Star size={12} color="#FFD700" fill="#FFD700" />
          <Text style={styles.carouselRatingText}>{item.rating}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const toggleCuisineSelection = (cuisineId: string) => {
    if (selectedCuisines.includes(cuisineId)) {
      setSelectedCuisines(selectedCuisines.filter(id => id !== cuisineId));
    } else {
      setSelectedCuisines([...selectedCuisines, cuisineId]);
    }
  };

  const toggleStandardSelection = (standardId: string) => {
    if (selectedStandards.includes(standardId)) {
      setSelectedStandards(selectedStandards.filter(id => id !== standardId));
    } else {
      setSelectedStandards([...selectedStandards, standardId]);
    }
  };

  const onCarouselScroll = (event: any) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = Math.floor(event.nativeEvent.contentOffset.x / slideSize);
    const roundIndex = Math.round(event.nativeEvent.contentOffset.x / slideSize);
    
    if (roundIndex !== activeCarouselIndex) {
      setActiveCarouselIndex(roundIndex);
    }
  };

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
    }).start(() => {
      setIsFilterModalVisible(false);
    });
  };

  const modalTranslateY = modalAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [600, 0],
  });

  return (
    <>
      <Stack.Screen 
        options={{
          title: "Restaurants",
          headerRight: () => (
            <View style={styles.headerButtons}>
              <TouchableOpacity 
                style={[styles.headerButton, { backgroundColor: colors[theme].primary }]}
                onPress={() => router.push('/restaurants/nearby')}
              >
                <Navigation size={20} color="#FFFFFF" />
                <Text style={styles.headerButtonText}>Map</Text>
              </TouchableOpacity>
            </View>
          ),
        }}
      />
      <ScrollView 
        style={[styles.container, { backgroundColor: colors[theme].background }]}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Featured Restaurants Carousel */}
        <View style={styles.carouselContainer}>
          <Text style={[styles.sectionTitle, { color: colors[theme].text }]}>
            Featured Restaurants
          </Text>
          <FlatList
            ref={carouselRef}
            data={restaurants.slice(0, 5)}
            renderItem={renderCarouselItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={CAROUSEL_ITEM_WIDTH}
            snapToAlignment="center"
            decelerationRate="fast"
            contentContainerStyle={styles.carouselList}
            onScroll={onCarouselScroll}
          />
          
          <View style={styles.paginationContainer}>
            {restaurants.slice(0, 5).map((_, index) => (
              <View
                key={index}
                style={[
                  styles.paginationDot,
                  { 
                    backgroundColor: index === activeCarouselIndex 
                      ? colors[theme].primary 
                      : colors[theme].inactive + '50',
                    width: index === activeCarouselIndex ? 20 : 8
                  }
                ]}
              />
            ))}
          </View>
        </View>
        
        {/* Search and Filter */}
        <View style={styles.searchFilterContainer}>
          <View style={[
            styles.searchContainer, 
            { 
              backgroundColor: colors[theme].card,
              borderColor: colors[theme].border
            }
          ]}>
            <Search size={20} color={colors[theme].inactive} />
            <TextInput
              style={[styles.searchInput, { color: colors[theme].text }]}
              placeholder="Search restaurants..."
              placeholderTextColor={colors[theme].inactive}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          
          <TouchableOpacity 
            style={[
              styles.filterButton, 
              { backgroundColor: colors[theme].card }
            ]}
            onPress={showFilterModal}
          >
            <Filter size={20} color={colors[theme].text} />
          </TouchableOpacity>
        </View>
        
        {/* Quick Filters */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.quickFiltersContainer}
          contentContainerStyle={styles.quickFiltersContent}
        >
          {cuisineTypes.map(cuisine => (
            <TouchableOpacity 
              key={cuisine.id}
              style={[
                styles.quickFilterButton,
                { 
                  backgroundColor: selectedCuisines.includes(cuisine.id) 
                    ? colors[theme].primary 
                    : colors[theme].card,
                }
              ]}
              onPress={() => toggleCuisineSelection(cuisine.id)}
            >
              <Text 
                style={[
                  styles.quickFilterText,
                  { 
                    color: selectedCuisines.includes(cuisine.id)
                      ? '#FFFFFF'
                      : colors[theme].text
                  }
                ]}
              >
                {cuisine.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        
        {/* Restaurant List */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors[theme].text }]}>
            All Restaurants
          </Text>
          <Text style={[styles.restaurantCount, { color: colors[theme].inactive }]}>
            {filteredRestaurants.length} found
          </Text>
        </View>
        
        {filteredRestaurants.map(restaurant => (
          <TouchableOpacity 
            key={restaurant.id}
            style={styles.restaurantItem}
            onPress={() => router.push(`/restaurants/${restaurant.id}`)}
          >
            <Card style={styles.restaurantCard}>
              <View style={styles.restaurantCardContent}>
                <Image source={{ uri: restaurant.imageUrl }} style={styles.restaurantImage} />
                <View style={styles.restaurantInfo}>
                  <View style={styles.restaurantHeader}>
                    <Text style={[styles.restaurantName, { color: colors[theme].text }]} numberOfLines={1}>
                      {restaurant.name}
                    </Text>
                    <View style={styles.ratingContainer}>
                      <Star size={14} color="#FFD700" fill="#FFD700" />
                      <Text style={[styles.ratingText, { color: colors[theme].text }]}>
                        {restaurant.rating}
                      </Text>
                    </View>
                  </View>
                  <Text style={[styles.restaurantCuisine, { color: colors[theme].inactive }]} numberOfLines={1}>
                    {restaurant.cuisine}
                  </Text>
                  <Text style={[styles.restaurantAddress, { color: colors[theme].inactive }]} numberOfLines={2}>
                    {restaurant.address}
                  </Text>
                  <View style={styles.restaurantMeta}>
                    <View style={[
                      styles.certificationBadge, 
                      { backgroundColor: colors[theme].primary + '20' }
                    ]}>
                      <Text style={[styles.certificationText, { color: colors[theme].primary }]}>
                        {restaurant.certification}
                      </Text>
                    </View>
                    <Text style={[styles.distanceText, { color: colors[theme].inactive }]}>
                      {restaurant.distance}
                    </Text>
                  </View>
                </View>
                <ChevronRight size={20} color={colors[theme].inactive} />
              </View>
            </Card>
          </TouchableOpacity>
        ))}
        
        {/* Filter Modal */}
        <Modal
          visible={isFilterModalVisible}
          animationType="none"
          transparent={true}
          onRequestClose={hideFilterModal}
        >
          <View style={styles.modalOverlay}>
            <Animated.View 
              style={[
                styles.modalContent, 
                { 
                  backgroundColor: colors[theme].background,
                  transform: [{ translateY: modalTranslateY }]
                }
              ]}
            >
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, { color: colors[theme].text }]}>
                  Filter Restaurants
                </Text>
                <TouchableOpacity onPress={hideFilterModal}>
                  <X size={24} color={colors[theme].text} />
                </TouchableOpacity>
              </View>
              
              <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={[styles.filterSectionTitle, { color: colors[theme].text }]}>
                  Cuisine Type
                </Text>
                
                <View style={styles.cuisineContainer}>
                  {cuisineTypes.map(cuisine => (
                    <TouchableOpacity 
                      key={cuisine.id}
                      style={[
                        styles.cuisineButton,
                        { 
                          backgroundColor: selectedCuisines.includes(cuisine.id) 
                            ? colors[theme].primary 
                            : 'transparent',
                          borderColor: selectedCuisines.includes(cuisine.id)
                            ? colors[theme].primary
                            : colors[theme].border
                        }
                      ]}
                      onPress={() => toggleCuisineSelection(cuisine.id)}
                    >
                      <Text 
                        style={[
                          styles.cuisineText,
                          { 
                            color: selectedCuisines.includes(cuisine.id)
                              ? '#FFFFFF'
                              : colors[theme].text
                          }
                        ]}
                      >
                        {cuisine.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                
                <View style={[styles.divider, { backgroundColor: colors[theme].border }]} />
                
                <Text style={[styles.filterSectionTitle, { color: colors[theme].text }]}>
                  Halal Certification
                </Text>
                
                <View style={styles.standardsContainer}>
                  {halalStandards.map(standard => (
                    <TouchableOpacity 
                      key={standard.id}
                      style={[
                        styles.standardButton,
                        { 
                          borderColor: selectedStandards.includes(standard.id)
                            ? colors[theme].primary
                            : colors[theme].border,
                          backgroundColor: colors[theme].card
                        }
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
                              : colors[theme].text
                          }
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
                      { borderColor: colors[theme].border }
                    ]}
                    onPress={() => {
                      setSelectedCuisines([]);
                      setSelectedStandards([]);
                    }}
                  >
                    <Text style={[styles.resetButtonText, { color: colors[theme].text }]}>
                      Reset
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[
                      styles.applyButton,
                      { backgroundColor: colors[theme].primary }
                    ]}
                    onPress={hideFilterModal}
                  >
                    <Text style={styles.applyButtonText}>
                      Apply Filters
                    </Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </Animated.View>
          </View>
        </Modal>
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
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  headerButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  carouselContainer: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  carouselList: {
    paddingHorizontal: 16,
  },
  carouselItem: {
    width: CAROUSEL_ITEM_WIDTH,
    height: 200,
    marginRight: 12,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  carouselImage: {
    width: '100%',
    height: '100%',
  },
  carouselOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  carouselTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  carouselSubtitle: {
    color: '#FFFFFF',
    fontSize: 14,
    marginBottom: 8,
    opacity: 0.9,
  },
  carouselMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  carouselAddress: {
    color: '#FFFFFF',
    fontSize: 12,
    marginLeft: 4,
    opacity: 0.8,
  },
  carouselRating: {
    position: 'absolute',
    top: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  carouselRatingText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  paginationDot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  searchFilterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 52,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
  },
  filterButton: {
    width: 52,
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  quickFiltersContainer: {
    marginBottom: 16,
  },
  quickFiltersContent: {
    paddingHorizontal: 16,
  },
  quickFilterButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  quickFilterText: {
    fontSize: 14,
    fontWeight: '500',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  restaurantCount: {
    fontSize: 14,
  },
  restaurantItem: {
    marginHorizontal: 16,
    marginBottom: 12,
  },
  restaurantCard: {
    padding: 0,
    overflow: 'hidden',
  },
  restaurantCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  restaurantImage: {
    width: 100,
    height: 100,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  restaurantInfo: {
    flex: 1,
    padding: 16,
  },
  restaurantHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  restaurantCuisine: {
    fontSize: 14,
    marginBottom: 4,
  },
  restaurantAddress: {
    fontSize: 12,
    marginBottom: 8,
  },
  restaurantMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  certificationBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  certificationText: {
    fontSize: 10,
    fontWeight: '600',
  },
  distanceText: {
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
    paddingBottom: 30,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  filterSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 12,
  },
  cuisineContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  cuisineButton: {
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  cuisineText: {
    fontSize: 14,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    marginVertical: 16,
  },
  standardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  standardButton: {
    width: '30%',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  standardIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  standardText: {
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '500',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    marginBottom: 24,
  },
  resetButton: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginRight: 8,
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  applyButton: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginLeft: 8,
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});