import { type ReactNode } from 'react';
import {
  Pressable,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  ZoomIn,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

export const motion = {
  pressScale: 0.97,
  cardPressScale: 0.985,
  spring: { damping: 20, stiffness: 320 },
  duration: 240,
  progressDuration: 420,
  stagger: 50,
  flipDuration: 300,
} as const;

export const progressEasing = Easing.out(Easing.cubic);

type PressableScaleProps = {
  children: ReactNode;
  onPress?: PressableProps['onPress'];
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  scaleTo?: number;
};

export function PressableScale({
  children,
  onPress,
  disabled = false,
  style,
  scaleTo = motion.pressScale,
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
          scale.value = withSpring(scaleTo, motion.spring);
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
      entering={FadeIn.delay(delay).duration(motion.duration)}
      style={style}>
      {children}
    </Animated.View>
  );
}

type FadeScreenProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function FadeScreen({ children, style }: FadeScreenProps) {
  return (
    <Animated.View entering={FadeIn.duration(motion.duration)} style={style}>
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
      entering={FadeIn.duration(motion.duration + 40)}
      style={style}>
      {children}
    </Animated.View>
  );
}

export function SessionCompleteHero({ children }: { children: ReactNode }) {
  return (
    <Animated.View
      entering={ZoomIn.delay(60)
        .duration(320)
        .springify()
        .damping(16)}>
      {children}
    </Animated.View>
  );
}

export function SessionCompleteStats({ children }: { children: ReactNode }) {
  return (
    <Animated.View
      entering={FadeInDown.delay(140)
        .duration(motion.duration)
        .springify()
        .damping(20)}>
      {children}
    </Animated.View>
  );
}

export function SessionCompleteActions({ children }: { children: ReactNode }) {
  return (
    <Animated.View
      entering={FadeInDown.delay(200)
        .duration(motion.duration)
        .springify()
        .damping(20)}>
      {children}
    </Animated.View>
  );
}

export { Animated, FadeIn, withTiming };
