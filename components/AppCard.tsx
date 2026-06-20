import { type ReactNode } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';

import { darkColors, lightColors } from '../constants/colors';
import { radius } from '../constants/radius';
import { getShadows } from '../constants/shadows';
import { spacing } from '../constants/spacing';
import { useTheme } from '../storage/ThemeContext';

export type AppCardProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  accentColor?: string;
};

export default function AppCard({ children, style, accentColor }: AppCardProps) {
  const { isDark } = useTheme();
  const palette = isDark ? darkColors : lightColors;
  const { cardShadow } = getShadows(isDark);

  return (
    <View
      style={[
        {
          alignSelf: 'stretch',
          width: '100%',
          backgroundColor: palette.card,
          borderRadius: radius[24],
          padding: spacing[24],
          borderWidth: 1,
          borderColor: palette.border,
          overflow: 'hidden',
          ...cardShadow,
        },
        style,
      ]}>
      {accentColor ? (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            backgroundColor: accentColor,
          }}
        />
      ) : null}
      {children}
    </View>
  );
}
