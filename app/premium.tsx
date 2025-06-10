import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Image
} from 'react-native';
import { Stack } from 'expo-router';
import { colors } from '@/constants/colors';
import { useSettingsStore } from '@/store/useSettingsStore';
import { Card } from '@/components/Card';
import { Check } from 'lucide-react-native';

export default function PremiumScreen() {
  const { darkMode } = useSettingsStore();
  const theme = darkMode ? 'dark' : 'light';

  return (
    <>
      <Stack.Screen options={{ title: "Premium" }} />
      <ScrollView 
        style={[styles.container, { backgroundColor: colors[theme].background }]}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.headerContainer}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1564121211835-e88c852648ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80' }}
            style={styles.headerImage}
            resizeMode="cover"
          />
          <View style={styles.headerOverlay}>
            <Text style={styles.headerTitle}>
              Upgrade to Premium
            </Text>
            <Text style={styles.headerSubtitle}>
              Unlock the full Islamic experience
            </Text>
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: colors[theme].text }]}>
          Premium Features
        </Text>
        
        <Card>
          <View style={styles.featureItem}>
            <Check size={20} color={colors[theme].primary} />
            <Text style={[styles.featureText, { color: colors[theme].text }]}>
              Unlimited AI Assistant questions
            </Text>
          </View>
          
          <View style={styles.featureItem}>
            <Check size={20} color={colors[theme].primary} />
            <Text style={[styles.featureText, { color: colors[theme].text }]}>
              Advanced Quran tafsir and translations
            </Text>
          </View>
          
          <View style={styles.featureItem}>
            <Check size={20} color={colors[theme].primary} />
            <Text style={[styles.featureText, { color: colors[theme].text }]}>
              Exclusive dua collections
            </Text>
          </View>
          
          <View style={styles.featureItem}>
            <Check size={20} color={colors[theme].primary} />
            <Text style={[styles.featureText, { color: colors[theme].text }]}>
              Ad-free experience
            </Text>
          </View>
          
          <View style={styles.featureItem}>
            <Check size={20} color={colors[theme].primary} />
            <Text style={[styles.featureText, { color: colors[theme].text }]}>
              Detailed analytics and insights
            </Text>
          </View>
          
          <View style={styles.featureItem}>
            <Check size={20} color={colors[theme].primary} />
            <Text style={[styles.featureText, { color: colors[theme].text }]}>
              Access to live Islamic lectures
            </Text>
          </View>
        </Card>

        <Text style={[styles.sectionTitle, { color: colors[theme].text }]}>
          Choose Your Plan
        </Text>
        
        <TouchableOpacity>
          <Card style={[
            styles.planCard, 
            { borderColor: colors[theme].primary, borderWidth: 2 }
          ]}>
            <View style={styles.planHeader}>
              <Text style={[styles.planTitle, { color: colors[theme].text }]}>
                Annual
              </Text>
              <View style={[styles.saveBadge, { backgroundColor: colors[theme].primary }]}>
                <Text style={styles.saveText}>SAVE 40%</Text>
              </View>
            </View>
            
            <Text style={[styles.planPrice, { color: colors[theme].primary }]}>
              $59.99
            </Text>
            <Text style={[styles.planPeriod, { color: colors[theme].inactive }]}>
              per year
            </Text>
            <Text style={[styles.planDescription, { color: colors[theme].text }]}>
              Less than $5 per month
            </Text>
          </Card>
        </TouchableOpacity>
        
        <TouchableOpacity>
          <Card style={styles.planCard}>
            <Text style={[styles.planTitle, { color: colors[theme].text }]}>
              Monthly
            </Text>
            <Text style={[styles.planPrice, { color: colors[theme].primary }]}>
              $9.99
            </Text>
            <Text style={[styles.planPeriod, { color: colors[theme].inactive }]}>
              per month
            </Text>
            <Text style={[styles.planDescription, { color: colors[theme].text }]}>
              Billed monthly
            </Text>
          </Card>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[
            styles.subscribeButton, 
            { backgroundColor: colors[theme].primary }
          ]}
        >
          <Text style={styles.subscribeButtonText}>
            Subscribe Now
          </Text>
        </TouchableOpacity>

        <Text style={[styles.termsText, { color: colors[theme].inactive }]}>
          By subscribing, you agree to our Terms of Service and Privacy Policy. 
          Subscriptions automatically renew unless auto-renew is turned off at 
          least 24 hours before the end of the current period.
        </Text>
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
    paddingBottom: 40,
  },
  headerContainer: {
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 24,
  },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  headerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  headerSubtitle: {
    color: '#FFFFFF',
    fontSize: 16,
    marginTop: 8,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureText: {
    fontSize: 16,
    marginLeft: 12,
  },
  planCard: {
    marginBottom: 16,
    padding: 20,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  planTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  saveBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  saveText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  planPrice: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  planPeriod: {
    fontSize: 14,
    marginBottom: 8,
  },
  planDescription: {
    fontSize: 14,
  },
  subscribeButton: {
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  subscribeButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  termsText: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
});