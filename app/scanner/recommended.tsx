import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity,
  Image
} from 'react-native';
import { Stack, router } from 'expo-router';
import { useSettingsStore } from '@/store/useSettingsStore';
import { colors } from '@/constants/colors';
import { Card } from '@/components/Card';
import { mockProducts } from '@/mocks/productData';
import { Product } from '@/types';
import { Check, X, AlertTriangle } from 'lucide-react-native';

// Filter only halal products for recommendations
const recommendedProducts = mockProducts.filter(product => product.halalStatus === 'halal');

export default function RecommendedScreen() {
  const { darkMode } = useSettingsStore();
  const theme = darkMode ? 'dark' : 'light';

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
          <Text style={[styles.productName, { color: colors[theme].text }]} numberOfLines={2}>
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
      </Card>
    </TouchableOpacity>
  );

  return (
    <>
      <Stack.Screen 
        options={{
          title: "Recommended Products",
        }}
      />
      <View style={[styles.container, { backgroundColor: colors[theme].background }]}>
        <FlatList
          data={recommendedProducts}
          renderItem={renderProductItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.productsList}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  productsList: {
    padding: 12,
  },
  productItem: {
    flex: 1,
    margin: 4,
    maxWidth: '50%',
  },
  productCard: {
    padding: 0,
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: 150,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  productImagePlaceholder: {
    width: '100%',
    height: 150,
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
    height: 40,
  },
  productBrand: {
    fontSize: 12,
    marginBottom: 2,
  },
  productCategory: {
    fontSize: 12,
    marginBottom: 8,
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
});