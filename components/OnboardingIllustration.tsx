import { Ionicons } from '@expo/vector-icons';
import { View, useWindowDimensions } from 'react-native';

import { radius as dsRadius } from '../constants/radius';
import { radius } from '../constants/theme';
import { spacing } from '../constants/spacing';
import { getShadow, type ThemeColors } from '../constants/theme';

export type OnboardingIllustrationVariant = 'welcome' | 'offline' | 'ready';

type OnboardingIllustrationProps = {
  variant: OnboardingIllustrationVariant;
  colors: ThemeColors;
  isDark: boolean;
};

type VariantConfig = {
  icon: keyof typeof Ionicons.glyphMap;
  accent: keyof ThemeColors;
  accentSoft: keyof ThemeColors;
  secondaryAccent: keyof ThemeColors;
};

const VARIANTS: Record<OnboardingIllustrationVariant, VariantConfig> = {
  welcome: {
    icon: 'book',
    accent: 'primary',
    accentSoft: 'primarySoft',
    secondaryAccent: 'secondary',
  },
  offline: {
    icon: 'cloud-offline',
    accent: 'secondary',
    accentSoft: 'secondarySoft',
    secondaryAccent: 'primary',
  },
  ready: {
    icon: 'rocket',
    accent: 'accent',
    accentSoft: 'accentSoft',
    secondaryAccent: 'warning',
  },
};

export default function OnboardingIllustration({
  variant,
  colors,
  isDark,
}: OnboardingIllustrationProps) {
  const { width, height } = useWindowDimensions();
  const config = VARIANTS[variant];
  const accentColor = colors[config.accent];
  const accentSoftColor = colors[config.accentSoft];
  const secondaryColor = colors[config.secondaryAccent];

  const illustrationSize = Math.min(width * 0.72, height * 0.32, 280);
  const iconSize = Math.round(illustrationSize * 0.22);

  return (
    <View
      style={{
        width: illustrationSize,
        height: illustrationSize,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants">
      <View
        style={{
          position: 'absolute',
          width: illustrationSize * 0.92,
          height: illustrationSize * 0.92,
          borderRadius: radius.full,
          backgroundColor: accentSoftColor,
          opacity: isDark ? 0.55 : 0.85,
          transform: [{ translateX: -illustrationSize * 0.08 }],
        }}
      />
      <View
        style={{
          position: 'absolute',
          width: illustrationSize * 0.38,
          height: illustrationSize * 0.38,
          borderRadius: radius.full,
          backgroundColor: secondaryColor,
          opacity: isDark ? 0.35 : 0.2,
          top: illustrationSize * 0.04,
          right: illustrationSize * 0.02,
        }}
      />
      <View
        style={{
          position: 'absolute',
          width: illustrationSize * 0.22,
          height: illustrationSize * 0.22,
          borderRadius: radius.full,
          backgroundColor: accentColor,
          opacity: 0.25,
          bottom: illustrationSize * 0.1,
          left: illustrationSize * 0.06,
        }}
      />

      <View
        style={{
          width: illustrationSize * 0.62,
          height: illustrationSize * 0.62,
          borderRadius: dsRadius[16] + 8,
          backgroundColor: colors.card,
          borderWidth: 1,
          borderColor: colors.borderLight,
          alignItems: 'center',
          justifyContent: 'center',
          ...getShadow('elevated', isDark),
        }}>
        <View
          style={{
            width: illustrationSize * 0.44,
            height: illustrationSize * 0.44,
            borderRadius: radius.full,
            backgroundColor: accentSoftColor,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Ionicons name={config.icon} size={iconSize} color={accentColor} />
        </View>
      </View>

      {variant === 'welcome' ? (
        <>
          <View
            style={{
              position: 'absolute',
              top: illustrationSize * 0.14,
              right: illustrationSize * 0.08,
              width: spacing[40],
              height: spacing[32],
              borderRadius: dsRadius[8],
              backgroundColor: colors.card,
              borderWidth: 1,
              borderColor: colors.border,
              transform: [{ rotate: '8deg' }],
              ...getShadow('soft', isDark),
            }}
          />
          <View
            style={{
              position: 'absolute',
              bottom: illustrationSize * 0.16,
              left: illustrationSize * 0.04,
              width: spacing[32],
              height: spacing[40],
              borderRadius: dsRadius[8],
              backgroundColor: secondaryColor,
              opacity: 0.85,
              transform: [{ rotate: '-12deg' }],
            }}
          />
        </>
      ) : null}

      {variant === 'offline' ? (
        <View
          style={{
            position: 'absolute',
            bottom: illustrationSize * 0.12,
            right: illustrationSize * 0.1,
            flexDirection: 'row',
            gap: spacing[8],
          }}>
          {[0.7, 1, 0.55].map((scale, index) => (
            <View
              key={index}
              style={{
                width: spacing[8],
                height: spacing[24] * scale,
                borderRadius: radius.full,
                backgroundColor: accentColor,
                opacity: 0.35 + index * 0.15,
              }}
            />
          ))}
        </View>
      ) : null}

      {variant === 'ready' ? (
        <>
          {[0, 1, 2, 3].map((index) => (
            <View
              key={index}
              style={{
                position: 'absolute',
                width: spacing[8],
                height: spacing[8],
                borderRadius: radius.full,
                backgroundColor: index % 2 === 0 ? accentColor : secondaryColor,
                opacity: 0.7,
                top:
                  illustrationSize * 0.08 +
                  Math.sin((index * Math.PI) / 2) * illustrationSize * 0.04,
                left:
                  illustrationSize * 0.12 +
                  index * illustrationSize * 0.18,
              }}
            />
          ))}
        </>
      ) : null}
    </View>
  );
}
