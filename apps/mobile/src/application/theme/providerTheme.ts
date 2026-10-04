/** Atelier Floor tokens — provider surfaces only. Consumer screens keep editorialTheme. */
export const providerTheme = {
  colors: {
    paper: '#F3F0E8',
    surface: '#FAF8F3',
    ink: '#161412',
    muted: '#6B6560',
    rule: '#D9D4CC',
    booked: '#161412',
    bookedText: '#FAF8F3',
    past: '#E7E2D8',
    now: '#B42318',
    success: '#3F6B4A',
  },
  font: {
    display: 'PlusJakartaSans-Bold',
    headline: 'PlusJakartaSans-Bold',
    body: 'PlusJakartaSans-Regular',
    medium: 'PlusJakartaSans-Medium',
    label: 'PlusJakartaSans-Medium',
  },
  radius: {
    card: 4,
    block: 2,
    pill: 999,
  },
  type: {
    display: { fontSize: 36, lineHeight: 40, letterSpacing: -0.6, fontWeight: '700' as const },
    title: { fontSize: 22, lineHeight: 28, fontWeight: '700' as const },
    body: { fontSize: 16, lineHeight: 22, fontWeight: '400' as const },
    small: { fontSize: 14, lineHeight: 20, fontWeight: '400' as const },
    time: { fontSize: 13, lineHeight: 16, fontWeight: '500' as const },
    label: {
      fontSize: 11,
      lineHeight: 14,
      letterSpacing: 1.4,
      fontWeight: '500' as const,
    },
  },
} as const;

export type ProviderTheme = typeof providerTheme;
