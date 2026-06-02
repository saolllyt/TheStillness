export const COLORS = {
  // Основные
  primary: '#004a7c',
  primaryLight: '#005691',
  primaryDark: '#003a61',

  // Фоны
  background: '#f6f6f6',
  surface: '#ffffff',

  // Второстепенные элементы
  secondary: '#e8f1f5',
  secondaryMid: '#cce0ef',

  // Акцент
  accent: '#005691',

  // Текст
  text: '#0d1b2a',
  textLight: '#3a5068',
  textMuted: '#7a94a8',

  // Статусы
  success: '#2e7d5e',
  warning: '#d4820a',
  error: '#f57170',
  info: '#005691',

  border: '#c2d8e8',
  shadow: '#004a7c',

  white: '#ffffff',
  black: '#0d1b2a',
  transparent: 'transparent',
};

export const TYPOGRAPHY = {
  h1: {
    fontSize: 32,
    fontWeight: '700' as const,
    lineHeight: 40,
    color: COLORS.primary,
  },
  h2: {
    fontSize: 28,
    fontWeight: '600' as const,
    lineHeight: 36,
    color: COLORS.primary,
  },
  h3: {
    fontSize: 24,
    fontWeight: '600' as const,
    lineHeight: 32,
    color: COLORS.primary,
  },
  h4: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 28,
    color: COLORS.primary,
  },
  body1: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
    color: COLORS.text,
  },
  body2: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
    color: COLORS.text,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
    color: COLORS.textLight,
  },
  button: {
    fontSize: 16,
    fontWeight: '600' as const,
    lineHeight: 24,
    color: COLORS.white,
  },
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BORDER_RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 24,
  round: 999,
};

export const SHADOWS = {
  small: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  medium: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  large: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.14,
    shadowRadius: 16,
    elevation: 8,
  },
};

export default { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS };