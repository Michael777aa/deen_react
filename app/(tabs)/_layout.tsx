import React from 'react';
import { Tabs } from 'expo-router';
import { useSettingsStore } from '@/store/useSettingsStore';
import { colors } from '@/constants/colors';
import { Home, BookOpen, ShoppingBag, MessageCircle, User } from 'lucide-react-native';
import { Utensils } from 'lucide-react-native';

export default function TabLayout() {
  const { darkMode } = useSettingsStore();
  const theme = darkMode ? 'dark' : 'light';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors[theme].primary,
        tabBarInactiveTintColor: colors[theme].inactive,
        tabBarStyle: {
          position: 'absolute',
          bottom: 20,
          left: 20,
          right: 20,
          height: 82.5,
          // backgroundColor: colors[theme].card,
          borderTopWidth: 0,
          elevation: 100,       // Android shadow
          shadowColor: '#000', // iOS shadow
          shadowOpacity: 0.1,
          shadowRadius: 10,
          paddingBottom: 10,
          paddingTop: 10,
        },
        
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="quran"
        options={{
          title: 'Quran',
          tabBarIcon: ({ color, size }) => <BookOpen size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="scanner"
        options={{
          title: 'Products',
          tabBarIcon: ({ color, size }) => <ShoppingBag size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="restaurants"
        options={{
          title: 'Restaurant',
          tabBarIcon: ({ color, size }) => <Utensils size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          headerShown: false,
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
        }}
      />
      {/* Hide these tabs from bottom navigation but keep them accessible via routing */}
      <Tabs.Screen
        name="map"
        options={{
          headerShown: false,

          href: null, // This hides it from the tab bar
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          href: null,
          headerShown: false,
          tabBarStyle: { display: "none" }, // 👈 hides bottom tabs
        }}
      />
          <Tabs.Screen
        name="prayers"
        options={{ href: null,
          headerShown: false,

         }} 
      />
    </Tabs>
  );
}