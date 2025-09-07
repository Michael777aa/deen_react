import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { colors } from '@/constants/colors';
import { useSettingsStore } from '@/store/useSettingsStore';
import { Svg, Path, Circle } from 'react-native-svg';

interface BarChartProps {
  data: { name: string; count: number }[];
  title: string;
}

export const BarChart: React.FC<BarChartProps> = ({ data, title }) => {
  const { darkMode } = useSettingsStore();
  const theme = darkMode ? 'dark' : 'light';
  
  const maxValue = Math.max(...data.map(item => item.count));
  
  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors[theme].text }]}>{title}</Text>
      
      <View style={styles.chartContainer}>
        {data.map((item, index) => {
          const barHeight = (item.count / maxValue) * 150;
          
          return (
            <View key={index} style={styles.barContainer}>
              <Text style={[styles.barValue, { color: colors[theme].text }]}>
                {item.count}
              </Text>
              <View 
                style={[
                  styles.bar, 
                  { 
                    height: barHeight, 
                    backgroundColor: colors[theme].primary 
                  }
                ]} 
              />
              <Text 
                style={[
                  styles.barLabel, 
                  { color: colors[theme].text }
                ]}
                numberOfLines={1}
              >
                {item.name}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

interface LineChartProps {
  data: number[];
  title: string;
  labels?: string[];
}

export const LineChart: React.FC<LineChartProps> = ({ 
  data, 
  title, 
  labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] 
}) => {
  const { darkMode } = useSettingsStore();
  const theme = darkMode ? 'dark' : 'light';
  
  const maxValue = Math.max(...data);
  const width = Dimensions.get('window').width - 40;
  const segmentWidth = width / (data.length - 1);
  
  const points = data.map((value, index) => {
    const x = index * segmentWidth;
    const y = 150 - (value / maxValue) * 150;
    return { x, y };
  });
  
  const pathD = points.map((point, index) => {
    return index === 0 
      ? `M ${point.x} ${point.y}` 
      : `L ${point.x} ${point.y}`;
  }).join(' ');
  
  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors[theme].text }]}>{title}</Text>
      
      <View style={styles.lineChartContainer}>
        <View style={styles.chartArea}>
        <Svg height="150" width={width}>
  <Path
    d={pathD}
    fill="none"
    stroke={colors[theme].primary}
    strokeWidth={3} // number, not string
  />
  {points.map((point, index) => (
    <Circle
      key={index}
      cx={point.x}
      cy={point.y}
      r={4} // number
      fill={colors[theme].primary}
    />
  ))}
</Svg>

        </View>
        
        <View style={styles.labelsContainer}>
          {labels.map((label, index) => (
            <Text 
              key={index} 
              style={[
                styles.label, 
                { 
                  color: colors[theme].text,
                  width: segmentWidth,
                  left: index * segmentWidth - segmentWidth / 2,
                }
              ]}
            >
              {label}
            </Text>
          ))}
        </View>
      </View>
    </View>
  );
};

interface ProgressChartProps {
  data: { name: string; completed: number; total: number }[];
  title: string;
}

export const ProgressChart: React.FC<ProgressChartProps> = ({ data, title }) => {
  const { darkMode } = useSettingsStore();
  const theme = darkMode ? 'dark' : 'light';
  
  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors[theme].text }]}>{title}</Text>
      
      <View style={styles.progressContainer}>
        {data.map((item, index) => {
          const percentage = (item.completed / item.total) * 100;
          
          return (
            <View key={index} style={styles.progressItem}>
              <View style={styles.progressLabelContainer}>
                <Text style={[styles.progressLabel, { color: colors[theme].text }]}>
                  {item.name}
                </Text>
                <Text style={[styles.progressValue, { color: colors[theme].text }]}>
                  {item.completed}/{item.total}
                </Text>
              </View>
              
              <View style={[
                styles.progressTrack, 
                { backgroundColor: colors[theme].border }
              ]}>
                <View 
                  style={[
                    styles.progressFill, 
                    { 
                      width: `${percentage}%`, 
                      backgroundColor: colors[theme].primary 
                    }
                  ]} 
                />
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 200,
  },
  barContainer: {
    alignItems: 'center',
    flex: 1,
  },
  bar: {
    width: 20,
    borderRadius: 4,
  },
  barValue: {
    fontSize: 12,
    marginBottom: 4,
  },
  barLabel: {
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center',
  },
  lineChartContainer: {
    height: 200,
  },
  chartArea: {
    height: 150,
  },
  labelsContainer: {
    flexDirection: 'row',
    height: 20,
    position: 'relative',
  },
  label: {
    position: 'absolute',
    textAlign: 'center',
    fontSize: 12,
  },
  progressContainer: {
    marginTop: 8,
  },
  progressItem: {
    marginBottom: 16,
  },
  progressLabelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  progressLabel: {
    fontSize: 14,
  },
  progressValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
  },
});