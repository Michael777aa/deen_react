import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity,
  Image
} from 'react-native';
import { useSettingsStore } from '@/store/useSettingsStore';
import { colors } from '@/constants/colors';
import { useProductStore } from '@/store/useProductStore';
import { Product } from '@/types';
import { router, Stack } from 'expo-router';
import { Card } from '@/components/Card';
import { Check, X, AlertTriangle, Trash2 } from 'lucide-react-native';

export default function HistoryScreen() {
  const { darkMode } = useSettingsStore();
  const theme = darkMode ? 'dark' : 'light';
  const { scannedProducts, clearHistory } = useProductStore();

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
      style={styles.historyItem}
    >
      <Card style={styles.historyCard}>
        <View style={styles.historyContent}>
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
          <Text style={[styles.scanDate, { color: colors[theme].inactive }]}>
            {new Date(item.scanDate).toLocaleDateString()}
          </Text>
        </View>
      </Card>
    </TouchableOpacity>
  );

  return (
    <>
      <Stack.Screen 
        options={{
          title: "Scan History",
        }}
      />
      <View style={[styles.container, { backgroundColor: colors[theme].background }]}>
        {scannedProducts.length > 0 ? (
          <>
            <FlatList
              data={scannedProducts}
              renderItem={renderProductItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.historyList}
            />
            
            <TouchableOpacity 
              style={[styles.clearButton, { backgroundColor: colors[theme].error }]}
              onPress={clearHistory}
            >
              <Trash2 size={20} color="#FFFFFF" />
              <Text style={styles.clearButtonText}>Clear History</Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.emptyHistory}>
            <Text style={[styles.emptyHistoryText, { color: colors[theme].text }]}>
              No scan history yet
            </Text>
            <Text style={[styles.emptyHistorySubtext, { color: colors[theme].inactive }]}>
              Products you scan will appear here
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
    padding: 16,
  },
  historyList: {
    paddingBottom: 80,
  },
  historyItem: {
    marginBottom: 8,
  },
  historyCard: {
    padding: 12,
  },
  historyContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  productImagePlaceholder: {
    width: 60,
    height: 60,
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
    marginBottom: 4,
  },
  scanDate: {
    fontSize: 12,
    marginLeft: 8,
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
  emptyHistory: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyHistoryText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptyHistorySubtext: {
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
  clearButton: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  clearButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});