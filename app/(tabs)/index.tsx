import { useMemo } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import AppButton from '../../components/AppButton';
import AppCard from '../../components/AppCard';
import CardSearch from '../../components/CardSearch';
import ScreenContainer from '../../components/ScreenContainer';
import StatsOverview from '../../components/StatsOverview';
import { FadeInView, motion } from '../../components/animations';
import {
  Badge,
  GoalSegments,
  IconCircle,
  PageHeader,
  ProgressTrack,
  SectionTitle,
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

type CardWithFavorite = { favorite?: boolean };

export default function HomeScreen() {
  const {
    cards,
    dailyProgress,
    dailyGoal,
    currentStreak,
    continueLearning,
    isContinueLearningLoaded,
    studyStats,
    getStudyAccuracy,
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

  const cardsLearned = useMemo(
    () => cards.filter((card) => card.learned).length,
    [cards],
  );

  const favoriteDeck = useMemo(() => {
    if (cards.length === 0) {
      return '—';
    }

    const favoriteCounts = cards.reduce<Record<string, number>>((acc, card) => {
      const withFavorite = card as CardWithFavorite;

      if (withFavorite.favorite) {
        acc[card.deck] = (acc[card.deck] ?? 0) + 1;
      }

      return acc;
    }, {});

    const topFavorite = Object.entries(favoriteCounts).sort((a, b) => b[1] - a[1])[0];

    if (topFavorite && topFavorite[1] > 0) {
      return topFavorite[0];
    }

    if (continueLearning?.deck) {
      return continueLearning.deck;
    }

    const deckCounts = cards.reduce<Record<string, number>>((acc, card) => {
      acc[card.deck] = (acc[card.deck] ?? 0) + 1;
      return acc;
    }, {});

    const largestDeck = Object.entries(deckCounts).sort((a, b) => b[1] - a[1])[0];

    return largestDeck?.[0] ?? '—';
  }, [cards, continueLearning?.deck]);

  const accuracy = getStudyAccuracy();

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

  const continueSession = useMemo(() => {
    if (!isContinueLearningLoaded || !continueLearning) {
      return null;
    }

    const deckCards = cards.filter((card) => card.deck === continueLearning.deck);

    if (deckCards.length === 0) {
      return null;
    }

    const savedIndex = Math.min(
      continueLearning.cardIndex,
      Math.max(0, deckCards.length - 1),
    );

    return {
      name: continueLearning.deck,
      total: deckCards.length,
      cardIndex: savedIndex,
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

        <CardSearch
          cards={cards}
          onSelectCard={(card) => router.push(`/edit-card?id=${card.id}`)}
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

        <SectionTitle title="Your Stats" colors={colors} />
        <FadeInView delay={motion.stagger} style={{ marginBottom: spacing.lg }}>
          <StatsOverview
            studyTimeMinutes={studyStats.studyTimeMinutes}
            cardsLearned={cardsLearned}
            currentStreak={currentStreak}
            favoriteDeck={favoriteDeck}
            accuracy={accuracy}
            reviewHistory={studyStats.history}
            colors={colors}
            isDark={isDark}
          />
          <Pressable
            onPress={() => router.push('/statistics')}
            style={({ pressed }) => ({
              flexDirection: 'row',
              alignItems: 'center',
              alignSelf: 'flex-start',
              gap: spacing.xs,
              marginTop: spacing.md,
              opacity: pressed ? 0.75 : 1,
            })}
            accessibilityRole="button"
            accessibilityLabel="View all statistics">
            <Text
              style={[
                typography.subtitle,
                { color: colors.primary, fontWeight: '700' },
              ]}>
              View all stats
            </Text>
            <Ionicons name="arrow-forward" size={18} color={colors.primary} />
          </Pressable>
        </FadeInView>

        <SectionTitle title="Continue Learning" colors={colors} />
        {continueSession ? (
          <FadeInView delay={motion.stagger * 2} style={{ marginBottom: spacing.lg }}>
            <AppCard accentColor={colors.secondary}>
              <Text style={[typography.title, { color: colors.text, marginBottom: spacing.xs }]}>
                {continueSession.name}
              </Text>
              <Text
                style={[
                  typography.bodyMedium,
                  { color: colors.muted, marginBottom: spacing.lg },
                ]}>
                Card {continueSession.cardIndex + 1} / {continueSession.total}
              </Text>
              <Pressable
                onPress={() =>
                  router.push(
                    `/study?deck=${encodeURIComponent(continueSession.name)}&resume=1`,
                  )
                }
                style={({ pressed }) => ({
                  flexDirection: 'row',
                  alignItems: 'center',
                  alignSelf: 'flex-start',
                  gap: spacing.xs,
                  opacity: pressed ? 0.75 : 1,
                })}
                accessibilityRole="button"
                accessibilityLabel="Resume studying">
                <Text
                  style={[
                    typography.subtitle,
                    { color: colors.primary, fontWeight: '700' },
                  ]}>
                  Resume
                </Text>
                <Ionicons name="arrow-forward" size={18} color={colors.primary} />
              </Pressable>
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
                title="Cards"
                variant="outline"
                onPress={() => router.push('/cards')}
              />
            </View>
          </View>
        </View>

        <SectionTitle title="Word of the Day" colors={colors} />
        <FadeInView delay={motion.stagger * 5} style={{ marginBottom: spacing.lg }}>
          <AppCard accentColor={colors.accent}>
            {wordOfTheDay ? (
              <>
                <Text style={[typography.title, { color: colors.text, marginBottom: spacing.xs }]}>
                  {wordOfTheDay.front}
                </Text>
                <Text
                  style={[
                    typography.bodyMedium,
                    { color: colors.muted, marginBottom: spacing.lg },
                  ]}>
                  {wordOfTheDay.back}
                </Text>
                <Pressable
                  onPress={() =>
                    router.push(`/study?deck=${encodeURIComponent(wordOfTheDay.deck)}`)
                  }
                  style={({ pressed }) => ({
                    flexDirection: 'row',
                    alignItems: 'center',
                    alignSelf: 'flex-start',
                    gap: spacing.xs,
                    opacity: pressed ? 0.75 : 1,
                  })}
                  accessibilityRole="button"
                  accessibilityLabel="Study word of the day">
                  <Text
                    style={[
                      typography.subtitle,
                      { color: colors.primary, fontWeight: '700' },
                    ]}>
                    Study
                  </Text>
                  <Ionicons name="arrow-forward" size={18} color={colors.primary} />
                </Pressable>
              </>
            ) : (
              <Text style={[typography.body, { color: colors.muted }]}>
                Add cards to get a daily word recommendation.
              </Text>
            )}
          </AppCard>
        </FadeInView>
      </ScrollView>
    </ScreenContainer>
  );
}
