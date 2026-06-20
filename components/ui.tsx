import { type ComponentProps, type ReactNode, useEffect, useState } from 'react';
import {
  Text,
  View,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

import AppButton from './AppButton';
import { PressableScale } from './animations';

import {
  cardRadius,
  type ThemeColors,
  getShadow,
  radius,
  spacing,
  typography,
} from '../constants/theme';

type IconName = ComponentProps<typeof Ionicons>['name'];

type ThemedProps = {
  colors: ThemeColors;
  isDark: boolean;
};

export function PageHeader({
  title,
  subtitle,
  colors,
  right,
}: {
  title: string;
  subtitle?: string;
  colors: ThemeColors;
  right?: ReactNode;
}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginBottom: spacing.lg,
        gap: spacing.md,
      }}>
      <View style={{ flex: 1 }}>
        <Text style={[typography.display, { color: colors.text }]}>{title}</Text>
        {subtitle ? (
          <Text
            style={[
              typography.body,
              { color: colors.muted, marginTop: spacing.xs },
            ]}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {right}
    </View>
  );
}

export function SectionTitle({
  title,
  subtitle,
  colors,
}: {
  title: string;
  subtitle?: string;
  colors: ThemeColors;
}) {
  return (
    <View style={{ marginBottom: spacing.md }}>
      <Text style={[typography.title, { color: colors.text }]}>{title}</Text>
      {subtitle ? (
        <Text
          style={[
            typography.body,
            { color: colors.muted, marginTop: spacing.xs },
          ]}>
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}

export function IconCircle({
  icon,
  backgroundColor,
  iconColor,
  size = 48,
}: {
  icon: IconName;
  backgroundColor: string;
  iconColor: string;
  size?: number;
}) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: radius.full,
        backgroundColor,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Ionicons name={icon} size={size * 0.46} color={iconColor} />
    </View>
  );
}

export function StatCard({
  value,
  label,
  accent,
  icon,
  colors,
  isDark,
}: ThemedProps & {
  value: string | number;
  label: string;
  accent: string;
  icon?: IconName;
}) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.card,
        borderRadius: cardRadius,
        padding: spacing.md,
        borderWidth: 1,
        borderColor: colors.borderLight,
        ...getShadow('soft', isDark),
      }}>
      {icon ? (
        <IconCircle
          icon={icon}
          backgroundColor={accent + '18'}
          iconColor={accent}
          size={40}
        />
      ) : null}
      <Text
        style={{
          fontSize: 28,
          fontWeight: '800',
          color: accent,
          marginTop: icon ? spacing.sm : 0,
          letterSpacing: -0.5,
        }}>
        {value}
      </Text>
      <Text style={[typography.caption, { color: colors.muted, marginTop: 2 }]}>
        {label}
      </Text>
    </View>
  );
}

export function ProgressTrack({
  percent,
  colors,
  height = 10,
  fillColor,
}: {
  percent: number;
  colors: ThemeColors;
  height?: number;
  fillColor?: string;
}) {
  const clamped = Math.min(100, Math.max(0, percent));
  const [trackWidth, setTrackWidth] = useState(0);
  const animatedPercent = useSharedValue(0);

  useEffect(() => {
    animatedPercent.value = withTiming(clamped, { duration: 420 });
  }, [animatedPercent, clamped]);

  const fillStyle = useAnimatedStyle(() => ({
    width: (animatedPercent.value / 100) * trackWidth,
  }));

  return (
    <View
      onLayout={(event) => setTrackWidth(event.nativeEvent.layout.width)}
      style={{
        height,
        backgroundColor: colors.track,
        borderRadius: radius.full,
        overflow: 'hidden',
      }}>
      <Animated.View
        style={[
          {
            height: '100%',
            backgroundColor: fillColor ?? colors.primary,
            borderRadius: radius.full,
          },
          fillStyle,
        ]}
      />
    </View>
  );
}

export function GoalSegments({
  current,
  total,
  colors,
  fillColor,
}: {
  current: number;
  total: number;
  colors: ThemeColors;
  fillColor?: string;
}) {
  const filled = Math.min(total, current);

  return (
    <View style={{ flexDirection: 'row', gap: spacing.xs }}>
      {Array.from({ length: total }, (_, index) => (
        <View
          key={index}
          style={{
            flex: 1,
            height: 10,
            borderRadius: radius.sm,
            backgroundColor:
              index < filled ? (fillColor ?? colors.primary) : colors.track,
          }}
        />
      ))}
    </View>
  );
}

export function SegmentedControl({
  options,
  value,
  onChange,
  colors,
}: {
  options: { key: string; label: string; icon?: IconName }[];
  value: string;
  onChange: (key: string) => void;
  colors: ThemeColors;
}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: colors.surface,
        borderRadius: radius.lg,
        padding: spacing.xs,
        gap: spacing.xs,
      }}>
      {options.map((option) => {
        const selected = value === option.key || (!value && option.key === 'all');

        return (
          <PressableScale
            key={option.key}
            onPress={() => onChange(option.key)}
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
              paddingVertical: spacing.sm,
              borderRadius: radius.md,
              backgroundColor: selected ? colors.card : 'transparent',
              ...(selected ? getShadow('soft', false) : {}),
            }}>
            {option.icon ? (
              <Ionicons
                name={option.icon}
                size={14}
                color={selected ? colors.primary : colors.muted}
              />
            ) : null}
            <Text
              style={{
                fontSize: 13,
                fontWeight: '700',
                color: selected ? colors.primary : colors.muted,
              }}>
              {option.label}
            </Text>
          </PressableScale>
        );
      })}
    </View>
  );
}

export function RatingButton({
  label,
  onPress,
  backgroundColor,
  textColor,
  borderColor,
  icon,
}: {
  label: string;
  onPress: () => void;
  backgroundColor: string;
  textColor: string;
  borderColor?: string;
  icon?: IconName;
}) {
  return (
    <PressableScale
      onPress={onPress}
      style={{
        flex: 1,
        backgroundColor,
        borderRadius: radius.lg,
        paddingVertical: spacing.md + 2,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: borderColor ? 1.5 : 0,
        borderColor,
        minHeight: 60,
      }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        {icon ? <Ionicons name={icon} size={16} color={textColor} /> : null}
        <Text style={[typography.button, { color: textColor, fontSize: 15 }]}>
          {label}
        </Text>
      </View>
    </PressableScale>
  );
}

export function Badge({
  label,
  backgroundColor,
  textColor,
  style,
  icon,
}: {
  label: string;
  backgroundColor: string;
  textColor: string;
  style?: StyleProp<ViewStyle>;
  icon?: IconName;
}) {
  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 4,
          backgroundColor,
          borderRadius: radius.full,
          paddingHorizontal: spacing.sm + 4,
          paddingVertical: 6,
        },
        style,
      ]}>
      {icon ? <Ionicons name={icon} size={12} color={textColor} /> : null}
      <Text style={{ fontSize: 12, fontWeight: '700', color: textColor }}>
        {label}
      </Text>
    </View>
  );
}

export function CompletionStat({
  value,
  label,
  accent,
  icon,
  colors,
  isDark,
}: ThemedProps & {
  value: string | number;
  label: string;
  accent: string;
  icon?: IconName;
}) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.surfaceElevated,
        borderRadius: radius.lg,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.sm,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.borderLight,
        ...getShadow('soft', isDark),
      }}>
      {icon ? (
        <Ionicons
          name={icon}
          size={18}
          color={accent}
          style={{ marginBottom: spacing.xs }}
        />
      ) : null}
      <Text
        style={{
          fontSize: 26,
          fontWeight: '800',
          color: accent,
          letterSpacing: -0.5,
        }}>
        {value}
      </Text>
      <Text
        style={[
          typography.caption,
          { color: colors.muted, textAlign: 'center', marginTop: 2 },
        ]}>
        {label}
      </Text>
    </View>
  );
}

export function IconBadge({
  icon,
  backgroundColor,
  iconColor,
  size = 28,
}: {
  icon: IconName;
  backgroundColor: string;
  iconColor: string;
  size?: number;
}) {
  return <IconCircle icon={icon} backgroundColor={backgroundColor} iconColor={iconColor} size={size * 2} />;
}

export function ScreenHeader({
  title,
  onBack,
  colors,
  right,
}: {
  title: string;
  onBack?: () => void;
  colors: ThemeColors;
  right?: ReactNode;
}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.md,
        paddingBottom: spacing.sm,
      }}>
      {onBack ? (
        <AppButton
          title="Back"
          variant="outline"
          onPress={onBack}
          style={{
            alignSelf: 'flex-start',
            width: 'auto',
            minHeight: undefined,
            paddingVertical: spacing.sm,
            paddingHorizontal: spacing.md,
          }}
        />
      ) : (
        <View style={{ width: 80 }} />
      )}
      <Text style={[typography.subtitle, { color: colors.text }]}>{title}</Text>
      {right ?? <View style={{ width: 80 }} />}
    </View>
  );
}
