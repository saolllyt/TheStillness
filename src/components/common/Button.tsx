import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../../constants/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'large' | 'medium' | 'small';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'large',
  loading = false,
  disabled = false,
  style,
  textStyle,
}) => {
  const getBackgroundColor = () => {
    if (disabled) return COLORS.textMuted;
    switch (variant) {
      case 'primary':
        return COLORS.primary;
      case 'secondary':
        return COLORS.secondary;
      case 'outline':
        return 'transparent';
      default:
        return COLORS.primary;
    }
  };

  const getTextColor = () => {
    if (disabled) return COLORS.white;
    switch (variant) {
      case 'primary':
        return COLORS.white;
      case 'secondary':
        return COLORS.primary;
      case 'outline':
        return COLORS.primary;
      default:
        return COLORS.white;
    }
  };

  const getBorderColor = () => {
    if (disabled) return COLORS.textMuted;
    switch (variant) {
      case 'outline':
        return COLORS.primary;
      default:
        return 'transparent';
    }
  };

  const getHeight = () => {
    switch (size) {
      case 'large':
        return 56;
      case 'medium':
        return 48;
      case 'small':
        return 40;
      default:
        return 56;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
          height: getHeight(),
        },
        variant === 'outline' && styles.outline,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <Text
          style={[
            styles.text,
            { color: getTextColor() },
            variant === 'outline' && styles.outlineText,
            textStyle,
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.lg,
    width: '100%',
  },
  text: {
    ...TYPOGRAPHY.button,
    fontWeight: '600',
  },
  outline: {
    borderWidth: 1,
  },
  outlineText: {
    color: COLORS.primary,
  },
});