
export const COLORS = {
  primary: '#2C3F70',    
  secondary: '#C8D4E5',  
  background: '#E8EBED', 
  
  surface: '#FFFFFF',   
  accent: '#4A6A9C',    
  
  text: '#1E2A44',     
  textLight: '#5A6B7A', 
  textMuted: '#8D9AA8',
  
  success: '#4A7A6C', 
  warning: '#B68B5C',  
  error: '#B05E5E',     
  info: '#5A7C9C',     
  
  border: '#D1D9E2',   
  shadow: '#1E2A44',   
  
  white: '#FFFFFF',
  black: '#1A1F2C',
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
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
};

export default { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS };