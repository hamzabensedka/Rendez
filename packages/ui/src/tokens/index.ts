// Spacing scale (4px base)
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  '2xl': 32,
  '3xl': 48,
} as const;

// Type scale (iOS-style)
export const typography = {
  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400' as const,
  },
  footnote: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '400' as const,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400' as const,
    color: 'rgb(32, 32, 32)',
  },
  headline: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '600' as const,
  },
  title3: {
    fontSize: 20,
    lineHeight: 24,
    fontWeight: '600' as const,
  },
  title2: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '600' as const,
  },
  title1: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '700' as const,
  },
  largeTitle: {
    fontSize: 34,
    lineHeight: 41,
    fontWeight: '700' as const,
  },
} as const;

// Border radius
export const radius = {
  sm: 8,
  md: 10,
  lg: 14,
  xl: 18,
} as const;

// Colors (light mode)
export const colors = {
  light: {
    background: '#F5F5F7',
    surface: '#FFFFFF',
    text: '#000000',
    textSecondary: '#6E6E73',
    accent: '#007AFF',
    error: '#FF3B30',
    success: '#34C759',
    border: '#D1D1D6',
  },
  dark: {
    background: '#000000',
    surface: '#1C1C1E',
    text: '#FFFFFF',
    textSecondary: '#98989D',
    accent: '#0A84FF',
    error: '#FF453A',
    success: '#30D158',
    border: '#38383A',
  },
} as const;

// Shadows (subtle elevation)
export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
} as const;

// Motion
export const motion = {
  fast: 200,
  normal: 250,
  slow: 350,
} as const;

