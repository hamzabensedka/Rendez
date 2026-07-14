// Spacing scale (4px base) – product-agnostic
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  '2xl': 32,
  '3xl': 48,
  '4xl': 64,
} as const;

// Type scale – neutral, readable
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
  },
  bodyEmphasis: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600' as const,
  },
  headline: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '600' as const,
  },
  title3: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '600' as const,
  },
  title2: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '600' as const,
  },
  title1: {
    fontSize: 26,
    lineHeight: 32,
    fontWeight: '700' as const,
  },
  largeTitle: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '700' as const,
  },
} as const;

// Border radius – subtle, modern
export const radius = {
  xs: 4,
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
  full: 9999,
} as const;

// Colors – neutral palette (slate/blue-gray, no product-specific accent)
export const colors = {
  light: {
    background: '#F8FAFC',
    surface: '#FFFFFF',
    surfaceSecondary: '#F1F5F9',
    text: '#0F172A',
    textSecondary: '#64748B',
    textTertiary: '#94A3B8',
    accent: '#475569',
    accentMuted: '#E2E8F0',
    error: '#DC2626',
    success: '#16A34A',
    border: '#E2E8F0',
    borderFocus: '#64748B',
  },
  dark: {
    background: '#0F172A',
    surface: '#1E293B',
    surfaceSecondary: '#334155',
    text: '#F8FAFC',
    textSecondary: '#94A3B8',
    textTertiary: '#64748B',
    accent: '#CBD5E1',
    accentMuted: '#475569',
    error: '#EF4444',
    success: '#22C55E',
    border: '#334155',
    borderFocus: '#94A3B8',
  },
} as const;

// Shadows – soft elevation
export const shadows = {
  xs: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  sm: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },
  lg: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
  },
} as const;

// Motion
export const motion = {
  fast: 150,
  normal: 250,
  slow: 350,
} as const;
