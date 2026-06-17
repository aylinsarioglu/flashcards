import { type ComponentProps, type ReactNode, useEffect, useState } from 'react';
import {
  Text,
  TextInput,
  View,
  type PressableProps,
  type StyleProp,
  type TextInputProps,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

import { FadeInView, PressableScale } from './animations';

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

function ButtonLabel({
  label,
  icon,
  color,
  size = 16,
}: {
  label: string;
  icon?: IconName;
  color: string;
  size?: number;
}) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
      {icon ? <Ionicons name={icon} size={size} color={color} /> : null}
      <Text style={[typography.button, { color }]}>{label}</Text>
    </View>
  );
}

export function AppCard({
  children,
  colors,
  isDark,
  style,
  onPress,
  accentColor,
  entranceDelay,
}: ThemedProps & {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: PressableProps['onPress'];
  accentColor?: string;
  entranceDelay?: number;
}) {
  const cardStyle: ViewStyle = {
    backgroundColor: colors.card,
    borderRadius: cardRadius,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
    overflow: 'hidden',
    ...getShadow('card', isDark),
  };

  const content = (
    <>
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
    </>
  );

  const card = onPress ? (
    <PressableScale onPress={onPress} style={[cardStyle, style]}>
      {content}
    </PressableScale>
  ) : (
    <View style={[cardStyle, style]}>{content}</View>
  );

  if (entranceDelay !== undefined) {
    return <FadeInView delay={entranceDelay}>{card}</FadeInView>;
  }

  return card;
}

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

export function PrimaryButton({
  label,
  onPress,
  colors,
  isDark,
  style,
  icon,
  disabled,
}: ThemedProps & {
  label: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  icon?: IconName;
  disabled?: boolean;
}) {
  return (
    <PressableScale
      onPress={onPress}
      disabled={disabled}
      style={[
        {
          backgroundColor: disabled ? colors.track : colors.primary,
          paddingVertical: spacing.md,
          paddingHorizontal: spacing.lg,
          borderRadius: radius.lg,
          alignItems: 'center',
          ...getShadow(disabled ? 'soft' : 'glow', isDark),
        },
        style,
      ]}>
      <ButtonLabel
        label={label}
        icon={icon}
        color={disabled ? colors.muted : colors.onPrimary}
      />
    </PressableScale>
  );
}

export function SecondaryButton({
  label,
  onPress,
  colors,
  isDark,
  style,
  icon,
}: ThemedProps & {
  label: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  icon?: IconName;
}) {
  return (
    <PressableScale
      onPress={onPress}
      style={[
        {
          backgroundColor: colors.surfaceElevated,
          paddingVertical: spacing.md,
          paddingHorizontal: spacing.lg,
          borderRadius: radius.lg,
          alignItems: 'center',
          borderWidth: 1.5,
          borderColor: colors.border,
          ...getShadow('soft', isDark),
        },
        style,
      ]}>
      <ButtonLabel label={label} icon={icon} color={colors.text} />
    </PressableScale>
  );
}

export function GhostButton({
  label,
  onPress,
  colors,
  icon = 'arrow-back',
}: {
  label: string;
  onPress: () => void;
  colors: ThemeColors;
  icon?: IconName;
}) {
  return (
    <PressableScale
      onPress={onPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
        backgroundColor: colors.surface,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        borderRadius: radius.full,
      }}>
      <Ionicons name={icon} size={16} color={colors.primary} />
      <Text style={[typography.caption, { color: colors.primary, fontWeight: '700' }]}>
        {label}
      </Text>
    </PressableScale>
  );
}

export function TextField({
  label,
  value,
  onChangeText,
  placeholder,
  colors,
  isDark,
  multiline,
  style,
  ...rest
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  colors: ThemeColors;
  isDark: boolean;
  multiline?: boolean;
  style?: StyleProp<TextStyle>;
} & Omit<TextInputProps, 'value' | 'onChangeText' | 'placeholder' | 'style'>) {
  return (
    <View style={{ marginBottom: spacing.lg }}>
      <FieldLabel label={label} colors={colors} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        multiline={multiline}
        style={[
          {
            borderWidth: 1.5,
            borderColor: colors.border,
            borderRadius: radius.lg,
            paddingHorizontal: spacing.md,
            paddingVertical: multiline ? spacing.md : 14,
            fontSize: 16,
            backgroundColor: colors.surfaceElevated,
            color: colors.text,
            minHeight: multiline ? 100 : undefined,
            textAlignVertical: multiline ? 'top' : 'center',
            ...getShadow('soft', isDark),
          },
          style,
        ]}
        {...rest}
      />
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
        paddingVertical: spacing.md,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: borderColor ? 1.5 : 0,
        borderColor,
        minHeight: 56,
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

export function FieldLabel({
  label,
  colors,
  style,
}: {
  label: string;
  colors: ThemeColors;
  style?: StyleProp<TextStyle>;
}) {
  return (
    <Text
      style={[
        typography.label,
        { color: colors.muted, marginBottom: spacing.sm },
        style,
      ]}>
      {label}
    </Text>
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
        <GhostButton label="Back" onPress={onBack} colors={colors} />
      ) : (
        <View style={{ width: 80 }} />
      )}
      <Text style={[typography.subtitle, { color: colors.text }]}>{title}</Text>
      {right ?? <View style={{ width: 80 }} />}
    </View>
  );
}
