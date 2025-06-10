import React from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { useSettingsStore } from '@/store/useSettingsStore';
import { colors } from '@/constants/colors';
import { Moon, Sun } from 'lucide-react-native';

export const ThemeToggle: React.FC = () => {
  const { darkMode, toggleDarkMode } = useSettingsStore();
  const theme = darkMode ? 'dark' : 'light';

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Sun size={20} color={colors[theme].text} />
      </View>
      
      <Switch
        value={darkMode}
        onValueChange={toggleDarkMode}
        trackColor={{ 
          false: '#D1D1D6', 
          true: colors.dark.primary 
        }}
        thumbColor="#FFFFFF"
        ios_backgroundColor="#D1D1D6"
      />
      
      <View style={styles.iconContainer}>
        <Moon size={20} color={colors[theme].text} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    padding: 8,
  },
});