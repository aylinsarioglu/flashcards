export const radius = {
  8: 8,
  12: 12,
  16: 16,
  20: 20,
  24: 24,
  32: 32,
} as const;

export type Radius = typeof radius;
export type RadiusKey = keyof Radius;
export type RadiusValue = Radius[RadiusKey];
