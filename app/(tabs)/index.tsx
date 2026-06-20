import { useMemo } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import AppButton from '../../components/AppButton';
import AppCard from '../../components/AppCard';
import ScreenContainer from '../../components/ScreenContainer';
import { FadeInView, motion } from '../../components/animations';
import {
  Badge,
  GoalSegments,
  IconCircle,
  PageHeader,
  ProgressTrack,
  SectionTitle,
  StatCard,
} from '../../components/ui';
import { layout, spacing, typography } from '../../constants/theme';
import { useCards } from '../../storage/CardsContext';
import { useTheme } from '../../storage/ThemeContext';

function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) {
    return 'Good Morning';
  }

  if (hour < 17) {
    return 'Good Afternoon';
  }

  return 'Good Evening';
}

export default function HomeScreen() {
  const {
    cards,
    dailyProgress,
    dailyGoal,
    currentStreak,
    continueLearning,
    isContinueLearningLoaded,
  } = useCards();
  const { colors, isDark } = useTheme();

  const reviewedToday = dailyProgress.cardsReviewedToday;
  const goalProgressPercent =
    dailyGoal > 0
      ? Math.min(100, Math.round((reviewedToday / dailyGoal) * 100))
      : 0;

  const deckList = useMemo(() => {
    const grouped = cards.reduce<Record<string, { total: number; learned: number }>>(
      (acc, card) => {
        if (!acc[card.deck]) {
          acc[card.deck] = { total: 0, learned: 0 };
        }

        acc[card.deck].total += 1;
        if (card.learned) {
          acc[card.deck].learned += 1;
        }

        return acc;
      },
      {},
    );

    return Object.entries(grouped)
      .map(([name, stats]) => ({
        name,
        total: stats.total,
        learned: stats.learned,
        progressPercent:
          stats.total > 0 ? Math.round((stats.learned / stats.total) * 100) : 0,
      }))
      .sort((a, b) => b.total - a.total);
  }, [cards]);

  const wordOfTheDay = useMemo(() => {
    if (cards.length === 0) {
      return null;
    }

    const daySeed = Number(new Date().toISOString().slice(8, 10));
    const card = cards[daySeed % cards.length];

    return {
      front: card.front,
      back: card.back,
      deck: card.deck,
    };
  }, [cards]);

  const recentActivity = useMemo(() => {
    const items: string[] = [];

    if (reviewedToday > 0) {
      items.push(`Reviewed ${reviewedToday} cards today`);
    }

    if (currentStreak > 0) {
      items.push(`${currentStreak}-day streak is active`);
    }

    if (continueLearning?.deck) {
      items.push(`Last studied deck: ${continueLearning.deck}`);
    }

    if (items.length === 0) {
      items.push('No activity yet - start a quick study session.');
    }

    return items.slice(0, 3);
  }, [continueLearning?.deck, currentStreak, reviewedToday]);

  const continueSession = useMemo(() => {
    if (!isContinueLearningLoaded || !continueLearning) {
      return null;
    }

    const deckCards = cards.filter((card) => card.deck === continueLearning.deck);

    if (deckCards.length === 0) {
      return null;
    }

    const learned = deckCards.filter((card) => card.learned).length;
    const savedIndex = Math.min(
      continueLearning.cardIndex,
      Math.max(0, deckCards.length - 1),
    );

    return {
      name: continueLearning.deck,
      total: deckCards.length,
      learned,
      cardIndex: savedIndex,
      progressPercent:
        deckCards.length > 0
          ? Math.round((learned / deckCards.length) * 100)
          : 0,
    };
  }, [cards, continueLearning, isContinueLearningLoaded]);

  return (
    <ScreenContainer style={{ paddingHorizontal: layout.contentPadding }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingTop: spacing.lg,
          paddingBottom: spacing.xxl,
        }}
        showsVerticalScrollIndicator={false}>
        <PageHeader
          title={`${getGreeting()} 👋`}
          subtitle="Keep your streak alive and learn something new today."
          colors={colors}
        />

        <SectionTitle title="Today's Goal" colors={colors} />

        <FadeInView delay={0}>
          <AppCard
            accentColor={colors.primary}
            style={{ marginBottom: spacing.lg }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: spacing.md,
                marginBottom: spacing.md,
              }}>
              <IconCircle
                icon="today"
                backgroundColor={colors.primarySoft}
                iconColor={colors.primary}
              />
              <View style={{ flex: 1 }}>
                <Text style={[typography.subtitle, { color: colors.text }]}>
                  Today&apos;s Goal
                </Text>
                <Text style={[typography.caption, { color: colors.muted }]}>
                  {goalProgressPercent}% complete
                </Text>
              </View>
            </View>
            {dailyGoal <= 20 ? (
              <GoalSegments
                current={reviewedToday}
                total={dailyGoal}
                colors={colors}
              />
            ) : (
              <ProgressTrack percent={goalProgressPercent} colors={colors} />
            )}
            <Text
              style={[
                typography.bodyMedium,
                { color: colors.text, marginTop: spacing.md },
              ]}>
              {reviewedToday} / {dailyGoal} cards reviewed
            </Text>
          </AppCard>
        </FadeInView>

        <SectionTitle title="Current Streak" colors={colors} />
        <FadeInView delay={motion.stagger} style={{ marginBottom: spacing.lg }}>
          <StatCard
            value={currentStreak}
            label={currentStreak === 1 ? 'day streak' : 'days streak'}
            accent={colors.warning}
            icon="flame"
            colors={colors}
            isDark={isDark}
          />
        </FadeInView>

        <SectionTitle title="Continue Learning" colors={colors} />
        {continueSession ? (
          <FadeInView delay={motion.stagger * 2} style={{ marginBottom: spacing.lg }}>
            <AppCard accentColor={colors.secondary}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: spacing.md,
                  marginBottom: spacing.md,
                }}>
                <IconCircle
                  icon="book"
                  backgroundColor={colors.secondarySoft}
                  iconColor={colors.secondary}
                />
                <View style={{ flex: 1 }}>
                  <Text style={[typography.title, { color: colors.text }]}>
                    {continueSession.name}
                  </Text>
                  <Text style={[typography.caption, { color: colors.muted }]}>
                    Card {continueSession.cardIndex + 1} of {continueSession.total}
                  </Text>
                </View>
                <Badge
                  label={`${continueSession.progressPercent}%`}
                  backgroundColor={colors.secondarySoft}
                  textColor={colors.secondary}
                />
              </View>
              <ProgressTrack
                percent={continueSession.progressPercent}
                colors={colors}
                fillColor={colors.secondary}
              />
              <Text
                style={[
                  typography.caption,
                  { color: colors.muted, marginTop: spacing.sm, marginBottom: spacing.lg },
                ]}>
                {continueSession.learned} of {continueSession.total} cards learned
              </Text>
              <AppButton
                title="Resume"
                onPress={() =>
                  router.push(
                    `/study?deck=${encodeURIComponent(continueSession.name)}&resume=1`,
                  )
                }
              />
            </AppCard>
          </FadeInView>
        ) : (
          <FadeInView delay={motion.stagger * 2} style={{ marginBottom: spacing.lg }}>
            <AppCard>
              <Text style={[typography.subtitle, { color: colors.text, marginBottom: spacing.xs }]}>
                No paused session
              </Text>
              <Text style={[typography.caption, { color: colors.muted, marginBottom: spacing.lg }]}>
                Start studying a deck to continue right where you left off.
              </Text>
              <AppButton
                title="Start Study"
                onPress={() => router.push('/study?mode=all')}
              />
            </AppCard>
          </FadeInView>
        )}

        <SectionTitle title="My Decks" colors={colors} />
        <View style={{ gap: spacing.md, marginBottom: spacing.lg }}>
          {deckList.length > 0 ? (
            deckList.map((deck, index) => (
              <Pressable
                key={deck.name}
                onPress={() => router.push(`/study?deck=${encodeURIComponent(deck.name)}`)}
                style={({ pressed }) => ({
                  opacity: pressed ? 0.94 : 1,
                })}>
                {index < 3 ? (
                  <FadeInView delay={motion.stagger * (3 + index)}>
                    <AppCard>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginBottom: spacing.sm,
                        }}>
                        <Text style={[typography.subtitle, { color: colors.text }]}>{deck.name}</Text>
                        <Badge
                          label={`${deck.learned}/${deck.total}`}
                          backgroundColor={colors.primarySoft}
                          textColor={colors.primary}
                        />
                      </View>
                      <ProgressTrack percent={deck.progressPercent} colors={colors} />
                    </AppCard>
                  </FadeInView>
                ) : (
                  <AppCard>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: spacing.sm,
                      }}>
                      <Text style={[typography.subtitle, { color: colors.text }]}>{deck.name}</Text>
                      <Badge
                        label={`${deck.learned}/${deck.total}`}
                        backgroundColor={colors.primarySoft}
                        textColor={colors.primary}
                      />
                    </View>
                    <ProgressTrack percent={deck.progressPercent} colors={colors} />
                  </AppCard>
                )}
              </Pressable>
            ))
          ) : (
            <AppCard>
              <Text style={[typography.body, { color: colors.muted }]}>
                No decks yet. Add your first card to create one.
              </Text>
            </AppCard>
          )}
        </View>

        <SectionTitle title="Quick Actions" colors={colors} />
        <View style={{ gap: spacing.sm, marginBottom: spacing.lg }}>
          <AppButton
            title="Study All Cards"
            onPress={() => router.push('/study?mode=all')}
          />
          <View style={{ flexDirection: 'row', gap: spacing.sm }}>
            <View style={{ flex: 1 }}>
              <AppButton
                title="Add Card"
                variant="outline"
                onPress={() => router.push('/add-card')}
              />
            </View>
            <View style={{ flex: 1 }}>
              <AppButton
                title="Manage Cards"
                variant="outline"
                onPress={() => router.push('/cards')}
              />
            </View>
          </View>
        </View>

        <SectionTitle title="Word of the Day" colors={colors} />
        <FadeInView delay={motion.stagger * 5} style={{ marginBottom: spacing.lg }}>
          <AppCard>
            {wordOfTheDay ? (
              <>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
                  <Ionicons name="sparkles" size={18} color={colors.accent} />
                  <Text style={[typography.caption, { color: colors.muted }]}>
                    From {wordOfTheDay.deck}
                  </Text>
                </View>
                <Text style={[typography.title, { color: colors.text, marginTop: spacing.sm }]}>
                  {wordOfTheDay.front}
                </Text>
                <Text style={[typography.body, { color: colors.muted, marginTop: spacing.xs }]}>
                  {wordOfTheDay.back}
                </Text>
              </>
            ) : (
              <Text style={[typography.body, { color: colors.muted }]}>
                Add cards to get a daily word recommendation.
              </Text>
            )}
          </AppCard>
        </FadeInView>

        <SectionTitle title="Recent Activity" colors={colors} />
        <FadeInView delay={motion.stagger * 6}>
          <AppCard>
            <View style={{ gap: spacing.sm }}>
              {recentActivity.map((activity) => (
                <View key={activity} style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
                  <Ionicons name="time-outline" size={16} color={colors.muted} />
                  <Text style={[typography.body, { color: colors.text, flex: 1 }]}>{activity}</Text>
                </View>
              ))}
            </View>
          </AppCard>
        </FadeInView>
      </ScrollView>
    </ScreenContainer>
  );
}
