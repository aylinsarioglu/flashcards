import {
  ActivityIndicator,
  Text,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { PressableScale } from './animations';
import { darkColors, lightColors, type ColorPalette } from '../constants/colors';
import { radius } from '../constants/radius';
import { getShadows, type ShadowToken } from '../constants/shadows';
import { spacing } from '../constants/spacing';
import { typography } from '../constants/typography';
import { useTheme } from '../storage/ThemeContext';

export type AppButtonVariant = 'primary' | 'secondary' | 'danger' | 'outline';

export type AppButtonProps = {
  title: string;
  onPress: PressableProps['onPress'];
  variant?: AppButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
};

type VariantStyles = {
  backgroundColor: string;
  textColor: string;
  borderColor: string;
  borderWidth: number;
  shadow: ShadowToken;
};

const onFilledText = '#FFFFFF';

function getVariantStyles(
  palette: ColorPalette,
  variant: AppButtonVariant,
  isDark: boolean,
  isDisabled: boolean,
): VariantStyles {
  const { buttonShadow, cardShadow } = getShadows(isDark);

  if (isDisabled) {
    return {
      backgroundColor: palette.surface,
      textColor: palette.textSecondary,
      borderColor: palette.border,
      borderWidth: 1,
      shadow: cardShadow,
    };
  }

  if (variant === 'primary') {
    return {
      backgroundColor: palette.primary,
      textColor: onFilledText,
      borderColor: palette.primary,
      borderWidth: 0,
      shadow: buttonShadow,
    };
  }

  if (variant === 'secondary') {
    return {
      backgroundColor: palette.secondary,
      textColor: onFilledText,
      borderColor: palette.secondary,
      borderWidth: 0,
      shadow: buttonShadow,
    };
  }

  if (variant === 'danger') {
    return {
      backgroundColor: palette.danger,
      textColor: onFilledText,
      borderColor: palette.danger,
      borderWidth: 0,
      shadow: buttonShadow,
    };
  }

  return {
    backgroundColor: 'transparent',
    textColor: palette.primary,
    borderColor: palette.primary,
    borderWidth: 1.5,
    shadow: cardShadow,
  };
}

export default function AppButton({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
}: AppButtonProps) {
  const { isDark } = useTheme();
  const palette = isDark ? darkColors : lightColors;
  const isInactive = disabled || loading;
  const variantStyles = getVariantStyles(palette, variant, isDark, isInactive);

  return (
    <PressableScale
      onPress={onPress}
      disabled={isInactive}
      style={[
        {
          alignSelf: 'stretch',
          width: '100%',
          minHeight: spacing[40] + spacing[8],
          paddingVertical: spacing[16],
          paddingHorizontal: spacing[24],
          borderRadius: radius[16],
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: variantStyles.backgroundColor,
          borderColor: variantStyles.borderColor,
          borderWidth: variantStyles.borderWidth,
          ...variantStyles.shadow,
        },
        style,
      ]}>
      {loading ? (
        <ActivityIndicator color={variantStyles.textColor} size="small" />
      ) : (
        <Text style={[typography.button, { color: variantStyles.textColor }]}>
          {title}
        </Text>
      )}
    </PressableScale>
  );
}
