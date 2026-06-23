import { useMemo } from 'react';
import { ScrollView, Text, View, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import AppCard from '../components/AppCard';
import ChartPlaceholder from '../components/ChartPlaceholder';
import ScreenContainer from '../components/ScreenContainer';
import StatCard from '../components/StatCard';
import { FadeInView, motion, PressableScale } from '../components/animations';
import { SectionTitle } from '../components/ui';
import { spacing as dsSpacing } from '../constants/spacing';
import { typography as dsTypography } from '../constants/typography';
import { layout, spacing, typography } from '../constants/theme';
import { useCards } from '../storage/CardsContext';
import { getWeeklyProgress } from '../storage/studyStatsStorage';
import { useTheme } from '../storage/ThemeContext';

type CardWithFavorite = { favorite?: boolean };

function getColumnBasis(width: number) {
  if (width >= 900) {
    return '22%';
  }

  if (width >= 600) {
    return '30%';
  }

  return '46%';
}

export default function StatisticsScreen() {
  const { colors, isDark } = useTheme();
  const { width } = useWindowDimensions();
  const { cards, currentStreak, studyStats, getStudyAccuracy } = useCards();

  const columnBasis = getColumnBasis(width);

  const cardStats = useMemo(() => {
    const learned = cards.filter((card) => card.learned).length;
    const favorites = cards.filter(
      (card) => (card as CardWithFavorite).favorite === true,
    ).length;

    return {
      total: cards.length,
      learned,
      learning: cards.length - learned,
      favorites,
    };
  }, [cards]);

  const accuracy = getStudyAccuracy();
  const weeklyProgress = useMemo(
    () => getWeeklyProgress(studyStats.history),
    [studyStats.history],
  );
  const weeklyChartData = weeklyProgress.map((day) => ({
    label: day.label,
    value: day.reviewed,
  }));
  const weeklyTotal = weeklyProgress.reduce((sum, day) => sum + day.reviewed, 0);

  return (
    <ScreenContainer style={{ paddingHorizontal: layout.contentPadding }}>
      <ScrollView
        contentContainerStyle={{
          paddingTop: dsSpacing[24],
          paddingBottom: dsSpacing[40],
        }}
        showsVerticalScrollIndicator={false}>
        <PressableScale
          onPress={() => router.back()}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            alignSelf: 'flex-start',
            gap: dsSpacing[4],
            marginBottom: dsSpacing[16],
            paddingVertical: dsSpacing[4],
            paddingRight: dsSpacing[8],
          }}>
          <Ionicons name="chevron-back" size={22} color={colors.primary} />
          <Text
            style={[
              typography.subtitle,
              { color: colors.primary, fontWeight: '700' },
            ]}>
            Back
          </Text>
        </PressableScale>

        <Text
          style={[
            dsTypography.heading,
            { color: colors.text, fontSize: 32, marginBottom: dsSpacing[8] },
          ]}>
          Statistics
        </Text>
        <Text
          style={[
            dsTypography.body,
            { color: colors.muted, marginBottom: dsSpacing[24] },
          ]}>
          Track your cards, sessions, and weekly progress.
        </Text>

        <SectionTitle title="Card Library" colors={colors} />
        <FadeInView delay={0}>
          <AppCard style={{ marginBottom: spacing.lg }}>
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: dsSpacing[12],
              }}>
              <StatCard
                label="Total Cards"
                value={cardStats.total}
                icon="albums-outline"
                accent={colors.primary}
                colors={colors}
                isDark={isDark}
                style={{ flexBasis: columnBasis }}
              />
              <StatCard
                label="Learned Cards"
                value={cardStats.learned}
                icon="checkmark-done-outline"
                accent={colors.success}
                colors={colors}
                isDark={isDark}
                style={{ flexBasis: columnBasis }}
              />
              <StatCard
                label="Learning Cards"
                value={cardStats.learning}
                icon="school-outline"
                accent={colors.secondary}
                colors={colors}
                isDark={isDark}
                style={{ flexBasis: columnBasis }}
              />
              <StatCard
                label="Favorite Cards"
                value={cardStats.favorites}
                icon="heart-outline"
                accent={colors.accent}
                colors={colors}
                isDark={isDark}
                style={{ flexBasis: columnBasis }}
              />
            </View>
          </AppCard>
        </FadeInView>

        <SectionTitle title="Performance" colors={colors} />
        <FadeInView delay={motion.stagger}>
          <AppCard style={{ marginBottom: spacing.lg }}>
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: dsSpacing[12],
              }}>
              <StatCard
                label="Current Streak"
                value={currentStreak}
                icon="flame-outline"
                accent={colors.warning}
                colors={colors}
                isDark={isDark}
                style={{ flexBasis: columnBasis }}
              />
              <StatCard
                label="Study Sessions"
                value={studyStats.totalSessions}
                icon="book-outline"
                accent={colors.primary}
                colors={colors}
                isDark={isDark}
                style={{ flexBasis: columnBasis }}
              />
              <StatCard
                label="Accuracy"
                value={accuracy === null ? '—%' : `${accuracy}%`}
                icon="analytics-outline"
                accent={colors.secondary}
                colors={colors}
                isDark={isDark}
                style={{ flexBasis: columnBasis }}
              />
            </View>
          </AppCard>
        </FadeInView>

        <SectionTitle title="Weekly Progress" colors={colors} />
        <FadeInView delay={motion.stagger * 2}>
          <ChartPlaceholder
            title="Cards Reviewed"
            subtitle={
              weeklyTotal > 0
                ? `${weeklyTotal} cards reviewed in the last 7 days`
                : 'Complete study sessions to build your weekly chart'
            }
            data={weeklyChartData}
            colors={colors}
            isDark={isDark}
          />
        </FadeInView>
      </ScrollView>
    </ScreenContainer>
  );
}
