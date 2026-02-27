import { DefaultTheme } from '@react-navigation/native';
import { COLORS } from '../constants/theme';

export const NavigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: COLORS.primary,
    background: COLORS.background,
    card: COLORS.white,
    text: COLORS.text,
    border: COLORS.border,
    notification: COLORS.accent,
  },
};