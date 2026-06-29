import { Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../storage/ThemeContext';
import { speakEnglish } from '../utils/speech';

type SpeakButtonProps = {
  text: string;
};

export default function SpeakButton({ text }: SpeakButtonProps) {
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={(event) => {
        event?.stopPropagation?.();
        speakEnglish(text);
      }}
      hitSlop={10}
      accessibilityRole="button"
      accessibilityLabel="Read English text aloud"
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: colors.primarySoft,
          borderColor: colors.borderLight,
          opacity: pressed ? 0.75 : 1,
        },
      ]}>
      <Ionicons name="volume-high" size={20} color={colors.primary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    flexShrink: 0,
  },
});
