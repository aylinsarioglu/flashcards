import { Ionicons } from '@expo/vector-icons';
import { View, useWindowDimensions } from 'react-native';

import { radius as dsRadius } from '../constants/radius';
import { spacing as dsSpacing } from '../constants/spacing';
import { getShadow, radius, spacing, type ThemeColors } from '../constants/theme';

type EmptyLibraryIllustrationProps = {
  colors: ThemeColors;
  isDark: boolean;
  compact?: boolean;
};

export default function EmptyLibraryIllustration({
  colors,
  isDark,
  compact = false,
}: EmptyLibraryIllustrationProps) {
  const { width } = useWindowDimensions();
  const maxSize = compact ? 160 : 200;
  const illustrationSize = Math.min(width * 0.48, maxSize);
  const iconSize = Math.round(illustrationSize * 0.24);

  return (
    <View
      style={{
        width: illustrationSize,
        height: illustrationSize,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: compact ? spacing.md : spacing.lg,
      }}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants">
      <View
        style={{
          position: 'absolute',
          width: illustrationSize * 0.88,
          height: illustrationSize * 0.88,
          borderRadius: radius.full,
          backgroundColor: colors.primarySoft,
          opacity: isDark ? 0.5 : 0.8,
        }}
      />
      <View
        style={{
          position: 'absolute',
          width: illustrationSize * 0.28,
          height: illustrationSize * 0.28,
          borderRadius: radius.full,
          backgroundColor: colors.secondary,
          opacity: 0.22,
          top: illustrationSize * 0.06,
          right: illustrationSize * 0.04,
        }}
      />
      <View
        style={{
          position: 'absolute',
          width: illustrationSize * 0.18,
          height: illustrationSize * 0.18,
          borderRadius: radius.full,
          backgroundColor: colors.accent,
          opacity: 0.28,
          bottom: illustrationSize * 0.1,
          left: illustrationSize * 0.08,
        }}
      />

      <View
        style={{
          width: illustrationSize * 0.58,
          height: illustrationSize * 0.58,
          borderRadius: dsRadius[16] + 4,
          backgroundColor: colors.card,
          borderWidth: 1,
          borderColor: colors.borderLight,
          alignItems: 'center',
          justifyContent: 'center',
          ...getShadow('elevated', isDark),
        }}>
        <View
          style={{
            width: illustrationSize * 0.4,
            height: illustrationSize * 0.4,
            borderRadius: radius.full,
            backgroundColor: colors.primarySoft,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Ionicons name="library" size={iconSize} color={colors.primary} />
        </View>
      </View>

      <View
        style={{
          position: 'absolute',
          top: illustrationSize * 0.1,
          left: illustrationSize * 0.06,
          width: dsSpacing[32],
          height: dsSpacing[40],
          borderRadius: dsRadius[8],
          backgroundColor: colors.secondary,
          opacity: 0.75,
          transform: [{ rotate: '-10deg' }],
        }}
      />
      <View
        style={{
          position: 'absolute',
          bottom: illustrationSize * 0.14,
          right: illustrationSize * 0.06,
          width: dsSpacing[32],
          height: dsSpacing[40],
          borderRadius: dsRadius[8],
          backgroundColor: colors.card,
          borderWidth: 1,
          borderColor: colors.border,
          transform: [{ rotate: '8deg' }],
          ...getShadow('soft', isDark),
        }}
      />

      {[0, 1, 2].map((index) => (
        <Ionicons
          key={index}
          name="sparkles"
          size={14 + index * 2}
          color={index === 1 ? colors.warning : colors.primary}
          style={{
            position: 'absolute',
            opacity: 0.75,
            top: illustrationSize * (0.12 + index * 0.08),
            right: illustrationSize * (0.1 + index * 0.12),
          }}
        />
      ))}
    </View>
  );
}
