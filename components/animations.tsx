import { type ReactNode } from 'react';
import {
  Pressable,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  ZoomIn,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

export const motion = {
  pressScale: 0.97,
  spring: { damping: 18, stiffness: 280 },
  duration: 280,
  stagger: 60,
} as const;

type PressableScaleProps = {
  children: ReactNode;
  onPress?: PressableProps['onPress'];
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function PressableScale({
  children,
  onPress,
  disabled = false,
  style,
}: PressableScaleProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      onPressIn={() => {
        if (!disabled) {
          scale.value = withSpring(motion.pressScale, motion.spring);
        }
      }}
      onPressOut={() => {
        scale.value = withSpring(1, motion.spring);
      }}
      accessibilityRole="button">
      <Animated.View
        style={[style, animatedStyle, disabled ? { opacity: 0.55 } : undefined]}>
        {children}
      </Animated.View>
    </Pressable>
  );
}

type FadeInViewProps = {
  children: ReactNode;
  delay?: number;
  style?: StyleProp<ViewStyle>;
};

export function FadeInView({ children, delay = 0, style }: FadeInViewProps) {
  return (
    <Animated.View
      entering={FadeInDown.delay(delay)
        .duration(motion.duration)
        .springify()
        .damping(20)}
      style={style}>
      {children}
    </Animated.View>
  );
}

type SessionCompleteAnimationProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function SessionCompleteAnimation({
  children,
  style,
}: SessionCompleteAnimationProps) {
  return (
    <Animated.View
      entering={FadeIn.duration(motion.duration + 80)}
      style={style}>
      {children}
    </Animated.View>
  );
}

export function SessionCompleteHero({ children }: { children: ReactNode }) {
  return (
    <Animated.View
      entering={ZoomIn.delay(80)
        .duration(360)
        .springify()
        .damping(14)}>
      {children}
    </Animated.View>
  );
}

export function SessionCompleteStats({ children }: { children: ReactNode }) {
  return (
    <Animated.View
      entering={FadeInDown.delay(180)
        .duration(motion.duration)
        .springify()
        .damping(18)}>
      {children}
    </Animated.View>
  );
}

export function SessionCompleteActions({ children }: { children: ReactNode }) {
  return (
    <Animated.View
      entering={FadeInDown.delay(260)
        .duration(motion.duration)
        .springify()
        .damping(18)}>
      {children}
    </Animated.View>
  );
}

// Re-export for layout entry
export { Animated, FadeIn };
