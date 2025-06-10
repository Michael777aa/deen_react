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
  Dimensions
} from 'react-native';
import { router, Stack } from 'expo-router';
import { useSettingsStore } from '@/store/useSettingsStore';
import { colors } from '@/constants/colors';
import { Card } from '@/components/Card';
import { useProductStore } from '@/store/useProductStore';
import { Product } from '@/types';
import { Scan, Search, ChevronRight } from 'lucide-react-native';

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

export default function ProductsScreen() {
  const { darkMode } = useSettingsStore();
  const theme = darkMode ? 'dark' : 'light';
  const { scannedProducts } = useProductStore();
  const [activeCarouselIndex, setActiveCarouselIndex] = useState(0);
  const carouselRef = useRef(null);

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
          router.push('/scanner/discover');
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
          title: "Products",
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
          data={scannedProducts.length > 0 ? scannedProducts : useProductStore.getState().scannedProducts}
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
});