import { useEffect, useState } from 'react';
import {
  Text,
  TextInput,
  View,
  type KeyboardTypeOptions,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { darkColors, lightColors } from '../constants/colors';
import { radius } from '../constants/radius';
import { getShadows } from '../constants/shadows';
import { spacing } from '../constants/spacing';
import { typography } from '../constants/typography';
import { useTheme } from '../storage/ThemeContext';

export type AppInputProps = {
  label: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  multiline?: boolean;
  keyboardType?: KeyboardTypeOptions;
  error?: string;
  style?: StyleProp<ViewStyle>;
};

const LABEL_ANIMATION_MS = 180;

export default function AppInput({
  label,
  placeholder,
  value,
  onChangeText,
  multiline = false,
  keyboardType,
  error,
  style,
}: AppInputProps) {
  const { isDark } = useTheme();
  const palette = isDark ? darkColors : lightColors;
  const { cardShadow } = getShadows(isDark);

  const [focused, setFocused] = useState(false);
  const isActive = focused || value.length > 0;
  const hasError = Boolean(error);

  const labelProgress = useSharedValue(isActive ? 1 : 0);

  useEffect(() => {
    labelProgress.value = withTiming(isActive ? 1 : 0, {
      duration: LABEL_ANIMATION_MS,
    });
  }, [isActive, labelProgress]);

  const labelAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(labelProgress.value, [0, 1], [multiline ? 18 : 0, -26]),
      },
      {
        scale: interpolate(labelProgress.value, [0, 1], [1, 0.85]),
      },
    ],
  }));

  const borderColor = hasError
    ? palette.danger
    : focused
      ? palette.primary
      : palette.border;

  return (
    <View style={[{ marginBottom: spacing[20], width: '100%' }, style]}>
      <View
        style={{
          position: 'relative',
          borderWidth: 1.5,
          borderColor,
          borderRadius: radius[16],
          backgroundColor: palette.card,
          paddingHorizontal: spacing[16],
          paddingTop: spacing[20],
          paddingBottom: spacing[12],
          minHeight: multiline ? spacing[40] * 2.5 : spacing[40] + spacing[12],
          ...cardShadow,
        }}>
        <Animated.Text
          pointerEvents="none"
          style={[
            typography.caption,
            {
              position: 'absolute',
              left: spacing[16],
              top: spacing[20],
              color: hasError
                ? palette.danger
                : focused
                  ? palette.primary
                  : palette.textSecondary,
              backgroundColor: palette.card,
              paddingHorizontal: spacing[4],
              zIndex: 1,
            },
            labelAnimatedStyle,
          ]}>
          {label}
        </Animated.Text>

        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={isActive ? placeholder : undefined}
          placeholderTextColor={palette.textSecondary}
          multiline={multiline}
          keyboardType={keyboardType}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={[
            typography.body,
            {
              color: palette.text,
              paddingTop: multiline ? spacing[8] : spacing[4],
              paddingBottom: 0,
              minHeight: multiline ? spacing[40] * 1.5 : undefined,
              textAlignVertical: multiline ? 'top' : 'center',
            },
          ]}
        />
      </View>

      {hasError ? (
        <Text
          style={[
            typography.caption,
            {
              color: palette.danger,
              marginTop: spacing[8],
              marginLeft: spacing[4],
            },
          ]}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}
