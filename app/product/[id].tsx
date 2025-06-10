import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity 
} from 'react-native';
import { useLocalSearchParams, Stack, router } from 'expo-router';
import { useSettingsStore } from '@/store/useSettingsStore';
import { colors } from '@/constants/colors';
import { useProductStore } from '@/store/useProductStore';
import { Card } from '@/components/Card';
import { Check, X, AlertTriangle, ArrowLeft, Share2 } from 'lucide-react-native';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();
  const { darkMode } = useSettingsStore();
  const theme = darkMode ? 'dark' : 'light';
  const { getProductById } = useProductStore();
  
  const product = getProductById(id as string);
  
  if (!product) {
    return (
      <View style={[styles.container, { backgroundColor: colors[theme].background }]}>
        <Text style={[styles.errorText, { color: colors[theme].text }]}>
          Product not found
        </Text>
        <TouchableOpacity 
          style={[styles.backButton, { backgroundColor: colors[theme].primary }]}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderHalalStatus = () => {
    if (product.halalStatus === 'halal') {
      return (
        <View style={[styles.statusContainer, { backgroundColor: colors[theme].success + '20' }]}>
          <View style={[styles.statusIconContainer, { backgroundColor: colors[theme].success }]}>
            <Check size={24} color="#FFFFFF" />
          </View>
          <View style={styles.statusTextContainer}>
            <Text style={[styles.statusTitle, { color: colors[theme].success }]}>
              Halal Certified
            </Text>
            <Text style={[styles.statusDescription, { color: colors[theme].text }]}>
              This product is certified halal and safe for consumption.
            </Text>
          </View>
        </View>
      );
    } else if (product.halalStatus === 'haram') {
      return (
        <View style={[styles.statusContainer, { backgroundColor: colors[theme].error + '20' }]}>
          <View style={[styles.statusIconContainer, { backgroundColor: colors[theme].error }]}>
            <X size={24} color="#FFFFFF" />
          </View>
          <View style={styles.statusTextContainer}>
            <Text style={[styles.statusTitle, { color: colors[theme].error }]}>
              Not Halal
            </Text>
            <Text style={[styles.statusDescription, { color: colors[theme].text }]}>
              This product contains ingredients that are not permissible.
            </Text>
          </View>
        </View>
      );
    } else {
      return (
        <View style={[styles.statusContainer, { backgroundColor: colors[theme].notification + '20' }]}>
          <View style={[styles.statusIconContainer, { backgroundColor: colors[theme].notification }]}>
            <AlertTriangle size={24} color="#FFFFFF" />
          </View>
          <View style={styles.statusTextContainer}>
            <Text style={[styles.statusTitle, { color: colors[theme].notification }]}>
              Doubtful (Mushbooh)
            </Text>
            <Text style={[styles.statusDescription, { color: colors[theme].text }]}>
              This product has ingredients that are questionable or unclear.
            </Text>
          </View>
        </View>
      );
    }
  };

  return (
    <>
      <Stack.Screen 
        options={{
          title: product.name,
          headerRight: () => (
            <TouchableOpacity style={styles.shareButton}>
              <Share2 size={24} color={colors[theme].text} />
            </TouchableOpacity>
          ),
        }}
      />
      <ScrollView 
        style={[styles.container, { backgroundColor: colors[theme].background }]}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.imageContainer}>
          {product.imageUrl ? (
            <Image 
              source={{ uri: product.imageUrl }} 
              style={styles.productImage} 
              resizeMode="contain"
            />
          ) : (
            <View style={[styles.imagePlaceholder, { backgroundColor: colors[theme].border }]} />
          )}
        </View>
        
        <View style={styles.productHeader}>
          <Text style={[styles.productName, { color: colors[theme].text }]}>
            {product.name}
          </Text>
          <Text style={[styles.productBrand, { color: colors[theme].inactive }]}>
            {product.brand}
          </Text>
          <Text style={[styles.productCategory, { color: colors[theme].inactive }]}>
            Category: {product.category}
          </Text>
        </View>
        
        {renderHalalStatus()}
        
        <Card style={styles.infoCard}>
          <Text style={[styles.infoTitle, { color: colors[theme].text }]}>
            Certification Details
          </Text>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: colors[theme].text }]}>
              Certification Body:
            </Text>
            <Text style={[styles.infoValue, { color: colors[theme].inactive }]}>
              {product.certification || "Not available"}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: colors[theme].text }]}>
              Certification Number:
            </Text>
            <Text style={[styles.infoValue, { color: colors[theme].inactive }]}>
              {product.certificationNumber || "Not available"}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: colors[theme].text }]}>
              Expiry Date:
            </Text>
            <Text style={[styles.infoValue, { color: colors[theme].inactive }]}>
              {product.certificationExpiry || "Not available"}
            </Text>
          </View>
        </Card>
        
        <Card style={styles.infoCard}>
          <Text style={[styles.infoTitle, { color: colors[theme].text }]}>
            Ingredients
          </Text>
          <Text style={[styles.ingredientsText, { color: colors[theme].inactive }]}>
            {product.ingredients || "Ingredients information not available"}
          </Text>
        </Card>
        
        <Card style={styles.infoCard}>
          <Text style={[styles.infoTitle, { color: colors[theme].text }]}>
            Nutritional Information
          </Text>
          {product.nutritionalInfo ? (
            Object.entries(product.nutritionalInfo).map(([key, value]) => (
              <View key={key} style={styles.infoRow}>
                <Text style={[styles.infoLabel, { color: colors[theme].text }]}>
                  {key}:
                </Text>
                <Text style={[styles.infoValue, { color: colors[theme].inactive }]}>
                  {value}
                </Text>
              </View>
            ))
          ) : (
            <Text style={[styles.noDataText, { color: colors[theme].inactive }]}>
              Nutritional information not available
            </Text>
          )}
        </Card>
        
        <Card style={styles.infoCard}>
          <Text style={[styles.infoTitle, { color: colors[theme].text }]}>
            Manufacturer Information
          </Text>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: colors[theme].text }]}>
              Company:
            </Text>
            <Text style={[styles.infoValue, { color: colors[theme].inactive }]}>
              {product.manufacturer || product.brand}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: colors[theme].text }]}>
              Country of Origin:
            </Text>
            <Text style={[styles.infoValue, { color: colors[theme].inactive }]}>
              {product.countryOfOrigin || "Not specified"}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: colors[theme].text }]}>
              Contact:
            </Text>
            <Text style={[styles.infoValue, { color: colors[theme].inactive }]}>
              {product.manufacturerContact || "Not available"}
            </Text>
          </View>
        </Card>
        
        <TouchableOpacity 
          style={[styles.reportButton, { borderColor: colors[theme].border }]}
          onPress={() => router.push('/product/report')}
        >
          <Text style={[styles.reportButtonText, { color: colors[theme].text }]}>
            Report incorrect information
          </Text>
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
    padding: 16,
    paddingBottom: 32,
  },
  errorText: {
    fontSize: 18,
    textAlign: 'center',
    margin: 24,
  },
  backButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 24,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  shareButton: {
    marginRight: 16,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  productImage: {
    width: 200,
    height: 200,
    borderRadius: 8,
  },
  imagePlaceholder: {
    width: 200,
    height: 200,
    borderRadius: 8,
  },
  productHeader: {
    marginBottom: 24,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  productBrand: {
    fontSize: 16,
    marginBottom: 4,
  },
  productCategory: {
    fontSize: 14,
  },
  statusContainer: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  statusIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  statusTextContainer: {
    flex: 1,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statusDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  infoCard: {
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    flex: 2,
    textAlign: 'right',
  },
  ingredientsText: {
    fontSize: 14,
    lineHeight: 20,
  },
  noDataText: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  reportButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
    borderWidth: 1,
  },
  reportButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});