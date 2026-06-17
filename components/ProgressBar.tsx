import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import {
  radius,
  spacing,
  typography,
} from '../constants/theme';
import { useTheme } from '../storage/ThemeContext';

type ProgressBarProps = {
  current: number;
  total: number;
};

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const { colors } = useTheme();
  const progress = total > 0 ? current / total : 0;
  const percent = Math.round(progress * 100);
  const [trackWidth, setTrackWidth] = useState(0);
  const animatedPercent = useSharedValue(0);

  useEffect(() => {
    animatedPercent.value = withTiming(percent, { duration: 420 });
  }, [animatedPercent, percent]);

  const fillStyle = useAnimatedStyle(() => ({
    width: (animatedPercent.value / 100) * trackWidth,
  }));

  return (
    <View style={{ width: '100%' }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: spacing.sm,
        }}>
        <Text style={[typography.caption, { color: colors.muted, fontWeight: '600' }]}>
          Session progress
        </Text>
        <View
          style={{
            backgroundColor: colors.primarySoft,
            paddingHorizontal: spacing.sm,
            paddingVertical: 2,
            borderRadius: radius.full,
          }}>
          <Text style={[typography.caption, { color: colors.primary, fontWeight: '800' }]}>
            {percent}%
          </Text>
        </View>
      </View>
      <View
        onLayout={(event) => setTrackWidth(event.nativeEvent.layout.width)}
        style={{
          width: '100%',
          height: 12,
          backgroundColor: colors.track,
          borderRadius: radius.full,
          overflow: 'hidden',
        }}>
        <Animated.View
          style={[
            {
              height: '100%',
              backgroundColor: colors.primary,
              borderRadius: radius.full,
            },
            fillStyle,
          ]}
        />
      </View>
      <Text
        style={[
          typography.caption,
          {
            color: colors.muted,
            marginTop: spacing.sm,
            textAlign: 'center',
            fontWeight: '600',
          },
        ]}>
        {current} of {total} cards
      </Text>
    </View>
  );
}
