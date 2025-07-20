// components/ErrorToast.tsx
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { colors } from '@/constants/colors';
import { X } from 'lucide-react-native';

interface ErrorToastProps {
  message: string;
  onDismiss: () => void;
  theme: 'light' | 'dark';
}

export const ErrorToast: React.FC<ErrorToastProps> = ({ message, onDismiss, theme }) => {
  const opacity = new Animated.Value(0);

  useEffect(() => {
    Animated.sequence([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(3000),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => onDismiss());
  }, []);

  return (
    <Animated.View style={[
      styles.container,
      { 
        backgroundColor: colors[theme].background,
        opacity,
        transform: [
          {
            translateY: opacity.interpolate({
              inputRange: [0, 1],
              outputRange: [-20, 0],
            }),
          },
        ],
      }
    ]}>
      <Text style={[styles.message, { color: colors[theme].error }]}>
        {message}
      </Text>
      <TouchableOpacity onPress={onDismiss}>
        <X size={18} color={colors[theme].error} />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 1000,
  },
  message: {
    flex: 1,
    marginRight: 8,
  },
});