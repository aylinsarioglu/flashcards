import { type ReactNode } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';

type ContentContainerProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export default function ContentContainer({
  children,
  style,
}: ContentContainerProps) {
  return (
    <View
      style={[
        {
          width: '100%',
          maxWidth: 500,
          alignSelf: 'center',
        },
        style,
      ]}>
      {children}
    </View>
  );
}
