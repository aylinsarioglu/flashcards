export const colors = {
  primary: '#007AFF',
  background: '#f8f9fa',
  card: '#ffffff',
  text: '#1a1a1a',
  muted: '#666666',
  success: '#34c759',
} as const;

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

export type Colors = typeof colors;
export type Spacing = typeof spacing;
export type Radius = typeof radius;
