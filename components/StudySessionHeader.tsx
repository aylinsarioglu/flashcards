import { Text, View } from 'react-native';

import ProgressBar from './ProgressBar';
import { Badge } from './ui';
import { radius } from '../constants/radius';
import { spacing as dsSpacing } from '../constants/spacing';
import { typography as dsTypography } from '../constants/typography';
import type { ThemeColors } from '../constants/theme';

type StudySessionHeaderProps = {
  deckName: string;
  current: number;
  total: number;
  colors: ThemeColors;
};

export default function StudySessionHeader({
  deckName,
  current,
  total,
  colors,
}: StudySessionHeaderProps) {
  const percent = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <View style={{ gap: dsSpacing[12] }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: dsSpacing[12],
        }}>
        <Text
          style={[
            dsTypography.heading,
            { color: colors.text, fontSize: 26, letterSpacing: -0.5, flex: 1 },
          ]}>
          Study Session
        </Text>
        <Badge
          label={deckName}
          icon="folder"
          backgroundColor={colors.primarySoft}
          textColor={colors.primary}
        />
      </View>

      <View
        style={{
          backgroundColor: colors.surfaceElevated,
          borderRadius: radius[16],
          padding: dsSpacing[12],
          borderWidth: 1,
          borderColor: colors.borderLight,
          gap: dsSpacing[8],
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'baseline',
            justifyContent: 'space-between',
          }}>
          <Text style={[dsTypography.caption, { color: colors.muted, fontWeight: '600' }]}>
            {current} of {total} cards
          </Text>
          <Text
            style={[
              dsTypography.subtitle,
              { color: colors.primary, fontWeight: '800', fontSize: 20 },
            ]}>
            {percent}%
          </Text>
        </View>
        <ProgressBar current={current} total={total} variant="compact" />
      </View>
    </View>
  );
}
