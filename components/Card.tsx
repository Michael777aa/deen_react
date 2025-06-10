import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '@/constants/colors';
import { useSettingsStore } from '@/store/useSettingsStore';

interface CardProps {
  children: ReactNode;
  style?: ViewStyle;
  elevation?: number;
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  elevation = 2,
}) => {
  const { darkMode } = useSettingsStore();
  const theme = darkMode ? 'dark' : 'light';

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors[theme].card,
          shadowOpacity: darkMode ? 0.3 : 0.1,
          elevation: darkMode ? elevation / 2 : elevation,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    marginVertical: 8,
  },
});