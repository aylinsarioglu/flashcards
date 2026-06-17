import type { TextStyle, ViewStyle } from 'react-native';

export type ThemeColors = {
  background: string;
  card: string;
  surface: string;
  surfaceElevated: string;
  text: string;
  muted: string;
  primary: string;
  primarySoft: string;
  secondary: string;
  secondarySoft: string;
  success: string;
  successSoft: string;
  danger: string;
  dangerSoft: string;
  warning: string;
  warningSoft: string;
  accent: string;
  accentSoft: string;
  border: string;
  borderLight: string;
  onPrimary: string;
  track: string;
};

export const lightTheme: ThemeColors = {
  background: '#F4F6FB',
  card: '#FFFFFF',
  surface: '#EEF2FF',
  surfaceElevated: '#F8FAFF',
  text: '#15172B',
  muted: '#7B8199',
  primary: '#5B4FFF',
  primarySoft: '#EEEAFF',
  secondary: '#00B8A9',
  secondarySoft: '#E6FAF7',
  success: '#00C48C',
  successSoft: '#E8FBF4',
  danger: '#FF5A6E',
  dangerSoft: '#FFEDF0',
  warning: '#FF9F43',
  warningSoft: '#FFF4E8',
  accent: '#FF6B6B',
  accentSoft: '#FFEEEE',
  border: '#E4E8F2',
  borderLight: '#F0F2F8',
  onPrimary: '#FFFFFF',
  track: '#E8ECF5',
};

export const darkTheme: ThemeColors = {
  background: '#0F1118',
  card: '#1A1D2B',
  surface: '#252A3D',
  surfaceElevated: '#2E3348',
  text: '#F5F7FF',
  muted: '#9AA3B8',
  primary: '#8B83FF',
  primarySoft: '#2A2850',
  secondary: '#2DD4BF',
  secondarySoft: '#163D38',
  success: '#34D399',
  successSoft: '#163D2E',
  danger: '#FF7A8A',
  dangerSoft: '#3D1E24',
  warning: '#FFB347',
  warningSoft: '#3D2E18',
  accent: '#FF8A8A',
  accentSoft: '#3D2222',
  border: '#2E3348',
  borderLight: '#252A3D',
  onPrimary: '#FFFFFF',
  track: '#2A3044',
};

export const colors = lightTheme;

/** 8pt spacing system */
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
} as const;

/** 24px is the primary card radius */
export const cardRadius = 24;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: cardRadius,
  full: 999,
} as const;

export const layout = {
  maxWidth: 520,
  contentPadding: spacing.lg,
} as const;

export const typography = {
  display: {
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: -0.8,
    lineHeight: 40,
  } satisfies TextStyle,
  hero: {
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: -0.6,
    lineHeight: 36,
  } satisfies TextStyle,
  title: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.4,
    lineHeight: 28,
  } satisfies TextStyle,
  subtitle: {
    fontSize: 17,
    fontWeight: '600',
    lineHeight: 24,
  } satisfies TextStyle,
  body: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
  } satisfies TextStyle,
  bodyMedium: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 24,
  } satisfies TextStyle,
  caption: {
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
  } satisfies TextStyle,
  label: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  } satisfies TextStyle,
  button: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.2,
  } satisfies TextStyle,
} as const;

export function getShadow(
  level: 'soft' | 'card' | 'elevated' | 'glow',
  isDark: boolean,
) {
  const base = isDark ? '#000000' : '#1A1D2E';

  if (level === 'soft') {
    return {
      shadowColor: base,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0.2 : 0.06,
      shadowRadius: 8,
      elevation: 2,
    } satisfies ViewStyle;
  }

  if (level === 'glow') {
    return {
      shadowColor: isDark ? '#8B83FF' : '#5B4FFF',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: isDark ? 0.25 : 0.18,
      shadowRadius: 20,
      elevation: 8,
    } satisfies ViewStyle;
  }

  if (level === 'elevated') {
    return {
      shadowColor: base,
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: isDark ? 0.35 : 0.12,
      shadowRadius: 24,
      elevation: 12,
    } satisfies ViewStyle;
  }

  return {
    shadowColor: base,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: isDark ? 0.28 : 0.08,
    shadowRadius: 16,
    elevation: 6,
  } satisfies ViewStyle;
}

export type Colors = ThemeColors;
export type Spacing = typeof spacing;
export type Radius = typeof radius;
