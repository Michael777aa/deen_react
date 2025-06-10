import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Switch,
  TouchableOpacity
} from 'react-native';
import { useSettingsStore } from '@/store/useSettingsStore';
import { colors } from '@/constants/colors';
import { Card } from '@/components/Card';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LanguageSelector } from '@/components/LanguageSelector';
import { Stack } from 'expo-router';

export default function SettingsScreen() {
  const { 
    darkMode, 
    notifications, 
    prayerReminders, 
    dailyQuote,
    toggleNotifications,
    togglePrayerReminders,
    toggleDailyQuote
  } = useSettingsStore();
  
  const theme = darkMode ? 'dark' : 'light';

  return (
    <>
      <Stack.Screen options={{ title: "Settings" }} />
      <ScrollView 
        style={[styles.container, { backgroundColor: colors[theme].background }]}
        contentContainerStyle={styles.contentContainer}
      >
        <Text style={[styles.sectionTitle, { color: colors[theme].text }]}>
          Appearance
        </Text>
        
        <Card>
          <View style={styles.settingItem}>
            <Text style={[styles.settingLabel, { color: colors[theme].text }]}>
              Dark Mode
            </Text>
            <ThemeToggle />
          </View>
          
          <View style={[styles.divider, { backgroundColor: colors[theme].border }]} />
          
          <View style={styles.settingItem}>
            <Text style={[styles.settingLabel, { color: colors[theme].text }]}>
              Language
            </Text>
            <LanguageSelector />
          </View>
        </Card>

        <Text style={[styles.sectionTitle, { color: colors[theme].text }]}>
          Notifications
        </Text>
        
        <Card>
          <View style={styles.settingItem}>
            <Text style={[styles.settingLabel, { color: colors[theme].text }]}>
              Enable Notifications
            </Text>
            <Switch
              value={notifications}
              onValueChange={toggleNotifications}
              trackColor={{ 
                false: '#D1D1D6', 
                true: colors.dark.primary 
              }}
              thumbColor="#FFFFFF"
              ios_backgroundColor="#D1D1D6"
            />
          </View>
          
          <View style={[styles.divider, { backgroundColor: colors[theme].border }]} />
          
          <View style={styles.settingItem}>
            <Text style={[styles.settingLabel, { color: colors[theme].text }]}>
              Prayer Time Reminders
            </Text>
            <Switch
              value={prayerReminders}
              onValueChange={togglePrayerReminders}
              trackColor={{ 
                false: '#D1D1D6', 
                true: colors.dark.primary 
              }}
              thumbColor="#FFFFFF"
              ios_backgroundColor="#D1D1D6"
              disabled={!notifications}
            />
          </View>
          
          <View style={[styles.divider, { backgroundColor: colors[theme].border }]} />
          
          <View style={styles.settingItem}>
            <Text style={[styles.settingLabel, { color: colors[theme].text }]}>
              Daily Islamic Quote
            </Text>
            <Switch
              value={dailyQuote}
              onValueChange={toggleDailyQuote}
              trackColor={{ 
                false: '#D1D1D6', 
                true: colors.dark.primary 
              }}
              thumbColor="#FFFFFF"
              ios_backgroundColor="#D1D1D6"
              disabled={!notifications}
            />
          </View>
        </Card>

        <Text style={[styles.sectionTitle, { color: colors[theme].text }]}>
          Prayer Settings
        </Text>
        
        <Card>
          <TouchableOpacity style={styles.settingItem}>
            <Text style={[styles.settingLabel, { color: colors[theme].text }]}>
              Calculation Method
            </Text>
            <Text style={[styles.settingValue, { color: colors[theme].inactive }]}>
              Islamic Society of North America
            </Text>
          </TouchableOpacity>
          
          <View style={[styles.divider, { backgroundColor: colors[theme].border }]} />
          
          <TouchableOpacity style={styles.settingItem}>
            <Text style={[styles.settingLabel, { color: colors[theme].text }]}>
              Juristic Method (Asr)
            </Text>
            <Text style={[styles.settingValue, { color: colors[theme].inactive }]}>
              Standard (Shafi, Maliki, Hanbali)
            </Text>
          </TouchableOpacity>
          
          <View style={[styles.divider, { backgroundColor: colors[theme].border }]} />
          
          <TouchableOpacity style={styles.settingItem}>
            <Text style={[styles.settingLabel, { color: colors[theme].text }]}>
              Adjust High Latitude Method
            </Text>
            <Text style={[styles.settingValue, { color: colors[theme].inactive }]}>
              Middle of Night
            </Text>
          </TouchableOpacity>
        </Card>

        <Text style={[styles.sectionTitle, { color: colors[theme].text }]}>
          App Settings
        </Text>
        
        <Card>
          <TouchableOpacity style={styles.settingItem}>
            <Text style={[styles.settingLabel, { color: colors[theme].text }]}>
              Clear Cache
            </Text>
          </TouchableOpacity>
          
          <View style={[styles.divider, { backgroundColor: colors[theme].border }]} />
          
          <TouchableOpacity style={styles.settingItem}>
            <Text style={[styles.settingLabel, { color: colors[theme].text }]}>
              Reset All Settings
            </Text>
          </TouchableOpacity>
        </Card>

        <Text style={[styles.sectionTitle, { color: colors[theme].text }]}>
          About
        </Text>
        
        <Card>
          <TouchableOpacity style={styles.settingItem}>
            <Text style={[styles.settingLabel, { color: colors[theme].text }]}>
              Privacy Policy
            </Text>
          </TouchableOpacity>
          
          <View style={[styles.divider, { backgroundColor: colors[theme].border }]} />
          
          <TouchableOpacity style={styles.settingItem}>
            <Text style={[styles.settingLabel, { color: colors[theme].text }]}>
              Terms of Service
            </Text>
          </TouchableOpacity>
          
          <View style={[styles.divider, { backgroundColor: colors[theme].border }]} />
          
          <TouchableOpacity style={styles.settingItem}>
            <Text style={[styles.settingLabel, { color: colors[theme].text }]}>
              Contact Us
            </Text>
          </TouchableOpacity>
          
          <View style={[styles.divider, { backgroundColor: colors[theme].border }]} />
          
          <View style={styles.settingItem}>
            <Text style={[styles.settingLabel, { color: colors[theme].text }]}>
              Version
            </Text>
            <Text style={[styles.settingValue, { color: colors[theme].inactive }]}>
              1.0.0
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 12,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingLabel: {
    fontSize: 16,
  },
  settingValue: {
    fontSize: 14,
  },
  divider: {
    height: 1,
    marginVertical: 4,
  },
});