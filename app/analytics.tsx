import React, { useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  ActivityIndicator 
} from 'react-native';
import { Stack } from 'expo-router';
import { useAnalyticsStore } from '@/store/useAnalyticsStore';
import { colors } from '@/constants/colors';
import { useSettingsStore } from '@/store/useSettingsStore';
import { Card } from '@/components/Card';
import { BarChart, LineChart, ProgressChart } from '@/components/AnalyticsChart';

export default function AnalyticsScreen() {
  const { data, isLoading, error, fetchAnalytics } = useAnalyticsStore();
  const { darkMode } = useSettingsStore();
  const theme = darkMode ? 'dark' : 'light';

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (isLoading && !data) {
    return (
      <View style={[
        styles.loadingContainer, 
        { backgroundColor: colors[theme].background }
      ]}>
        <ActivityIndicator size="large" color={colors[theme].primary} />
        <Text style={[styles.loadingText, { color: colors[theme].text }]}>
          Loading analytics...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[
        styles.errorContainer, 
        { backgroundColor: colors[theme].background }
      ]}>
        <Text style={[styles.errorText, { color: colors[theme].error }]}>
          {error}
        </Text>
      </View>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <>
      <Stack.Screen options={{ title: "Analytics" }} />
      <ScrollView 
        style={[styles.container, { backgroundColor: colors[theme].background }]}
        contentContainerStyle={styles.contentContainer}
      >
        <Card>
          <Text style={[styles.cardTitle, { color: colors[theme].text }]}>
            Daily Activity
          </Text>
          <LineChart 
            data={data.dailyActivity} 
            title="Last 7 Days" 
          />
        </Card>

        <Card style={styles.card}>
          <Text style={[styles.cardTitle, { color: colors[theme].text }]}>
            Feature Usage
          </Text>
          <BarChart 
            data={data.featureUsage} 
            title="Most Used Features" 
          />
        </Card>

        <Card style={styles.card}>
          <Text style={[styles.cardTitle, { color: colors[theme].text }]}>
            Prayer Tracking
          </Text>
          <ProgressChart 
            data={data.prayerTracking} 
            title="Last 7 Days" 
          />
        </Card>

        <Card style={styles.card}>
          <Text style={[styles.cardTitle, { color: colors[theme].text }]}>
            Summary
          </Text>
          
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryLabel, { color: colors[theme].text }]}>
              Total App Usage
            </Text>
            <Text style={[styles.summaryValue, { color: colors[theme].primary }]}>
              5.2 hours
            </Text>
          </View>
          
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryLabel, { color: colors[theme].text }]}>
              Prayer Completion Rate
            </Text>
            <Text style={[styles.summaryValue, { color: colors[theme].primary }]}>
              88%
            </Text>
          </View>
          
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryLabel, { color: colors[theme].text }]}>
              AI Assistant Questions
            </Text>
            <Text style={[styles.summaryValue, { color: colors[theme].primary }]}>
              45
            </Text>
          </View>
          
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryLabel, { color: colors[theme].text }]}>
              Quran Reading Sessions
            </Text>
            <Text style={[styles.summaryValue, { color: colors[theme].primary }]}>
              12
            </Text>
          </View>
        </Card>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
  },
  card: {
    marginTop: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 16,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});