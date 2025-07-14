import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Switch
} from 'react-native';
import { PrayerTimeCard } from '@/components/PrayerTimeCard';
import { prayerTimes, getNextPrayer } from '@/mocks/prayerTimes';
import { colors } from '@/constants/colors';
import { useSettingsStore } from '@/store/useSettingsStore';
import { Card } from '@/components/Card';
import { Bell, BellOff } from 'lucide-react-native';

export default function PrayersScreen() {
  const { darkMode } = useSettingsStore();
  const { prayerReminders, togglePrayerReminders } = useSettingsStore();
  const theme = darkMode ? 'dark' : 'light';
  
  const nextPrayer = getNextPrayer();
  const [location, setLocation] = useState('New York, USA');
  
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors[theme].background }]}
      contentContainerStyle={styles.contentContainer}
    >
      <Card style={styles.headerCard}>
        <Text style={[styles.date, { color: colors[theme].text }]}>
          {formattedDate}
        </Text>
        <Text style={[styles.location, { color: colors[theme].text }]}>
          {location}
        </Text>
        
        <View style={styles.reminderContainer}>
          <View style={styles.reminderTextContainer}>
            {prayerReminders ? (
              <Bell size={20} color={colors[theme].primary} />
            ) : (
              <BellOff size={20} color={colors[theme].inactive} />
            )}
            <Text style={[
              styles.reminderText, 
              { color: prayerReminders ? colors[theme].text : colors[theme].inactive }
            ]}>
              Prayer Reminders
            </Text>
          </View>
          <Switch
            value={prayerReminders}
            onValueChange={togglePrayerReminders}
            trackColor={{ 
              false: '#D1D1D6', 
              true: colors.dark.primary 
            }}
            thumbColor="#FFFFFF"
            ios_backgroundColor="#D1D1D6"
          />
        </View>
      </Card>

      <Text style={[styles.sectionTitle, { color: colors[theme].text }]}>
        Next Prayer
      </Text>
      
      <PrayerTimeCard prayerTime={nextPrayer} isNext={true} />

      <Text style={[styles.sectionTitle, { color: colors[theme].text }]}>
        Today's Prayer Times
      </Text>
      
      {/* {prayerTimes.map((prayer, index) => (
        <PrayerTimeCard 
          key={index} 
          prayerTime={prayer} 
          isNext={prayer.name === nextPrayer.name}
        />
      ))} */}

      <Card style={styles.qiblaCard}>
        <Text style={[styles.qiblaTitle, { color: colors[theme].text }]}>
          Qibla Direction
        </Text>
        <View style={styles.qiblaImagePlaceholder}>
          <Text style={[styles.qiblaImageText, { color: colors[theme].text }]}>
            Qibla Compass
          </Text>
          <Text style={[styles.qiblaDirection, { color: colors[theme].primary }]}>
            NE 65°
          </Text>
        </View>
        <TouchableOpacity 
          style={[
            styles.qiblaButton, 
            { backgroundColor: colors[theme].primary }
          ]}
        >
          <Text style={styles.qiblaButtonText}>
            Open Qibla Compass
          </Text>
        </TouchableOpacity>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  headerCard: {
    marginBottom: 20,
  },
  date: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  location: {
    fontSize: 16,
    marginTop: 4,
  },
  reminderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  reminderTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reminderText: {
    fontSize: 16,
    marginLeft: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 12,
  },
  qiblaCard: {
    marginTop: 24,
    marginBottom: 20,
    alignItems: 'center',
  },
  qiblaTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  qiblaImagePlaceholder: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  qiblaImageText: {
    fontSize: 16,
  },
  qiblaDirection: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
  },
  qiblaButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  qiblaButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});