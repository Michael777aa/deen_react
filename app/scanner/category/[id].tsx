import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Image,
  ActivityIndicator,
  TextInput
} from 'react-native';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { useSettingsStore } from '@/store/useSettingsStore';
import { colors } from '@/constants/colors';
import { Card } from '@/components/Card';
import { useProductStore } from '@/store/useProductStore';
import { ArrowLeft, Scan, Search, Filter } from 'lucide-react-native';

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

export default function CategoryScreen() {
  const { id } = useLocalSearchParams();
  const categoryId = id as string;
  const { darkMode } = useSettingsStore();
  const theme = darkMode ? 'dark' : 'light';
  const { scannedProducts } = useProductStore();
  
  const [isLoading, setIsLoading] = useState(true);
  const [categoryProducts, setCategoryProducts] = useState<any[]>([]);
  const [category, setCategory] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const selectedCategory = categories.find(c => c.id === categoryId);
    setCategory(selectedCategory);
    
    // Simulate loading products
    setTimeout(() => {
      // Generate mock products for this category
      const mockProducts = Array(10).fill(0).map((_, index) => ({
        id: `${categoryId}-${index}`,
        name: `${selectedCategory?.name} Product ${index + 1}`,
        brand: `Brand ${index % 3 + 1}`,
        imageUrl: index % 2 === 0 
          ? 'https://images.unsplash.com/photo-1553456558-aff63285bdd1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80'
          : 'https://images.unsplash.com/photo-1581006852262-e4307cf6283a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
        halalStatus: ['halal', 'doubtful', 'haram'][Math.floor(Math.random() * 3)]
      }));
      
      setCategoryProducts(mockProducts);
      setIsLoading(false);
    }, 1000);
  }, [categoryId]);

  const filteredProducts = categoryProducts.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.brand.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  const renderProductItem = ({ item }: { item: any }) => (
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

  const goBack = () => {
    router.back();
  };

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: category?.name || "Category",
          headerLeft: () => (
            <TouchableOpacity onPress={goBack} style={styles.backButton}>
              <ArrowLeft size={24} color={colors[theme].text} />
            </TouchableOpacity>
          ),
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
      <View style={[styles.container, { backgroundColor: colors[theme].background }]}>
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
              placeholder={`Search in ${category?.name || 'Category'}...`}
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
          >
            <Filter size={20} color={colors[theme].text} />
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors[theme].primary} />
            <Text style={[styles.loadingText, { color: colors[theme].text }]}>
              Loading products...
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredProducts}
            renderItem={renderProductItem}
            keyExtractor={(item) => item.id}
            numColumns={2}
            contentContainerStyle={styles.productsList}
            columnWrapperStyle={styles.productsRow}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={[styles.emptyText, { color: colors[theme].text }]}>
                  No products found
                </Text>
                <Text style={[styles.emptySubtext, { color: colors[theme].inactive }]}>
                  Try a different search term
                </Text>
              </View>
            }
          />
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    marginLeft: 8,
  },
  scanButton: {
    marginRight: 16,
  },
  searchFilterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 48,
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  productsList: {
    padding: 16,
  },
  productsRow: {
    justifyContent: 'space-between',
  },
  productItem: {
    width: '48%',
    marginBottom: 16,
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
});