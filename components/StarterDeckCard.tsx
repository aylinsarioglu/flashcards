import { type ComponentProps } from 'react';
import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import AppButton from './AppButton';
import AppCard from './AppCard';
import { IconCircle } from './ui';
import { spacing as dsSpacing } from '../constants/spacing';
import { typography as dsTypography } from '../constants/typography';
import { spacing, type ThemeColors } from '../constants/theme';

type IconName = ComponentProps<typeof Ionicons>['name'];

export type StarterDeckCardProps = {
  name: string;
  cardCount: number;
  icon: IconName;
  accentColor: string;
  accentSoft: string;
  colors: ThemeColors;
  onStudy: () => void;
};

export default function StarterDeckCard({
  name,
  cardCount,
  icon,
  accentColor,
  accentSoft,
  colors,
  onStudy,
}: StarterDeckCardProps) {
  const cardLabel = cardCount === 1 ? '1 card' : `${cardCount} cards`;

  return (
    <AppCard accentColor={accentColor} style={{ flex: 1, minWidth: 0 }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'flex-start',
          gap: spacing.md,
          marginBottom: spacing.md,
        }}>
        <IconCircle
          icon={icon}
          backgroundColor={accentSoft}
          iconColor={accentColor}
        />
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text
            numberOfLines={2}
            style={[dsTypography.subtitle, { color: colors.text }]}>
            {name}
          </Text>
          <Text
            style={[
              dsTypography.caption,
              { color: colors.muted, marginTop: dsSpacing[4] },
            ]}>
            {cardLabel}
          </Text>
        </View>
      </View>
      <AppButton title="Study" onPress={onStudy} />
    </AppCard>
  );
}
