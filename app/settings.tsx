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
import { useStreamStore } from '@/store/useStreamStore';
import { colors } from '@/constants/colors';
import { Card } from '@/components/Card';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LanguageSelector } from '@/components/LanguageSelector';
import { Stack } from 'expo-router';
import { Video, Bell, Volume2, Vibrate } from 'lucide-react-native';

export default function SettingsScreen() {
  const { 
    darkMode, 
    notifications, 
    prayerReminders, 
    dailyQuote,
    notificationType,
    toggleNotifications,
    togglePrayerReminders,
    toggleDailyQuote,
    setNotificationType
  } = useSettingsStore();
  
  const {
    notifications: streamNotifications,
    toggleNotifications: toggleStreamNotifications,
    toggleUpcomingReminders,
    toggleFavoriteStreamsOnly
  } = useStreamStore();
  
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
          Prayer Notifications
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
          
          <View style={[styles.divider, { backgroundColor: colors[theme].border }]} />
          
          <View style={styles.settingItem}>
            <Text style={[styles.settingLabel, { color: colors[theme].text }]}>
              Notification Type
            </Text>
          </View>
          
          <View style={styles.notificationTypes}>
            <TouchableOpacity 
              style={[
                styles.notificationType,
                notificationType === 'adhan' && [
                  styles.selectedNotificationType,
                  { borderColor: colors[theme].primary }
                ]
              ]}
              onPress={() => setNotificationType('adhan')}
              disabled={!notifications}
            >
              <Volume2 
                size={24} 
                color={notificationType === 'adhan' ? colors[theme].primary : colors[theme].inactive} 
              />
              <Text 
                style={[
                  styles.notificationTypeText, 
                  { 
                    color: notificationType === 'adhan' 
                      ? colors[theme].primary 
                      : colors[theme].inactive 
                  }
                ]}
              >
                Adhan
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.notificationType,
                notificationType === 'vibration' && [
                  styles.selectedNotificationType,
                  { borderColor: colors[theme].primary }
                ]
              ]}
              onPress={() => setNotificationType('vibration')}
              disabled={!notifications}
            >
              <Vibrate 
                size={24} 
                color={notificationType === 'vibration' ? colors[theme].primary : colors[theme].inactive} 
              />
              <Text 
                style={[
                  styles.notificationTypeText, 
                  { 
                    color: notificationType === 'vibration' 
                      ? colors[theme].primary 
                      : colors[theme].inactive 
                  }
                ]}
              >
                Vibration
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.notificationType,
                notificationType === 'text' && [
                  styles.selectedNotificationType,
                  { borderColor: colors[theme].primary }
                ]
              ]}
              onPress={() => setNotificationType('text')}
              disabled={!notifications}
            >
              <Bell 
                size={24} 
                color={notificationType === 'text' ? colors[theme].primary : colors[theme].inactive} 
              />
              <Text 
                style={[
                  styles.notificationTypeText, 
                  { 
                    color: notificationType === 'text' 
                      ? colors[theme].primary 
                      : colors[theme].inactive 
                  }
                ]}
              >
                Text Only
              </Text>
            </TouchableOpacity>
          </View>
        </Card>

        <Text style={[styles.sectionTitle, { color: colors[theme].text }]}>
          Live Stream Settings
        </Text>
        
        <Card>
          <View style={styles.settingItem}>
            <View style={styles.settingLabelContainer}>
              <Video size={20} color={colors[theme].text} style={styles.settingIcon} />
              <Text style={[styles.settingLabel, { color: colors[theme].text }]}>
                Stream Notifications
              </Text>
            </View>
            <Switch
              value={streamNotifications.enabled}
              onValueChange={toggleStreamNotifications}
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
              Upcoming Stream Reminders
            </Text>
            <Switch
              value={streamNotifications.upcomingReminders}
              onValueChange={toggleUpcomingReminders}
              trackColor={{ 
                false: '#D1D1D6', 
                true: colors.dark.primary 
              }}
              thumbColor="#FFFFFF"
              ios_backgroundColor="#D1D1D6"
              disabled={!streamNotifications.enabled}
            />
          </View>
          
          <View style={[styles.divider, { backgroundColor: colors[theme].border }]} />
          
          <View style={styles.settingItem}>
            <Text style={[styles.settingLabel, { color: colors[theme].text }]}>
              Only Notify for Favorite Mosques
            </Text>
            <Switch
              value={streamNotifications.favoriteStreamsOnly}
              onValueChange={toggleFavoriteStreamsOnly}
              trackColor={{ 
                false: '#D1D1D6', 
                true: colors.dark.primary 
              }}
              thumbColor="#FFFFFF"
              ios_backgroundColor="#D1D1D6"
              disabled={!streamNotifications.enabled}
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
  settingLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    marginRight: 12,
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
  notificationTypes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 12,
  },
  notificationType: {
    width: '30%',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
  },
  selectedNotificationType: {
    borderWidth: 2,
  },
  notificationTypeText: {
    fontSize: 12,
    marginTop: 8,
    fontWeight: '500',
  },
});