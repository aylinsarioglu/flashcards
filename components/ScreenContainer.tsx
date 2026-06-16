import { type ReactNode } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type ScreenContainerProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export default function ScreenContainer({
  children,
  style,
}: ScreenContainerProps) {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={[
          {
            width: '100%',
            maxWidth: 500,
            alignSelf: 'center',
            flex: 1,
          },
          style,
        ]}>
        {children}
      </View>
    </SafeAreaView>
  );
}
