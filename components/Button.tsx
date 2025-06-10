import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps
} from 'react-native';
import { colors } from '@/constants/colors';
import { useSettingsStore } from '@/store/useSettingsStore';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  style,
  textStyle,
  ...rest
}) => {
  const { darkMode } = useSettingsStore();
  const theme = darkMode ? 'dark' : 'light';

  const getButtonStyle = (): ViewStyle => {
    let baseStyle: ViewStyle = {
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
    };

    // Size styles
    switch (size) {
      case 'small':
        baseStyle = { ...baseStyle, paddingVertical: 8, paddingHorizontal: 16 };
        break;
      case 'large':
        baseStyle = { ...baseStyle, paddingVertical: 16, paddingHorizontal: 24 };
        break;
      default: // medium
        baseStyle = { ...baseStyle, paddingVertical: 12, paddingHorizontal: 20 };
    }

    // Variant styles
    switch (variant) {
      case 'primary':
        baseStyle = {
          ...baseStyle,
          backgroundColor: colors[theme].primary,
        };
        break;
      case 'secondary':
        baseStyle = {
          ...baseStyle,
          backgroundColor: colors[theme].secondary,
        };
        break;
      case 'outline':
        baseStyle = {
          ...baseStyle,
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: colors[theme].primary,
        };
        break;
      case 'text':
        baseStyle = {
          ...baseStyle,
          backgroundColor: 'transparent',
        };
        break;
    }

    // Disabled state
    if (disabled) {
      baseStyle = {
        ...baseStyle,
        opacity: 0.5,
      };
    }

    return baseStyle;
  };

  const getTextStyle = (): TextStyle => {
    let baseStyle: TextStyle = {
      fontWeight: '600',
    };

    // Size styles
    switch (size) {
      case 'small':
        baseStyle = { ...baseStyle, fontSize: 14 };
        break;
      case 'large':
        baseStyle = { ...baseStyle, fontSize: 18 };
        break;
      default: // medium
        baseStyle = { ...baseStyle, fontSize: 16 };
    }

    // Variant styles
    switch (variant) {
      case 'primary':
      case 'secondary':
        baseStyle = {
          ...baseStyle,
          color: '#FFFFFF',
        };
        break;
      case 'outline':
      case 'text':
        baseStyle = {
          ...baseStyle,
          color: colors[theme].primary,
        };
        break;
    }

    return baseStyle;
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[getButtonStyle(), style]}
      activeOpacity={0.7}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={variant === 'primary' || variant === 'secondary' ? '#FFFFFF' : colors[theme].primary} 
        />
      ) : (
        <Text style={[getTextStyle(), textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};