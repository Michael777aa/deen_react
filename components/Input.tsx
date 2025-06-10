import React from 'react';
import { 
  View, 
  TextInput, 
  Text, 
  StyleSheet, 
  ViewStyle, 
  TextStyle,
  TextInputProps,
  Platform
} from 'react-native';
import { colors } from '@/constants/colors';
import { useSettingsStore } from '@/store/useSettingsStore';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  labelStyle?: TextStyle;
  inputStyle?: TextStyle;
  errorStyle?: TextStyle;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  containerStyle,
  labelStyle,
  inputStyle,
  errorStyle,
  ...rest
}) => {
  const { darkMode } = useSettingsStore();
  const theme = darkMode ? 'dark' : 'light';

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={[
          styles.label, 
          { color: colors[theme].text }, 
          labelStyle
        ]}>
          {label}
        </Text>
      )}
      <TextInput
        style={[
          styles.input,
          { 
            color: colors[theme].text,
            backgroundColor: colors[theme].card,
            borderColor: error ? colors[theme].error : colors[theme].border,
          },
          inputStyle
        ]}
        placeholderTextColor={colors[theme].inactive}
        {...rest}
      />
      {error && (
        <Text style={[
          styles.error,
          { color: colors[theme].error },
          errorStyle
        ]}>
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: '100%',
  },
  label: {
    marginBottom: 8,
    fontSize: 16,
    fontWeight: '500',
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    ...Platform.select({
      web: {
        outlineStyle: 'none',
      },
    }),
  },
  error: {
    marginTop: 4,
    fontSize: 14,
  },
});