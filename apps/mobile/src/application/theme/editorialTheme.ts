/**
 * Shared “editorial” monochrome palette + type scale for profile, bookings, favorites, bottom nav.
 * Spacing uses a 16px md step (wider than @planity/ui tokens) for these marketing-style screens.
 */
export const editorialTheme = {
  colors: {
    primary: '#000000',
    surface: '#f9f9f9',
    surfaceContainerLowest: '#ffffff',
    surfaceContainerLow: '#f3f3f3',
    surfaceContainerHigh: '#e8e8e8',
    surfaceContainerHighest: '#e2e2e2',
    onSurface: '#1b1b1b',
    onSurfaceVariant: '#474747',
    onPrimary: '#e2e2e2',
    outline: '#777777',
    outlineVariant: '#c6c6c6',
    success: '#16A34A',
  },
  typography: {
    display: {
      fontSize: 48,
      fontWeight: '700' as const,
      letterSpacing: -0.02,
      lineHeight: 56,
    },
    displayLarge: {
      fontSize: 56,
      fontWeight: '700' as const,
      letterSpacing: -0.02,
      lineHeight: 64,
    },
    headline: {
      fontSize: 28,
      fontWeight: '600' as const,
      letterSpacing: -0.01,
      lineHeight: 36,
    },
    title: {
      fontSize: 22,
      fontWeight: '500' as const,
      lineHeight: 28,
    },
    body: {
      fontSize: 16,
      fontWeight: '400' as const,
      lineHeight: 24,
    },
    label: {
      fontSize: 12,
      fontWeight: '600' as const,
      letterSpacing: 0.15,
      lineHeight: 16,
    },
    caption: {
      fontSize: 11,
      fontWeight: '600' as const,
      letterSpacing: 0.2,
      lineHeight: 14,
    },
    captionTight: {
      fontSize: 10,
      fontWeight: '600' as const,
      letterSpacing: 0.2,
      lineHeight: 14,
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    '2xl': 44,
    '3xl': 64,
  },
} as const;

export type EditorialTheme = typeof editorialTheme;
