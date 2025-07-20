import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { PrayerTimeCard } from "@/components/PrayerTimeCard";
import { colors } from "@/constants/colors";
import { useSettingsStore } from "@/store/useSettingsStore";
import { Card } from "@/components/Card";
import { ArrowLeft, Bell, BellOff } from "lucide-react-native";
import { useLocation } from "@/context/useLocation";
import { IPrayerTime, IPrayerTimes } from "@/types/prayer";

import { router } from "expo-router";
import { getNextPrayer, getPrayerTimes } from "@/redux/features/prayers/prayersApi";

export default function PrayersScreen() {
  const { darkMode } = useSettingsStore();
  const { prayerReminders, togglePrayerReminders } = useSettingsStore();
  const theme = darkMode ? "dark" : "light";

  const {
    location,
    errorMsg,
    isLoading: isLocationLoading,
    refreshLocation,
  } = useLocation();
  const [nextPrayer, setNextPrayer] = useState<IPrayerTime | null>(null);
  const [prayerTimes, setPrayerTimes] = useState<IPrayerTimes | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchPrayerData = async () => {
    if (location) {
      try {
        const [prayerData, nextPrayerData] = await Promise.all([
          getPrayerTimes(location.latitude, location.longitude),
          getNextPrayer(location.latitude, location.longitude),
        ]);

        setPrayerTimes(prayerData);
        setNextPrayer(nextPrayerData);
      } catch (error) {
        console.error("Error fetching prayer data:", error);
        Alert.alert("Error", "Failed to fetch prayer times. Please try again.");
      }
    }
  };

  useEffect(() => {
    fetchPrayerData();
  }, [location]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshLocation();
      await fetchPrayerData();
    } catch (error) {
      console.error("Error refreshing:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  if (isLocationLoading) {
    return (
      <View
        style={[
          styles.loadingContainer,
          { backgroundColor: colors[theme].background },
        ]}
      >
        <ActivityIndicator size="large" color={colors[theme].primary} />
        <Text style={{ color: colors[theme].text, marginTop: 16 }}>
          Getting your location...
        </Text>
      </View>
    );
  }

  if (errorMsg || !location) {
    return (
      <View
        style={[
          styles.loadingContainer,
          { backgroundColor: colors[theme].background },
        ]}
      >
        <Text style={[styles.errorText, { color: colors[theme].error }]}>
          {errorMsg || "Could not determine your location"}
        </Text>
        <TouchableOpacity
          style={[
            styles.refreshButton,
            { backgroundColor: colors[theme].primary },
          ]}
          onPress={handleRefresh}
        >
          <Text style={styles.refreshButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Convert prayer times object to array for rendering
  const prayerTimesArray = prayerTimes
    ? [
        { name: "Fajr", time: prayerTimes.fajr, arabicName: "الفجر" },
        { name: "Sunrise", time: prayerTimes.sunrise, arabicName: "الشروق" },
        { name: "Dhuhr", time: prayerTimes.dhuhr, arabicName: "الظهر" },
        { name: "Asr", time: prayerTimes.asr, arabicName: "العصر" },
        { name: "Maghrib", time: prayerTimes.maghrib, arabicName: "المغرب" },
        { name: "Isha", time: prayerTimes.isha, arabicName: "العشاء" },
      ]
    : [];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors[theme].background }]}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={handleRefresh}
          colors={[colors[theme].primary]}
          tintColor={colors[theme].primary}
        />
      }
    >
 
      <View style={styles.headerRow}>
      <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
          <ArrowLeft size={24} color={colors[theme].text} />
        </TouchableOpacity>
        <Text style={[styles.screenTitle, { color: colors[theme].text }]}>
          Prayer Times
        </Text>
        <TouchableOpacity onPress={handleRefresh} disabled={isRefreshing}>
          <MaterialIcons
            name="refresh"
            size={24}
            color={
              isRefreshing ? colors[theme].inactive : colors[theme].primary
            }
          />
        </TouchableOpacity>
      </View>

      <Card style={styles.headerCard}>
        <Text style={[styles.date, { color: colors[theme].text }]}>
          {prayerTimes?.date || "Loading date..."}
        </Text>
        <Text style={[styles.location, { color: colors[theme].text }]}>
          {prayerTimes?.locationName || "Loading location..."}
        </Text>

        <View style={styles.reminderContainer}>
          <View style={styles.reminderTextContainer}>
            {prayerReminders ? (
              <Bell size={20} color={colors[theme].primary} />
            ) : (
              <BellOff size={20} color={colors[theme].inactive} />
            )}
            <Text
              style={[
                styles.reminderText,
                {
                  color: prayerReminders
                    ? colors[theme].text
                    : colors[theme].inactive,
                },
              ]}
            >
              Prayer Reminders
            </Text>
          </View>
          <Switch
            value={prayerReminders}
            onValueChange={togglePrayerReminders}
            trackColor={{
              false: "#D1D1D6",
              true: colors.dark.primary,
            }}
            thumbColor="#FFFFFF"
            ios_backgroundColor="#D1D1D6"
          />
        </View>
      </Card>

      <Text style={[styles.sectionTitle, { color: colors[theme].text }]}>
        Next Prayer
      </Text>

      {nextPrayer && (
        <PrayerTimeCard
          prayerTime={{
            name: nextPrayer.name,
            time: nextPrayer.time,
            arabicName: getArabicName(nextPrayer.name),
          }}
          isNext={true}
        />
      )}

      <Text style={[styles.sectionTitle, { color: colors[theme].text }]}>
        Today's Prayer Times
      </Text>

      {prayerTimesArray.map((prayer, index) => (
        <PrayerTimeCard
          key={index}
          prayerTime={prayer}
          isNext={nextPrayer?.name === prayer.name}
        />
      ))}
    </ScrollView>
  );
}

// Helper function to get Arabic names for prayers
function getArabicName(englishName: string): string {
  switch (englishName) {
    case "Fajr":
      return "الفجر";
    case "Sunrise":
      return "الشروق";
    case "Dhuhr":
      return "الظهر";
    case "Asr":
      return "العصر";
    case "Maghrib":
      return "المغرب";
    case "Isha":
      return "العشاء";
    default:
      return "";
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  headerCard: {
    marginBottom: 20,
  },
  date: {
    fontSize: 18,
    fontWeight: "bold",
  },
  location: {
    fontSize: 16,
    marginTop: 4,
  },
  reminderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
  },
  reminderTextContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  reminderText: {
    fontSize: 16,
    marginLeft: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 12,
  },
  qiblaCard: {
    marginTop: 24,
    marginBottom: 20,
    alignItems: "center",
  },
  qiblaTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  qiblaImagePlaceholder: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "#E0E0E0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  qiblaImageText: {
    fontSize: 16,
  },
  qiblaDirection: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 8,
  },
  qiblaButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  qiblaButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  errorText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 16,
  },
  refreshButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  refreshButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  headerButton: {
    padding: 8,
  },
});
