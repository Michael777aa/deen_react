import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Image
} from 'react-native';
import { router } from 'expo-router';
import { useAuthStore } from '@/store/useAuthStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { colors } from '@/constants/colors';
import { Card } from '@/components/Card';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LanguageSelector } from '@/components/LanguageSelector';
import { 
  Settings, 
  LogOut, 
  ChevronRight, 
  Bell, 
  CreditCard, 
  HelpCircle, 
  Shield, 
  Share2 
} from 'lucide-react-native';

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();
  const { darkMode } = useSettingsStore();
  const theme = darkMode ? 'dark' : 'light';

  if (!user) {
    return null;
  }

  const handleLogout = () => {
    logout();
    router.replace('/(auth)/login');
  };

  const navigateToSettings = () => {
    router.push('/settings');
  };

  const navigateToAnalytics = () => {
    router.push('/analytics');
  };

  const navigateToPremium = () => {
    router.push('/premium');
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors[theme].background }]}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.profileHeader}>
        <Image
          source={{ uri: user.photoURL || 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80' }}
          style={styles.profileImage}
        />
        <Text style={[styles.profileName, { color: colors[theme].text }]}>
          {user.name}
        </Text>
        <Text style={[styles.profileEmail, { color: colors[theme].inactive }]}>
          {user.email}
        </Text>
        
        <TouchableOpacity 
          style={[
            styles.editProfileButton, 
            { 
              backgroundColor: 'transparent',
              borderColor: colors[theme].primary,
            }
          ]}
        >
          <Text style={[styles.editProfileText, { color: colors[theme].primary }]}>
            Edit Profile
          </Text>
        </TouchableOpacity>
      </View>

      <Card style={styles.subscriptionCard}>
        <View style={styles.subscriptionHeader}>
          <Text style={[styles.subscriptionTitle, { color: colors[theme].text }]}>
            {user.subscription === 'premium' ? 'Premium Subscription' : 'Free Account'}
          </Text>
          {user.subscription === 'premium' ? (
            <View style={[styles.premiumBadge, { backgroundColor: colors[theme].primary }]}>
              <Text style={styles.premiumBadgeText}>PREMIUM</Text>
            </View>
          ) : null}
        </View>
        
        {user.subscription === 'premium' ? (
          <Text style={[styles.subscriptionInfo, { color: colors[theme].text }]}>
            Your premium subscription is active until Dec 31, 2023
          </Text>
        ) : (
          <Text style={[styles.subscriptionInfo, { color: colors[theme].text }]}>
            Upgrade to premium for exclusive features and content
          </Text>
        )}
        
        <TouchableOpacity 
          style={[
            styles.subscriptionButton, 
            { 
              backgroundColor: user.subscription === 'premium' 
                ? colors[theme].card 
                : colors[theme].primary 
            }
          ]}
          onPress={navigateToPremium}
        >
          <Text 
            style={[
              styles.subscriptionButtonText, 
              { 
                color: user.subscription === 'premium' 
                  ? colors[theme].text 
                  : '#FFFFFF' 
              }
            ]}
          >
            {user.subscription === 'premium' ? 'Manage Subscription' : 'Upgrade to Premium'}
          </Text>
        </TouchableOpacity>
      </Card>

      <Text style={[styles.sectionTitle, { color: colors[theme].text }]}>
        App Settings
      </Text>
      
      <Card>
        <View style={styles.settingItem}>
          <Text style={[styles.settingLabel, { color: colors[theme].text }]}>
            Dark Mode
          </Text>
          <ThemeToggle />
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.settingItem}>
          <Text style={[styles.settingLabel, { color: colors[theme].text }]}>
            Language
          </Text>
          <LanguageSelector />
        </View>
        
        <View style={styles.divider} />
        
        <TouchableOpacity style={styles.settingItem} onPress={navigateToSettings}>
          <View style={styles.settingLabelContainer}>
            <Settings size={20} color={colors[theme].text} />
            <Text style={[styles.settingLabel, { color: colors[theme].text, marginLeft: 12 }]}>
              All Settings
            </Text>
          </View>
          <ChevronRight size={20} color={colors[theme].inactive} />
        </TouchableOpacity>
      </Card>

      <Text style={[styles.sectionTitle, { color: colors[theme].text }]}>
        Account
      </Text>
      
      <Card>
        <TouchableOpacity style={styles.settingItem} onPress={navigateToAnalytics}>
          <View style={styles.settingLabelContainer}>
            <Bell size={20} color={colors[theme].text} />
            <Text style={[styles.settingLabel, { color: colors[theme].text, marginLeft: 12 }]}>
              Notifications
            </Text>
          </View>
          <ChevronRight size={20} color={colors[theme].inactive} />
        </TouchableOpacity>
        
        <View style={styles.divider} />
        
        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingLabelContainer}>
            <CreditCard size={20} color={colors[theme].text} />
            <Text style={[styles.settingLabel, { color: colors[theme].text, marginLeft: 12 }]}>
              Payment Methods
            </Text>
          </View>
          <ChevronRight size={20} color={colors[theme].inactive} />
        </TouchableOpacity>
        
        <View style={styles.divider} />
        
        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingLabelContainer}>
            <Shield size={20} color={colors[theme].text} />
            <Text style={[styles.settingLabel, { color: colors[theme].text, marginLeft: 12 }]}>
              Privacy & Security
            </Text>
          </View>
          <ChevronRight size={20} color={colors[theme].inactive} />
        </TouchableOpacity>
      </Card>

      <Text style={[styles.sectionTitle, { color: colors[theme].text }]}>
        Other
      </Text>
      
      <Card>
        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingLabelContainer}>
            <HelpCircle size={20} color={colors[theme].text} />
            <Text style={[styles.settingLabel, { color: colors[theme].text, marginLeft: 12 }]}>
              Help & Support
            </Text>
          </View>
          <ChevronRight size={20} color={colors[theme].inactive} />
        </TouchableOpacity>
        
        <View style={styles.divider} />
        
        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingLabelContainer}>
            <Share2 size={20} color={colors[theme].text} />
            <Text style={[styles.settingLabel, { color: colors[theme].text, marginLeft: 12 }]}>
              Invite Friends
            </Text>
          </View>
          <ChevronRight size={20} color={colors[theme].inactive} />
        </TouchableOpacity>
        
        <View style={styles.divider} />
        
        <TouchableOpacity style={styles.settingItem} onPress={handleLogout}>
          <View style={styles.settingLabelContainer}>
            <LogOut size={20} color="#F44336" />
            <Text style={[styles.settingLabel, { color: "#F44336", marginLeft: 12 }]}>
              Logout
            </Text>
          </View>
        </TouchableOpacity>
      </Card>

      <Text style={[styles.versionText, { color: colors[theme].inactive }]}>
        Version 1.0.0
      </Text>
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
  profileHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileEmail: {
    fontSize: 16,
    marginTop: 4,
  },
  editProfileButton: {
    marginTop: 16,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
  },
  editProfileText: {
    fontSize: 14,
    fontWeight: '500',
  },
  subscriptionCard: {
    marginBottom: 24,
  },
  subscriptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  subscriptionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  premiumBadge: {
    marginLeft: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  premiumBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  subscriptionInfo: {
    fontSize: 14,
    marginBottom: 16,
  },
  subscriptionButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  subscriptionButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
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
  settingLabel: {
    fontSize: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 4,
  },
  versionText: {
    textAlign: 'center',
    marginTop: 24,
    marginBottom: 16,
    fontSize: 14,
  },
});