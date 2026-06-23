import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import StatCard from './StatCard';
import { spacing, typography, type ThemeColors } from '../constants/theme';
import type { ReviewHistoryEntry } from '../storage/studyStatsStorage';

function formatHistoryLabel(dateKey: string) {
  const today = new Date().toISOString().slice(0, 10);
  const yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterday = yesterdayDate.toISOString().slice(0, 10);

  if (dateKey === today) {
    return 'Today';
  }

  if (dateKey === yesterday) {
    return 'Yesterday';
  }

  return dateKey;
}

type StatsOverviewProps = {
  studyTimeMinutes: number;
  cardsLearned: number;
  currentStreak: number;
  favoriteDeck: string;
  accuracy: number | null;
  reviewHistory: ReviewHistoryEntry[];
  colors: ThemeColors;
  isDark: boolean;
};

export default function StatsOverview({
  studyTimeMinutes,
  cardsLearned,
  currentStreak,
  favoriteDeck,
  accuracy,
  reviewHistory,
  colors,
  isDark,
}: StatsOverviewProps) {
  return (
    <View style={{ gap: spacing.md }}>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
        <StatCard
          label="Study Time"
          value={studyTimeMinutes > 0 ? `${studyTimeMinutes} min` : '— min'}
          icon="time-outline"
          accent={colors.secondary}
          colors={colors}
          isDark={isDark}
        />
        <StatCard
          label="Cards Learned"
          value={cardsLearned}
          icon="checkmark-done-outline"
          accent={colors.success}
          colors={colors}
          isDark={isDark}
        />
        <StatCard
          label="Current Streak"
          value={currentStreak}
          icon="flame-outline"
          accent={colors.warning}
          colors={colors}
          isDark={isDark}
        />
        <StatCard
          label="Favorite Deck"
          value={favoriteDeck}
          icon="heart-outline"
          accent={colors.accent}
          colors={colors}
          isDark={isDark}
        />
        <StatCard
          label="Accuracy"
          value={accuracy === null ? '—%' : `${accuracy}%`}
          icon="analytics-outline"
          accent={colors.primary}
          colors={colors}
          isDark={isDark}
        />
      </View>

      <View
        style={{
          backgroundColor: colors.surfaceElevated,
          borderRadius: spacing.md,
          padding: spacing.md,
          borderWidth: 1,
          borderColor: colors.borderLight,
        }}>
        <Text style={[typography.subtitle, { color: colors.text, marginBottom: spacing.sm }]}>
          Review History
        </Text>
        {reviewHistory.length > 0 ? (
          <View style={{ gap: spacing.sm }}>
            {reviewHistory.slice(0, 7).map((entry) => (
              <View
                key={entry.date}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: spacing.sm,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: spacing.sm,
                    flex: 1,
                  }}>
                  <Ionicons name="calendar-outline" size={16} color={colors.muted} />
                  <Text style={[typography.body, { color: colors.text }]}>
                    {formatHistoryLabel(entry.date)}
                  </Text>
                </View>
                <Text style={[typography.caption, { color: colors.muted }]}>
                  {entry.reviewed} reviewed · {entry.good} good
                </Text>
              </View>
            ))}
          </View>
        ) : (
          <Text style={[typography.body, { color: colors.muted }]}>
            No reviews yet. Start a study session to build your history.
          </Text>
        )}
      </View>
    </View>
  );
}
