export type ThemeColors = {
  background: string;
  card: string;
  text: string;
  muted: string;
  primary: string;
  success: string;
  danger: string;
};

export const lightTheme: ThemeColors = {
  background: '#f8f9fa',
  card: '#ffffff',
  text: '#1a1a1a',
  muted: '#666666',
  primary: '#007AFF',
  success: '#34c759',
  danger: '#ff3b30',
};

export const darkTheme: ThemeColors = {
  background: '#121212',
  card: '#1e1e1e',
  text: '#f5f5f5',
  muted: '#a0a0a0',
  primary: '#0a84ff',
  success: '#30d158',
  danger: '#ff453a',
};

export const colors = lightTheme;

export const spacing = {
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
} as const;

export type Colors = ThemeColors;
export type Spacing = typeof spacing;
export type Radius = typeof radius;
