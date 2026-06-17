export const spacing = {
  4: 4,
  8: 8,
  12: 12,
  16: 16,
  20: 20,
  24: 24,
  32: 32,
  40: 40,
} as const;

export type Spacing = typeof spacing;
export type SpacingKey = keyof Spacing;
export type SpacingValue = Spacing[SpacingKey];
