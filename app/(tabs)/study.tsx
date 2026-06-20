import { useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';

import AppButton from '../../components/AppButton';
import AppCard from '../../components/AppCard';
import Flashcard from '../../components/Flashcard';
import ScreenContainer from '../../components/ScreenContainer';
import SessionComplete from '../../components/SessionComplete';
import { PressableScale } from '../../components/animations';
import {
  Badge,
  IconCircle,
  ProgressTrack,
  RatingButton,
  SegmentedControl,
} from '../../components/ui';
import { spacing as dsSpacing } from '../../constants/spacing';
import { typography as dsTypography } from '../../constants/typography';
import { layout, spacing, typography } from '../../constants/theme';
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

export default function StudyScreen() {  const params = useLocalSearchParams<{
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

  const progressPercent =
    studyQueue.length > 0
      ? Math.round(((currentIndex + 1) / studyQueue.length) * 100)
      : 0;
  const cardsRemaining = Math.max(studyQueue.length - currentIndex, 0);

  if (filteredStudyCards.length === 0) {    return (
      <ScreenContainer
        style={{
          justifyContent: 'center',
          paddingHorizontal: layout.contentPadding,
        }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {!deck ? (
            <AppCard style={{ marginBottom: spacing.lg }}>
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

          <AppCard style={{ alignItems: 'center' }}>
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
        <SessionComplete
          cardsReviewed={sessionTotal}
          accuracyPercent={accuracyPercent}
          onStudyAgain={handleRestart}
          onBackHome={() => router.replace('/')}
        />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <View style={{ flex: 1 }}>
        {/* Compact progress header */}
        <View
          style={{
            paddingHorizontal: layout.contentPadding,
            paddingTop: dsSpacing[16],
            paddingBottom: dsSpacing[12],
          }}>
          {deck ? (
            <PressableScale
              onPress={() => router.replace('/')}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                alignSelf: 'flex-start',
                gap: dsSpacing[4],
                marginBottom: dsSpacing[12],
                paddingVertical: dsSpacing[4],
                paddingRight: dsSpacing[8],
              }}>
              <Ionicons name="chevron-back" size={22} color={colors.primary} />
              <Text
                style={[
                  dsTypography.subtitle,
                  { color: colors.primary, fontSize: 16 },
                ]}>
                Back
              </Text>
            </PressableScale>
          ) : null}

          <Text style={[dsTypography.heading, { color: colors.text, fontSize: 26 }]}>
            Study Session
          </Text>
          {!deck ? (
            <Text
              style={[
                dsTypography.caption,
                { color: colors.muted, marginTop: dsSpacing[4] },
              ]}>
              {getSessionTitle(mode, deck)}
            </Text>
          ) : null}

          {!deck ? (
            <View style={{ marginTop: dsSpacing[12] }}>
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
            </View>
          ) : null}

          <View style={{ marginTop: dsSpacing[16] }}>
            <ProgressTrack
              percent={progressPercent}
              colors={colors}
              height={8}
            />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: dsSpacing[8],
              }}>
              <Text
                style={[
                  dsTypography.caption,
                  { color: colors.text, fontWeight: '700' },
                ]}>
                {progressPercent}% Complete
              </Text>
              <Text
                style={[
                  dsTypography.caption,
                  { color: colors.muted, fontWeight: '600' },
                ]}>
                {cardsRemaining} {cardsRemaining === 1 ? 'Card' : 'Cards'} Remaining
              </Text>
            </View>
          </View>

          {currentCard ? (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: dsSpacing[8],
                marginTop: dsSpacing[12],
              }}>
              <Badge
                label={currentCard.deck}
                icon="folder"
                backgroundColor={colors.primarySoft}
                textColor={colors.primary}
              />
              {deckProgress ? (
                <Badge
                  label={`${deckProgress.learned}/${deckProgress.total} learned`}
                  icon="checkmark-circle"
                  backgroundColor={colors.successSoft}
                  textColor={colors.success}
                />
              ) : null}
            </View>
          ) : null}
        </View>

        {/* Flashcard — visual focus */}
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: layout.contentPadding,
            paddingVertical: dsSpacing[8],
          }}>
          <Flashcard
            key={`${currentCard.id}-${flipResetKeys[currentCard.id] ?? 0}`}
            size="large"
            front={currentCard.front}
            back={currentCard.back}
            deck={currentCard.deck}
            example={currentCard.example}
            exampleTranslation={currentCard.exampleTranslation}
            favorite={currentCardWithFavorite?.favorite}
            learned={currentCard.learned}
          />
        </View>

        {/* Rating grid — full width 2×2 */}
        <View
          style={{
            paddingHorizontal: layout.contentPadding,
            paddingTop: dsSpacing[12],
            paddingBottom: dsSpacing[32],
            gap: dsSpacing[12],
          }}>
          <View style={{ flexDirection: 'row', gap: dsSpacing[12] }}>
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
          <View style={{ flexDirection: 'row', gap: dsSpacing[12] }}>
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