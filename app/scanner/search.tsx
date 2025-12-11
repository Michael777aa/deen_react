import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity,
  Image,
  TextInput
} from 'react-native';
import { Stack, router } from 'expo-router';
import { useSettingsStore } from '@/store/useSettingsStore';
import { colors } from '@/constants/colors';
import { Card } from '@/components/Card';
import { Product } from '@/types';
import { Check, X, AlertTriangle, Search, ArrowLeft } from 'lucide-react-native';
import { mockProducts } from '@/mocks/productData';

export default function SearchScreen() {
  const { darkMode } = useSettingsStore();
  const theme = darkMode ? 'dark' : 'light';
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }

    const query = searchQuery.toLowerCase();
    const results = mockProducts.filter(product => 
      product.name.toLowerCase().includes(query) || 
      product.brand.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query)
    );
    
    setSearchResults(results);
    setHasSearched(true);
  };

  const renderHalalStatus = (status: string) => {
    if (status === 'halal') {
      return (
        <View style={[styles.statusBadge, { backgroundColor: colors[theme].success }]}>
          <Check size={16} color="#FFFFFF" />
          <Text style={styles.statusText}>Halal</Text>
        </View>
      );
    } else if (status === 'haram') {
      return (
        <View style={[styles.statusBadge, { backgroundColor: colors[theme].error }]}>
          <X size={16} color="#FFFFFF" />
          <Text style={styles.statusText}>Haram</Text>
        </View>
      );
    } else {
      return (
        <View style={[styles.statusBadge, { backgroundColor: colors[theme].notification }]}>
          <AlertTriangle size={16} color="#FFFFFF" />
          <Text style={styles.statusText}>Doubtful</Text>
        </View>
      );
    }
  };

  const renderProductItem = ({ item }: { item: Product }) => (
    <TouchableOpacity 
      onPress={() => router.push(`/product/${item.id}`)}
      style={styles.resultItem}
    >
      <Card style={styles.resultCard}>
        <View style={styles.resultContent}>
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
            <Text style={[styles.productCategory, { color: colors[theme].inactive }]} numberOfLines={1}>
              {item.category}
            </Text>
            {renderHalalStatus(item.halalStatus)}
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );

  return (
    <>
      <Stack.Screen 
        options={{
          title: "Search Products",
          headerLeft: () => (
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <ArrowLeft size={24} color={colors[theme].text} />
            </TouchableOpacity>
          ),
        }}
      />
      <View style={[styles.container, { backgroundColor: colors[theme].background }]}>
        <View style={styles.searchContainer}>
          <View style={[styles.searchInputContainer, { backgroundColor: colors[theme].card }]}>
            <Search size={20} color={colors[theme].inactive} />
            <TextInput
              style={[styles.searchInput, { color: colors[theme].text }]}
              placeholder="Search for products..."
              placeholderTextColor={colors[theme].inactive}
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
            />
          </View>
          <TouchableOpacity 
            style={[styles.searchButton, { backgroundColor: colors[theme].primary }]}
            onPress={handleSearch}
          >
            <Text style={styles.searchButtonText}>Search</Text>
          </TouchableOpacity>
        </View>
        
        {hasSearched && (
          <Text style={[styles.resultsCount, { color: colors[theme].text }]}>
            {searchResults.length} results found
          </Text>
        )}
        
        {hasSearched ? (
          <FlatList
            data={searchResults}
            renderItem={renderProductItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.resultsList}
            ListEmptyComponent={
              <View style={styles.emptyResults}>
                <Text style={[styles.emptyResultsText, { color: colors[theme].text }]}>
                  No products found matching "{searchQuery}"
                </Text>
                <Text style={[styles.emptyResultsSubtext, { color: colors[theme].inactive }]}>
                  Try a different search term or scan the product
                </Text>
                <TouchableOpacity 
                  style={[styles.scanButton, { backgroundColor: colors[theme].primary }]}
                  onPress={() => router.push('/scanner/scan')}
                >
                  <Text style={styles.scanButtonText}>Scan a Product</Text>
                </TouchableOpacity>
              </View>
            }
          />
        ) : (
          <View style={styles.initialState}>
            <Text style={[styles.initialStateText, { color: colors[theme].text }]}>
              Search for halal products by name, brand, or category
            </Text>
            <Text style={[styles.initialStateSubtext, { color: colors[theme].inactive }]}>
              You can also scan a product barcode to check its halal status
            </Text>
            <TouchableOpacity 
              style={[styles.scanButton, { backgroundColor: colors[theme].primary }]}
              onPress={() => router.push('/scanner/scan')}
            >
              <Text style={styles.scanButtonText}>Scan a Product</Text>
            </TouchableOpacity>
          </View>
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
    marginLeft: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 8,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
    marginLeft: 8,
    fontSize: 16,
  },
  searchButton: {
    paddingHorizontal: 16,
    justifyContent: 'center',
    borderRadius: 8,
  },
  searchButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  resultsCount: {
    paddingHorizontal: 16,
    marginBottom: 8,
    fontSize: 14,
  },
  resultsList: {
    padding: 16,
    paddingTop: 0,
  },
  resultItem: {
    marginBottom: 8,
  },
  resultCard: {
    padding: 12,
  },
  resultContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
  },
  productImagePlaceholder: {
    width: 70,
    height: 70,
    borderRadius: 8,
  },
  productInfo: {
    flex: 1,
    marginLeft: 12,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
  },
  productBrand: {
    fontSize: 14,
    marginBottom: 2,
  },
  productCategory: {
    fontSize: 12,
    marginBottom: 6,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    gap: 4,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyResults: {
    padding: 24,
    alignItems: 'center',
  },
  emptyResultsText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptyResultsSubtext: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
  },
  initialState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  initialStateText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  initialStateSubtext: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
  },
  scanButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  scanButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});