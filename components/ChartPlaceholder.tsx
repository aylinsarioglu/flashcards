import { useEffect, useMemo } from 'react';
import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

import { motion, progressEasing } from './animations';
import { radius } from '../constants/radius';
import { spacing as dsSpacing } from '../constants/spacing';
import { typography as dsTypography } from '../constants/typography';
import { getShadow, type ThemeColors } from '../constants/theme';

export type ChartBar = {
  label: string;
  value: number;
};

type ChartPlaceholderProps = {
  title: string;
  subtitle?: string;
  data?: ChartBar[];
  colors: ThemeColors;
  isDark: boolean;
  height?: number;
};

function AnimatedBar({
  label,
  value,
  maxValue,
  hasData,
  chartHeight,
  colors,
  delay,
}: {
  label: string;
  value: number;
  maxValue: number;
  hasData: boolean;
  chartHeight: number;
  colors: ThemeColors;
  delay: number;
}) {
  const targetHeight = hasData
    ? Math.max(8, (value / maxValue) * (chartHeight - 32))
    : 8;
  const animatedHeight = useSharedValue(8);

  useEffect(() => {
    animatedHeight.value = withDelay(
      delay,
      withTiming(targetHeight, {
        duration: motion.progressDuration,
        easing: progressEasing,
      }),
    );
  }, [animatedHeight, delay, targetHeight]);

  const barStyle = useAnimatedStyle(() => ({
    height: animatedHeight.value,
  }));

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end',
        minWidth: 28,
      }}>
      <Text
        style={[
          dsTypography.caption,
          {
            color: colors.muted,
            marginBottom: dsSpacing[4],
            fontWeight: '700',
          },
        ]}>
        {value > 0 ? value : ''}
      </Text>
      <Animated.View
        style={[
          {
            width: '100%',
            maxWidth: 36,
            borderRadius: radius[8],
            backgroundColor: hasData ? colors.primary : colors.track,
            opacity: value > 0 ? 1 : 0.45,
          },
          barStyle,
        ]}
      />
      <Text
        style={[
          dsTypography.caption,
          {
            color: colors.muted,
            marginTop: dsSpacing[8],
            fontWeight: '600',
          },
        ]}>
        {label}
      </Text>
    </View>
  );
}

export default function ChartPlaceholder({
  title,
  subtitle,
  data,
  colors,
  isDark,
  height = 160,
}: ChartPlaceholderProps) {
  const hasData = data && data.some((bar) => bar.value > 0);
  const maxValue = Math.max(...(data?.map((bar) => bar.value) ?? [0]), 1);
  const bars = useMemo(() => data ?? [], [data]);

  return (
    <View
      style={{
        backgroundColor: colors.surfaceElevated,
        borderRadius: radius[16],
        padding: dsSpacing[16],
        borderWidth: 1,
        borderColor: colors.borderLight,
        ...getShadow('soft', isDark),
      }}>
      <Text style={[dsTypography.subtitle, { color: colors.text }]}>
        {title}
      </Text>
      {subtitle ? (
        <Text
          style={[
            dsTypography.caption,
            { color: colors.muted, marginTop: dsSpacing[4] },
          ]}>
          {subtitle}
        </Text>
      ) : null}

      {bars.length > 0 ? (
        <View
          style={{
            marginTop: dsSpacing[16],
            height,
            flexDirection: 'row',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: dsSpacing[8],
          }}>
          {bars.map((bar, index) => (
            <AnimatedBar
              key={bar.label}
              label={bar.label}
              value={bar.value}
              maxValue={maxValue}
              hasData={Boolean(hasData)}
              chartHeight={height}
              colors={colors}
              delay={index * 40}
            />
          ))}
        </View>
      ) : (
        <View
          style={{
            marginTop: dsSpacing[16],
            height,
            borderRadius: radius[12],
            borderWidth: 1.5,
            borderStyle: 'dashed',
            borderColor: colors.border,
            backgroundColor: colors.surface,
            alignItems: 'center',
            justifyContent: 'center',
            gap: dsSpacing[8],
          }}>
          <Ionicons name="bar-chart-outline" size={28} color={colors.muted} />
          <Text style={[dsTypography.caption, { color: colors.muted }]}>
            Chart coming soon
          </Text>
        </View>
      )}
    </View>
  );
}
