import { useEffect, useMemo, useRef, useState, type ComponentProps } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';

import Flashcard from '../../components/Flashcard';
import ProgressBar from '../../components/ProgressBar';
import ScreenContainer from '../../components/ScreenContainer';
import {
  SessionCompleteActions,
  SessionCompleteAnimation,
  SessionCompleteHero,
  SessionCompleteStats,
} from '../../components/animations';
import {
  AppCard,
  CompletionStat,
  GhostButton,
  IconCircle,
  PrimaryButton,
  RatingButton,
  SecondaryButton,
  SegmentedControl,
} from '../../components/ui';
import {
  layout,
  spacing,
  typography,
} from '../../constants/theme';
import { useCards } from '../../storage/CardsContext';
import { useTheme } from '../../storage/ThemeContext';
import type { Card } from '../../types/card';

type CardWithFavorite = Card & { favorite?: boolean };

function filterStudyCards(
  cards: Card[],
  mode?: string,
  deck?: string,
): Card[] {
  let result = cards;

  if (mode === 'favorites') {
    result = result.filter(
      (card) =>
        (card as (typeof card & { favorite?: boolean })).favorite === true,
    );
  } else if (mode === 'learning') {
    result = result.filter((card) => !card.learned);
  }

  if (deck) {
    result = result.filter((card) => card.deck === deck);
  }

  return result;
}

function getEmptyStateDescription(mode?: string) {
  if (mode === 'favorites') {
    return 'No favorite cards yet.';
  }

  if (mode === 'learning') {
    return 'All cards learned!';
  }

  return 'No cards available.';
}

function getSessionTitle(mode?: string, deck?: string) {
  if (deck) {
    return deck;
  }

  if (mode === 'favorites') {
    return 'Favorites';
  }

  if (mode === 'learning') {
    return 'Learning Cards';
  }

  return 'Study Session';
}

function getSessionIcon(
  mode?: string,
): ComponentProps<typeof Ionicons>['name'] {
  if (mode === 'favorites') {
    return 'heart';
  }

  if (mode === 'learning') {
    return 'school';
  }

  return 'book';
}

export default function StudyScreen() {
  const params = useLocalSearchParams<{
    mode?: string;
    deck?: string;
    resume?: string;
  }>();
  const mode = Array.isArray(params.mode) ? params.mode[0] : params.mode;
  const deck = Array.isArray(params.deck) ? params.deck[0] : params.deck;
  const resumeParam = Array.isArray(params.resume) ? params.resume[0] : params.resume;
  const shouldResume = resumeParam === '1' || resumeParam === 'true';

  const {
    cards,
    setCards,
    incrementCardsReviewedToday,
    completeStudySession,
    continueLearning,
    isContinueLearningLoaded,
    saveContinueLearning,
    clearContinueLearning,
  } = useCards();
  const { colors, isDark } = useTheme();

  const filteredStudyCards = useMemo(
    () => filterStudyCards(cards, mode, deck),
    [cards, mode, deck],
  );

  const [studyQueue, setStudyQueue] = useState<Card[]>(filteredStudyCards);
  const [sessionTotal, setSessionTotal] = useState(filteredStudyCards.length);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [goodCount, setGoodCount] = useState(0);
  const [againCount, setAgainCount] = useState(0);
  const [flipResetKeys, setFlipResetKeys] = useState<Record<string, number>>(
    {},
  );

  const studySessionKey = useMemo(
    () =>
      `${mode ?? ''}|${deck ?? ''}|${shouldResume ? 'resume' : 'fresh'}|${filteredStudyCards.map((card) => card.id).join(',')}`,
    [mode, deck, shouldResume, filteredStudyCards],
  );

  const resumeIndexRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isContinueLearningLoaded) {
      return;
    }

    if (
      shouldResume &&
      deck &&
      continueLearning?.deck === deck &&
      filteredStudyCards.length > 0
    ) {
      resumeIndexRef.current = Math.min(
        continueLearning!.cardIndex,
        filteredStudyCards.length - 1,
      );
      return;
    }

    resumeIndexRef.current = null;
  }, [
    shouldResume,
    deck,
    continueLearning,
    isContinueLearningLoaded,
    filteredStudyCards.length,
  ]);

  useEffect(() => {
    if (!isContinueLearningLoaded) {
      return;
    }

    setStudyQueue(filteredStudyCards);
    setSessionTotal(filteredStudyCards.length);
    setCompleted(false);
    setGoodCount(0);
    setAgainCount(0);
    setFlipResetKeys({});

    if (resumeIndexRef.current !== null && filteredStudyCards.length > 0) {
      setCurrentIndex(resumeIndexRef.current);
      resumeIndexRef.current = null;
    } else {
      setCurrentIndex(0);
    }
  }, [studySessionKey, filteredStudyCards, isContinueLearningLoaded]);

  useEffect(() => {
    if (!deck || completed || filteredStudyCards.length === 0) {
      return;
    }

    saveContinueLearning(deck, currentIndex);
  }, [
    deck,
    currentIndex,
    completed,
    filteredStudyCards.length,
    saveContinueLearning,
  ]);

  const currentCard = studyQueue[currentIndex];
  const currentCardWithFavorite = currentCard as CardWithFavorite | undefined;
  const deckProgress = useMemo(() => {
    if (!currentCard) {
      return null;
    }

    const deckCards = filteredStudyCards.filter(
      (card) => card.deck === currentCard.deck,
    );
    const deckLearned = deckCards.filter((card) => card.learned).length;

    return {
      name: currentCard.deck,
      total: deckCards.length,
      learned: deckLearned,
    };
  }, [filteredStudyCards, currentCard]);

  const totalAnswers = goodCount + againCount;
  const accuracyPercent =
    totalAnswers === 0
      ? 100
      : Math.round((goodCount / totalAnswers) * 100);

  function handleGood() {
    incrementCardsReviewedToday();
    setGoodCount((prev) => prev + 1);

    if (currentCard) {
      setCards(
        cards.map((card) =>
          card.id === currentCard.id ? { ...card, learned: true } : card,
        ),
      );
    }

    if (currentIndex === studyQueue.length - 1) {
      completeStudySession();
      clearContinueLearning();
      setCompleted(true);
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  }

  function handleAgain() {
    setAgainCount((prev) => prev + 1);

    if (currentIndex === studyQueue.length - 1) {
      setCurrentIndex(0);
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  }

  function handleRestart() {
    setCompleted(false);
    setCurrentIndex(0);
    setGoodCount(0);
    setAgainCount(0);
    setFlipResetKeys({});
    setStudyQueue(filteredStudyCards);
    setSessionTotal(filteredStudyCards.length);

    if (deck) {
      saveContinueLearning(deck, 0);
    }
  }

  function handleHard() {
    handleAgain();
  }

  function handleEasy() {
    handleGood();
  }

  function setStudyMode(nextMode: string) {
    router.replace({
      pathname: '/study',
      params: { mode: nextMode },
    });
  }

  if (filteredStudyCards.length === 0) {
    return (
      <ScreenContainer
        style={{
          justifyContent: 'center',
          paddingHorizontal: layout.contentPadding,
        }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {!deck ? (
            <AppCard colors={colors} isDark={isDark} style={{ marginBottom: spacing.lg }}>
              <Text style={[typography.subtitle, { color: colors.text, marginBottom: spacing.md }]}>
                Choose a mode
              </Text>
              <SegmentedControl
                colors={colors}
                value={mode ?? 'all'}
                onChange={setStudyMode}
                options={[
                  { key: 'all', label: 'All', icon: 'book' },
                  { key: 'favorites', label: 'Favorites', icon: 'heart' },
                  { key: 'learning', label: 'Learning', icon: 'school' },
                ]}
              />
            </AppCard>
          ) : null}

          <AppCard colors={colors} isDark={isDark} style={{ alignItems: 'center' }}>
            <IconCircle
              icon="folder-open-outline"
              backgroundColor={colors.surface}
              iconColor={colors.muted}
              size={56}
            />
            <Text
              style={[
                typography.title,
                { color: colors.text, textAlign: 'center', marginTop: spacing.lg },
              ]}>
              No cards found
            </Text>
            <Text
              style={[
                typography.body,
                { color: colors.muted, textAlign: 'center', marginTop: spacing.sm },
              ]}>
              {getEmptyStateDescription(mode)}
            </Text>
          </AppCard>
        </ScrollView>
      </ScreenContainer>
    );
  }

  if (completed) {
    return (
      <ScreenContainer
        style={{
          justifyContent: 'center',
          paddingHorizontal: layout.contentPadding,
        }}>
        <SessionCompleteAnimation>
          <AppCard
            colors={colors}
            isDark={isDark}
            accentColor={colors.success}
            style={{ alignItems: 'center' }}>
            <SessionCompleteHero>
              <IconCircle
                icon="trophy"
                backgroundColor={colors.successSoft}
                iconColor={colors.success}
                size={64}
              />
            </SessionCompleteHero>

            <Text
              style={[
                typography.display,
                {
                  color: colors.text,
                  textAlign: 'center',
                  marginTop: spacing.lg,
                  fontSize: 28,
                },
              ]}>
              Session Complete
            </Text>
            <Text
              style={[
                typography.body,
                {
                  color: colors.muted,
                  textAlign: 'center',
                  marginTop: spacing.sm,
                  marginBottom: spacing.xl,
                },
              ]}>
              You reviewed {sessionTotal} {sessionTotal === 1 ? 'card' : 'cards'}.
              Keep the momentum going!
            </Text>

            <SessionCompleteStats>
              <View
                style={{
                  flexDirection: 'row',
                  gap: spacing.sm,
                  width: '100%',
                  marginBottom: spacing.xl,
                }}>
                <CompletionStat
                  value={goodCount}
                  label="Good"
                  accent={colors.primary}
                  icon="checkmark-circle"
                  colors={colors}
                  isDark={isDark}
                />
                <CompletionStat
                  value={againCount}
                  label="Again"
                  accent={colors.warning}
                  icon="refresh"
                  colors={colors}
                  isDark={isDark}
                />
                <CompletionStat
                  value={`${accuracyPercent}%`}
                  label="Accuracy"
                  accent={colors.success}
                  icon="analytics"
                  colors={colors}
                  isDark={isDark}
                />
              </View>
            </SessionCompleteStats>

            <SessionCompleteActions>
              <View style={{ width: '100%', gap: spacing.md }}>
                <PrimaryButton
                  label="Study Again"
                  icon="refresh"
                  onPress={handleRestart}
                  colors={colors}
                  isDark={isDark}
                />
                <SecondaryButton
                  label="Back Home"
                  icon="home"
                  onPress={() => router.replace('/(tabs)/index')}
                  colors={colors}
                  isDark={isDark}
                />
              </View>
            </SessionCompleteActions>
          </AppCard>
        </SessionCompleteAnimation>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <View style={{ flex: 1 }}>
        <View
          style={{
            paddingHorizontal: layout.contentPadding,
            paddingTop: spacing.md,
            paddingBottom: spacing.md,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: spacing.lg,
            }}>
            {deck ? (
              <GhostButton
                label="Back"
                onPress={() => router.replace('/(tabs)/index')}
                colors={colors}
              />
            ) : (
              <View style={{ width: 80 }} />
            )}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Ionicons
                name={getSessionIcon(mode)}
                size={16}
                color={colors.primary}
              />
              <Text style={[typography.caption, { color: colors.text, fontWeight: '700' }]}>
                {getSessionTitle(mode, deck)}
              </Text>
            </View>
            <View style={{ width: 80 }} />
          </View>

          {!deck ? (
            <AppCard colors={colors} isDark={isDark} style={{ marginBottom: spacing.lg }}>
              <Text style={[typography.label, { color: colors.muted, marginBottom: spacing.sm }]}>
                Study mode
              </Text>
              <SegmentedControl
                colors={colors}
                value={mode ?? 'all'}
                onChange={setStudyMode}
                options={[
                  { key: 'all', label: 'All', icon: 'book' },
                  { key: 'favorites', label: 'Favorites', icon: 'heart' },
                  { key: 'learning', label: 'Learning', icon: 'school' },
                ]}
              />
            </AppCard>
          ) : null}

          <ProgressBar current={currentIndex + 1} total={studyQueue.length} />

          <Text
            style={[
              typography.caption,
              {
                color: colors.muted,
                textAlign: 'center',
                marginTop: spacing.md,
                fontWeight: '600',
              },
            ]}>
            Card {currentIndex + 1} of {studyQueue.length}
            {deckProgress
              ? ` · ${deckProgress.learned}/${deckProgress.total} learned`
              : ''}
          </Text>
        </View>

        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: layout.contentPadding,
          }}>
          <Flashcard
            key={`${currentCard.id}-${flipResetKeys[currentCard.id] ?? 0}`}
            front={currentCard.front}
            back={currentCard.back}
            deck={currentCard.deck}
            example={currentCard.example}
            exampleTranslation={currentCard.exampleTranslation}
            favorite={currentCardWithFavorite?.favorite}
            learned={currentCard.learned}
          />
        </View>

        <View
          style={{
            paddingHorizontal: layout.contentPadding,
            paddingTop: spacing.md,
            paddingBottom: spacing.xl,
            gap: spacing.sm,
          }}>
          <View style={{ flexDirection: 'row', gap: spacing.sm }}>
            <RatingButton
              label="Again"
              icon="close-circle-outline"
              onPress={handleAgain}
              backgroundColor={colors.surfaceElevated}
              textColor={colors.text}
              borderColor={colors.border}
            />
            <RatingButton
              label="Hard"
              icon="remove-circle-outline"
              onPress={handleHard}
              backgroundColor={colors.warningSoft}
              textColor={colors.warning}
              borderColor={colors.warning + '44'}
            />
          </View>
          <View style={{ flexDirection: 'row', gap: spacing.sm }}>
            <RatingButton
              label="Good"
              icon="checkmark-circle"
              onPress={handleGood}
              backgroundColor={colors.primary}
              textColor={colors.onPrimary}
            />
            <RatingButton
              label="Easy"
              icon="flash"
              onPress={handleEasy}
              backgroundColor={colors.successSoft}
              textColor={colors.success}
              borderColor={colors.success + '44'}
            />
          </View>
        </View>
      </View>
    </ScreenContainer>
  );
}
