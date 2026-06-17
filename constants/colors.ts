export type ColorPalette = {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  card: string;
  text: string;
  textSecondary: string;
  success: string;
  warning: string;
  danger: string;
  border: string;
};

export const lightColors: ColorPalette = {
  primary: '#5B4FFF',
  secondary: '#00B8A9',
  background: '#F4F6FB',
  surface: '#EEF2FF',
  card: '#FFFFFF',
  text: '#15172B',
  textSecondary: '#7B8199',
  success: '#00C48C',
  warning: '#FF9F43',
  danger: '#FF5A6E',
  border: '#E4E8F2',
};

export const darkColors: ColorPalette = {
  primary: '#8B83FF',
  secondary: '#2DD4BF',
  background: '#0F1118',
  surface: '#252A3D',
  card: '#1A1D2B',
  text: '#F5F7FF',
  textSecondary: '#9AA3B8',
  success: '#34D399',
  warning: '#FFB347',
  danger: '#FF7A8A',
  border: '#2E3348',
};

export const colors = lightColors;
