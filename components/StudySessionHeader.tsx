import { Text, View } from 'react-native';

import ProgressBar from './ProgressBar';
import { Badge } from './ui';
import { spacing as dsSpacing } from '../constants/spacing';
import { typography as dsTypography } from '../constants/typography';
import type { ThemeColors } from '../constants/theme';

type StudySessionHeaderProps = {
  deckName: string;
  current: number;
  total: number;
  cardsRemaining: number;
  accuracy: number | null;
  colors: ThemeColors;
};

function StatPill({
  label,
  value,
  colors,
}: {
  label: string;
  value: string;
  colors: ThemeColors;
}) {
  return (
    <View style={{ flex: 1, alignItems: 'center' }}>
      <Text
        style={[
          dsTypography.subtitle,
          {
            color: colors.text,
            fontSize: 17,
            fontWeight: '800',
            textAlign: 'center',
          },
        ]}>
        {value}
      </Text>
      <Text
        style={[
          dsTypography.caption,
          {
            color: colors.muted,
            marginTop: dsSpacing[4],
            textAlign: 'center',
          },
        ]}>
        {label}
      </Text>
    </View>
  );
}

export default function StudySessionHeader({
  deckName,
  current,
  total,
  cardsRemaining,
  accuracy,
  colors,
}: StudySessionHeaderProps) {
  return (
    <View style={{ gap: dsSpacing[16] }}>
      <Badge
        label={deckName}
        icon="folder"
        backgroundColor={colors.primarySoft}
        textColor={colors.primary}
      />

      <ProgressBar current={current} total={total} />

      <View
        style={{
          flexDirection: 'row',
          backgroundColor: colors.surfaceElevated,
          borderRadius: dsSpacing[16],
          paddingVertical: dsSpacing[12],
          paddingHorizontal: dsSpacing[8],
          borderWidth: 1,
          borderColor: colors.borderLight,
        }}>
        <StatPill
          label="Cards Remaining"
          value={String(cardsRemaining)}
          colors={colors}
        />
        <View
          style={{
            width: 1,
            backgroundColor: colors.border,
            marginVertical: dsSpacing[4],
          }}
        />
        <StatPill
          label="Accuracy"
          value={accuracy === null ? '—%' : `${accuracy}%`}
          colors={colors}
        />
        <View
          style={{
            width: 1,
            backgroundColor: colors.border,
            marginVertical: dsSpacing[4],
          }}
        />
        <StatPill label="Study Time" value="— min" colors={colors} />
      </View>
    </View>
  );
}
