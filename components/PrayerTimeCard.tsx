import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from './Card';
import { PrayerTime } from '@/types';
import { colors } from '@/constants/colors';
import { useSettingsStore } from '@/store/useSettingsStore';

interface PrayerTimeCardProps {
  prayerTime: PrayerTime;
  isNext?: boolean;
}

export const PrayerTimeCard: React.FC<PrayerTimeCardProps> = ({
  prayerTime,
  isNext = false,
}) => {
  const { darkMode } = useSettingsStore();
  const theme = darkMode ? 'dark' : 'light';

  return (
    <Card
      style={[
        styles.card,
        isNext && { borderLeftWidth: 4, borderLeftColor: colors[theme].primary }
      ]}
    >
      <View style={styles.content}>
        <View>
          <Text style={[styles.name, { color: colors[theme].text }]}>
            {prayerTime.name}
          </Text>
          <Text style={[styles.arabicName, { color: colors[theme].text }]}>
            {prayerTime.arabicName}
          </Text>
        </View>
        <View>
          <Text style={[
            styles.time, 
            { color: isNext ? colors[theme].primary : colors[theme].text }
          ]}>
            {prayerTime.time}
          </Text>
          {isNext && (
            <Text style={[styles.nextLabel, { color: colors[theme].primary }]}>
              Next Prayer
            </Text>
          )}
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 6,
    padding: 12,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  arabicName: {
    fontSize: 14,
    marginTop: 2,
  },
  time: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'right',
  },
  nextLabel: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'right',
    marginTop: 2,
  },
});