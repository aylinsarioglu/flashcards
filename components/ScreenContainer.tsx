import { type ReactNode } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeIn } from 'react-native-reanimated';

import { layout } from '../constants/theme';
import { useTheme } from '../storage/ThemeContext';

type ScreenContainerProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export default function ScreenContainer({
  children,
  style,
}: ScreenContainerProps) {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <Animated.View
        entering={FadeIn.duration(240)}
        style={[
          {
            width: '100%',
            maxWidth: layout.maxWidth,
            alignSelf: 'center',
            flex: 1,
          },
          style,
        ]}>
        {children}
      </Animated.View>
    </SafeAreaView>
  );
}
