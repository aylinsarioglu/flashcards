import type { ViewStyle } from 'react-native';

export type ShadowToken = Pick<
  ViewStyle,
  'shadowColor' | 'shadowOffset' | 'shadowOpacity' | 'shadowRadius' | 'elevation'
>;

export type ShadowPalette = {
  cardShadow: ShadowToken;
  buttonShadow: ShadowToken;
};

const lightShadowBase = '#1A1D2E';
const darkShadowBase = '#000000';

export const lightShadows: ShadowPalette = {
  cardShadow: {
    shadowColor: lightShadowBase,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 6,
  },
  buttonShadow: {
    shadowColor: '#5B4FFF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 8,
  },
};

export const darkShadows: ShadowPalette = {
  cardShadow: {
    shadowColor: darkShadowBase,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 16,
    elevation: 6,
  },
  buttonShadow: {
    shadowColor: '#8B83FF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 8,
  },
};

export function getShadows(isDark: boolean): ShadowPalette {
  return isDark ? darkShadows : lightShadows;
}

export const { cardShadow, buttonShadow } = lightShadows;
