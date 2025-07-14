import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  FlatList,
  Image,
  TextInput,
  Dimensions,
  Animated
} from 'react-native';
import { router, Stack } from 'expo-router';
import { useSettingsStore } from '@/store/useSettingsStore';
import { colors } from '@/constants/colors';
import { Card } from '@/components/Card';
import { useProductStore } from '@/store/useProductStore';
import { Product } from '@/types';
import { Search, Scan, ChevronRight, ShoppingBag, Camera, Tag, Filter, Star } from 'lucide-react-native';
import { mockProducts } from '@/mocks/productData';

const { width } = Dimensions.get('window');
const CAROUSEL_ITEM_WIDTH = width * 0.9;
const CATEGORY_ITEM_WIDTH = 100;
const PRODUCT_CARD_WIDTH = width * 0.4;

const categories = [
  { id: '1', name: 'Snacks', icon: '🍿' },
  { id: '2', name: 'Beverages', icon: '🥤' },
  { id: '3', name: 'Ice Cream', icon: '🍦' },
  { id: '4', name: 'Instant Food', icon: '🍜' },
  { id: '5', name: 'Dairy', icon: '🥛' },
  { id: '6', name: 'Confectionery', icon: '🍬' },
  { id: '7', name: 'Frozen Food', icon: '🧊' },
  { id: '8', name: 'Sauces', icon: '🧂' },
];

const carouselItems = [
  {
    id: '1',
    title: 'Scan Products',
    description: 'Check if products are halal certified',
    image: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80',
    action: 'scan'
  },
  {
    id: '2',
    title: 'Discover New Products',
    description: 'Find halal certified products near you',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80',
    action: 'discover'
  },
  {
    id: '3',
    title: 'Report Products',
    description: 'Help our community by reporting products',
    image: 'https://images.unsplash.com/photo-1607083206968-13611e3d76db?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80',
    action: 'report'
  }
];

// Additional mock products for recommended section
const recommendedProducts: Product[] = [
  {
    id: '9',
    barcode: '8801987654321',
    name: 'Organic Coconut Water',
    brand: 'Pure Nature',
    imageUrl: 'https://images.unsplash.com/photo-1536759808958-1a71d5899bb5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
    halalStatus: 'halal',
    certification: 'Global Halal Authority',
    certificationNumber: 'GHA-2023-1234',
    certificationExpiry: '2025-06-30',
    category: 'Beverages',
    ingredients: 'Organic Coconut Water, Vitamin C',
    nutritionalInfo: {
      'Calories': '45 kcal',
      'Protein': '0g',
      'Carbohydrates': '11g',
      'Fat': '0g',
      'Sodium': '25mg',
      'Potassium': '470mg'
    },
    manufacturer: 'Pure Nature Foods Inc.',
    countryOfOrigin: 'Thailand',
    scanDate: '2023-07-10T14:20:00Z'
  },
  {
    id: '10',
    barcode: '8801234987654',
    name: 'Almond Date Energy Bar',
    brand: 'Healthy Bites',
    imageUrl: 'https://images.unsplash.com/photo-1571748982800-fa51082c2224?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
    halalStatus: 'halal',
    certification: 'International Halal Integrity Alliance',
    certificationNumber: 'IHIA-2022-5678',
    certificationExpiry: '2024-12-15',
    category: 'Snacks',
    ingredients: 'Dates, Almonds, Honey, Chia Seeds, Cinnamon',
    nutritionalInfo: {
      'Calories': '180 kcal',
      'Protein': '5g',
      'Carbohydrates': '25g',
      'Fat': '8g',
      'Fiber': '4g'
    },
    manufacturer: 'Healthy Bites Co.',
    countryOfOrigin: 'United Arab Emirates',
    scanDate: '2023-07-12T09:15:00Z'
  },
  {
    id: '11',
    barcode: '8801122334455',
    name: 'Halal Beef Jerky',
    brand: 'Protein Pack',
    imageUrl: 'https://images.unsplash.com/photo-1626082929543-5bfa38eae193?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
    halalStatus: 'halal',
    certification: 'American Halal Foundation',
    certificationNumber: 'AHF-2023-9012',
    certificationExpiry: '2024-08-20',
    category: 'Snacks',
    ingredients: 'Halal Beef, Sea Salt, Black Pepper, Paprika, Natural Smoke Flavor',
    nutritionalInfo: {
      'Calories': '80 kcal',
      'Protein': '16g',
      'Carbohydrates': '3g',
      'Fat': '1.5g',
      'Sodium': '390mg'
    },
    manufacturer: 'Protein Pack Foods',
    countryOfOrigin: 'USA',
    scanDate: '2023-07-15T16:45:00Z'
  },
  {
    id: '12',
    barcode: '8801567890123',
    name: 'Organic Honey',
    brand: 'Nature\'s Gold',
    imageUrl: 'https://images.unsplash.com/photo-1587049352851-8d4e89133924?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
    halalStatus: 'halal',
    certification: 'Malaysia Islamic Development Department (JAKIM)',
    certificationNumber: 'JAKIM-2022-3456',
    certificationExpiry: '2025-01-10',
    category: 'Condiments',
    ingredients: '100% Pure Organic Honey',
    nutritionalInfo: {
      'Calories': '60 kcal',
      'Protein': '0g',
      'Carbohydrates': '17g',
      'Fat': '0g'
    },
    manufacturer: 'Nature\'s Gold Apiaries',
    countryOfOrigin: 'Malaysia',
    scanDate: '2023-07-18T11:30:00Z'
  }
];

export default function ProductsScreen() {
  const { darkMode } = useSettingsStore();
  const theme = darkMode ? 'dark' : 'light';
  const { scannedProducts, addScannedProduct } = useProductStore();
  const [activeCarouselIndex, setActiveCarouselIndex] = useState(0);
  const carouselRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  // Initialize with mock products if empty
  React.useEffect(() => {
    if (scannedProducts.length === 0) {
      mockProducts.forEach(product => {
        addScannedProduct(product);
      });
    }

    // Add recommended products to scanned products
    recommendedProducts.forEach(product => {
      addScannedProduct(product);
    });

    // Fade in animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true
      })
    ]).start();
  }, []);

  const renderHalalStatus = (status: string) => {
    if (status === 'halal') {
      return (
        <View style={[styles.statusBadge, { backgroundColor: colors[theme].success }]}>
          <Text style={styles.statusText}>Halal</Text>
        </View>
      );
    } else if (status === 'haram') {
      return (
        <View style={[styles.statusBadge, { backgroundColor: colors[theme].error }]}>
          <Text style={styles.statusText}>Haram</Text>
        </View>
      );
    } else {
      return (
        <View style={[styles.statusBadge, { backgroundColor: colors[theme].notification }]}>
          <Text style={styles.statusText}>Doubtful</Text>
        </View>
      );
    }
  };

  const renderCarouselItem = ({ item }: { item: typeof carouselItems[0] }) => (
    <TouchableOpacity 
      style={[styles.carouselItem, { backgroundColor: colors[theme].primary }]}
      onPress={() => {
        if (item.action === 'scan') {
          router.push('/scanner/scan');
        } else if (item.action === 'discover') {
          // router.push('/scanner/discover');
        } else if (item.action === 'report') {
          router.push('/product/report');
        }
      }}
    >
      <Image 
        source={{ uri: item.image }} 
        style={styles.carouselImage} 
        resizeMode="cover"
      />
      <View style={styles.carouselOverlay}>
        <Text style={styles.carouselTitle}>{item.title}</Text>
        <Text style={styles.carouselDescription}>{item.description}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderCategoryItem = ({ item }: { item: typeof categories[0] }) => (
    <TouchableOpacity 
      style={[styles.categoryItem, { backgroundColor: colors[theme].card }]}
      onPress={() => router.push(`/scanner/category/${item.id}`)}
    >
      <Text style={styles.categoryIcon}>{item.icon}</Text>
      <Text style={[styles.categoryName, { color: colors[theme].text }]}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderProductItem = ({ item }: { item: Product }) => (
    <TouchableOpacity 
      style={styles.productItem}
      onPress={() => router.push(`/product/${item.id}`)}
    >
      <Card style={styles.productCard}>
        {item.imageUrl ? (
          <Image source={{ uri: item.imageUrl }} style={styles.productImage} />
        ) : (
          <View style={[styles.productImagePlaceholder, { backgroundColor: colors[theme].border }]} />
        )}
        <View style={styles.productInfo}>
          <Text style={[styles.productName, { color: colors[theme].text }]} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={[styles.productBrand, { color: colors[theme].inactive }]} numberOfLines={1}>
            {item.brand}
          </Text>
          {renderHalalStatus(item.halalStatus)}
        </View>
      </Card>
    </TouchableOpacity>
  );

  const onCarouselScroll = (event: any) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = Math.floor(event.nativeEvent.contentOffset.x / slideSize);
    const roundIndex = Math.round(event.nativeEvent.contentOffset.x / slideSize);
    
    if (roundIndex !== activeCarouselIndex) {
      setActiveCarouselIndex(roundIndex);
    }
  };

  return (
    <>
      <Stack.Screen 
        options={{
          title: "Halal Scanner",
          headerRight: () => (
            <TouchableOpacity 
              style={styles.scanButton}
              onPress={() => router.push('/scanner/scan')}
            >
              <Scan size={24} color={colors[theme].text} />
            </TouchableOpacity>
          ),
        }}
      />
      <ScrollView 
        style={[styles.container, { backgroundColor: colors[theme].background }]}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Banner */}
        <Animated.View 
          style={[
            styles.headerBanner,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1534723452862-4c874018d66d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80' }} 
            style={styles.headerImage}
          />
          <View style={styles.headerOverlay}>
            <View style={styles.headerContent}>
              <ShoppingBag size={32} color="#FFFFFF" />
              <Text style={styles.headerTitle}>Halal Product Scanner</Text>
              <Text style={styles.headerSubtitle}>Verify products with confidence</Text>
            </View>
            <TouchableOpacity 
              style={styles.scanNowButton}
              onPress={() => router.push('/scanner/scan')}
            >
              <Camera size={16} color="#FFFFFF" />
              <Text style={styles.scanNowButtonText}>Scan Now</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
        
        {/* Search */}
        <TouchableOpacity 
          style={[styles.searchButton, { backgroundColor: colors[theme].card }]}
          onPress={() => router.push('/scanner/search')}
        >
          <Search size={20} color={colors[theme].inactive} />
          <Text style={[styles.searchText, { color: colors[theme].inactive }]}>
            Search for products...
          </Text>
        </TouchableOpacity>
        
        {/* Categories */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors[theme].text }]}>
            Categories
          </Text>
          <TouchableOpacity onPress={() => router.push('/scanner/categories')}>
            <Text style={[styles.seeAllText, { color: colors[theme].primary }]}>
              See All
            </Text>
          </TouchableOpacity>
        </View>
        
        <FlatList
          data={categories}
          renderItem={renderCategoryItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        />
        
        {/* Carousel */}
        <View style={styles.carouselContainer}>
          <FlatList
            ref={carouselRef}
            data={carouselItems}
            renderItem={renderCarouselItem}
            keyExtractor={(item) => item.id}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={onCarouselScroll}
            snapToInterval={CAROUSEL_ITEM_WIDTH}
            snapToAlignment="center"
            decelerationRate="fast"
            contentContainerStyle={styles.carouselList}
          />
          
          <View style={styles.paginationContainer}>
            {carouselItems.map((_, index) => (
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
        
        {/* Recommended Products */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors[theme].text }]}>
            Recommended Products
          </Text>
          <TouchableOpacity onPress={() => router.push('/scanner/recommended')}>
            <Text style={[styles.seeAllText, { color: colors[theme].primary }]}>
              See All
            </Text>
          </TouchableOpacity>
        </View>
        
        <FlatList
          data={recommendedProducts}
          renderItem={renderProductItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.productsList}
        />
        
        {/* Recently Scanned */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors[theme].text }]}>
            Recently Scanned
          </Text>
          <TouchableOpacity onPress={() => router.push('/scanner/history')}>
            <Text style={[styles.seeAllText, { color: colors[theme].primary }]}>
              See All
            </Text>
          </TouchableOpacity>
        </View>
        
        <FlatList
          data={scannedProducts.slice(0, 5)}
          renderItem={renderProductItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.productsList}
          ListEmptyComponent={
            <View style={styles.emptyListContainer}>
              <Text style={[styles.emptyListText, { color: colors[theme].inactive }]}>
                No products scanned yet
              </Text>
            </View>
          }
        />

        {/* Popular Halal Brands */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors[theme].text }]}>
            Popular Halal Brands
          </Text>
          <TouchableOpacity>
            <Text style={[styles.seeAllText, { color: colors[theme].primary }]}>
              See All
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.brandsList}
        >
          {['Saffron Road', 'Al Safa', 'Crescent Foods', 'Midamar', 'Halal Guys'].map((brand, index) => (
            <TouchableOpacity 
              key={index}
              style={[styles.brandItem, { backgroundColor: colors[theme].card }]}
            >
              <View style={[styles.brandIcon, { backgroundColor: colors[theme].primary + '20' }]}>
                <Tag size={24} color={colors[theme].primary} />
              </View>
              <Text style={[styles.brandName, { color: colors[theme].text }]}>{brand}</Text>
              <View style={styles.brandRating}>
                <Star size={12} color="#FFD700" fill="#FFD700" />
                <Text style={[styles.brandRatingText, { color: colors[theme].inactive }]}>
                  {(4 + Math.random()).toFixed(1)}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Halal Certification Guide */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors[theme].text }]}>
            Halal Certification Guide
          </Text>
        </View>

        <TouchableOpacity 
          style={[styles.guideCard, { backgroundColor: colors[theme].card }]}
          onPress={() => router.push('/scanner/info')}
        >
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1588964895597-cfccd6e2dbf9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80' }}
            style={styles.guideImage}
          />
          <View style={styles.guideContent}>
            <Text style={[styles.guideTitle, { color: colors[theme].text }]}>
              Understanding Halal Certifications
            </Text>
            <Text style={[styles.guideDescription, { color: colors[theme].inactive }]}>
              Learn how to identify authentic halal certifications and what they mean
            </Text>
            <View style={styles.guideButton}>
              <Text style={[styles.guideButtonText, { color: colors[theme].primary }]}>
                Read Guide
              </Text>
              <ChevronRight size={16} color={colors[theme].primary} />
            </View>
          </View>
        </TouchableOpacity>
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
  scanButton: {
    marginRight: 16,
  },
  headerBanner: {
    height: 200,
    marginBottom: 20,
  },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  headerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  headerContent: {
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 8,
    textAlign: 'center',
  },
  headerSubtitle: {
    color: '#FFFFFF',
    fontSize: 16,
    opacity: 0.9,
    textAlign: 'center',
  },
  scanNowButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(76, 175, 80, 0.9)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 24,
  },
  scanNowButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  carouselContainer: {
    marginBottom: 20,
  },
  carouselList: {
    paddingHorizontal: 10,
  },
  carouselItem: {
    width: CAROUSEL_ITEM_WIDTH,
    height: 180,
    marginHorizontal: 5,
    borderRadius: 12,
    overflow: 'hidden',
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
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  carouselTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  carouselDescription: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  paginationDot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  searchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 20,
  },
  searchText: {
    marginLeft: 8,
    fontSize: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
  },
  categoriesList: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  categoryItem: {
    width: CATEGORY_ITEM_WIDTH,
    height: 100,
    borderRadius: 12,
    marginRight: 12,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  productsList: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  productItem: {
    width: PRODUCT_CARD_WIDTH,
    marginRight: 12,
  },
  productCard: {
    padding: 0,
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  productImagePlaceholder: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  productBrand: {
    fontSize: 12,
    marginBottom: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  emptyListContainer: {
    width: PRODUCT_CARD_WIDTH * 2,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyListText: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  brandsList: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  brandItem: {
    width: 120,
    height: 120,
    borderRadius: 12,
    marginRight: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  brandName: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  brandRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandRatingText: {
    fontSize: 12,
    marginLeft: 4,
  },
  guideCard: {
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
  },
  guideImage: {
    width: '100%',
    height: 120,
  },
  guideContent: {
    padding: 16,
  },
  guideTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  guideDescription: {
    fontSize: 14,
    marginBottom: 12,
  },
  guideButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  guideButtonText: {
    fontSize: 14,
    fontWeight: '600',
    marginRight: 4,
  },
});