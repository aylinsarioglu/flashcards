import { Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';

import { radius } from '../constants/radius';
import { spacing as dsSpacing } from '../constants/spacing';
import { typography as dsTypography } from '../constants/typography';
import { getShadow, type ThemeColors } from '../constants/theme';

type IconName = ComponentProps<typeof Ionicons>['name'];

export type StatCardProps = {
  label: string;
  value: string | number;
  icon: IconName;
  accent: string;
  colors: ThemeColors;
  isDark: boolean;
  style?: StyleProp<ViewStyle>;
};

export default function StatCard({
  label,
  value,
  icon,
  accent,
  colors,
  isDark,
  style,
}: StatCardProps) {
  const valueFontSize =
    typeof value === 'string' && value.length > 10 ? 16 : 22;

  return (
    <View
      style={[
        {
          flexGrow: 1,
          flexBasis: '46%',
          minWidth: 140,
          backgroundColor: colors.surfaceElevated,
          borderRadius: radius[16],
          padding: dsSpacing[16],
          borderWidth: 1,
          borderColor: colors.borderLight,
          ...getShadow('soft', isDark),
        },
        style,
      ]}>
      <View
        style={{
          width: 36,
          height: 36,
          borderRadius: 18,
          backgroundColor: accent + '18',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: dsSpacing[12],
        }}>
        <Ionicons name={icon} size={18} color={accent} />
      </View>
      <Text
        numberOfLines={1}
        style={[
          dsTypography.subtitle,
          {
            color: colors.text,
            fontSize: valueFontSize,
            fontWeight: '800',
            letterSpacing: -0.4,
          },
        ]}>
        {value}
      </Text>
      <Text
        style={[
          dsTypography.caption,
          { color: colors.muted, marginTop: dsSpacing[4] },
        ]}>
        {label}
      </Text>
    </View>
  );
}
