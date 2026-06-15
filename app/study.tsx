import { useEffect, useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';

import ContentContainer from '../components/ContentContainer';
import Flashcard from '../components/Flashcard';
import ProgressBar from '../components/ProgressBar';
import { colors, radius, spacing } from '../constants/theme';
import { useCards } from '../storage/CardsContext';
import type { Card } from '../types/card';

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
    return 'All cards learned 🎉';
  }

  return 'No cards available.';
}

function getSessionTitle(mode?: string) {
  if (mode === 'favorites') {
    return '⭐ Favorites';
  }

  if (mode === 'learning') {
    return '🧠 Learning Cards';
  }

  return '📚 Study Session';
}

export default function StudyScreen() {
  const params = useLocalSearchParams<{ mode?: string; deck?: string }>();
  const mode = Array.isArray(params.mode) ? params.mode[0] : params.mode;
  const deck = Array.isArray(params.deck) ? params.deck[0] : params.deck;

  const { cards, setCards, incrementCardsReviewedToday, completeStudySession } =
    useCards();

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
      `${mode ?? ''}|${deck ?? ''}|${filteredStudyCards.map((card) => card.id).join(',')}`,
    [mode, deck, filteredStudyCards],
  );

  useEffect(() => {
    setStudyQueue(filteredStudyCards);
    setSessionTotal(filteredStudyCards.length);
    setCurrentIndex(0);
    setCompleted(false);
    setGoodCount(0);
    setAgainCount(0);
    setFlipResetKeys({});
  }, [studySessionKey, filteredStudyCards]);

  const currentCard = studyQueue[currentIndex];
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

  const progressPercent =
    studyQueue.length > 0
      ? Math.round(((currentIndex + 1) / studyQueue.length) * 100)
      : 0;
  const cardsRemaining = studyQueue.length - (currentIndex + 1);
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
  }

  if (filteredStudyCards.length === 0) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: 'center',
          backgroundColor: colors.background,
          paddingHorizontal: spacing.lg,
        }}>
        <ContentContainer style={{ alignItems: 'center' }}>
          <Text
            style={{
              fontSize: 32,
              fontWeight: 'bold',
              marginBottom: 12,
              color: colors.text,
              textAlign: 'center',
            }}>
            No Cards Found
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: colors.muted,
              marginBottom: 40,
              textAlign: 'center',
              lineHeight: spacing.lg,
            }}>
            {getEmptyStateDescription(mode)}
          </Text>
          <Pressable
            onPress={() => router.replace('/')}
            style={({ pressed }) => ({
              width: '100%',
              backgroundColor: colors.primary,
              paddingVertical: 18,
              borderRadius: radius.lg,
              alignItems: 'center',
              opacity: pressed ? 0.85 : 1,
              shadowColor: colors.primary,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.25,
              shadowRadius: spacing.sm,
              elevation: 4,
            })}>
            <Text
              style={{
                color: colors.card,
                fontSize: 16,
                fontWeight: '600',
              }}>
              Back Home
            </Text>
          </Pressable>
        </ContentContainer>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.background,
      }}>
      <ContentContainer
        style={{ paddingHorizontal: spacing.lg, paddingVertical: 12 }}>
        <Pressable onPress={() => router.replace('/')}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: '600',
              color: colors.primary,
            }}>
            ← Back
          </Text>
        </Pressable>
      </ContentContainer>

      {completed ? (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            paddingHorizontal: spacing.lg,
          }}>
          <ContentContainer style={{ alignItems: 'center' }}>
            <Text
              style={{
                fontSize: 88,
                marginBottom: spacing.lg,
              }}>
              🎉
            </Text>
            <Text
              style={{
                fontSize: 34,
                fontWeight: 'bold',
                marginBottom: 12,
                color: colors.text,
                textAlign: 'center',
              }}>
              Session Complete
            </Text>
            <Text
              style={{
                fontSize: 16,
                color: colors.muted,
                marginBottom: 40,
                textAlign: 'center',
                lineHeight: spacing.lg,
              }}>
              Great job! You finished {sessionTotal}{' '}
              {sessionTotal === 1 ? 'card' : 'cards'} in this session.
            </Text>

            <View
              style={{
                flexDirection: 'row',
                gap: spacing.md,
                width: '100%',
                marginBottom: 40,
              }}>
              <View
                style={{
                  flex: 1,
                  backgroundColor: colors.card,
                  borderRadius: radius.xl,
                  paddingVertical: spacing.lg,
                  paddingHorizontal: spacing.md,
                  alignItems: 'center',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.08,
                  shadowRadius: radius.md,
                  elevation: 4,
                }}>
                <Text
                  style={{
                    fontSize: 32,
                    fontWeight: '700',
                    color: colors.primary,
                    marginBottom: spacing.sm,
                  }}>
                  {goodCount}
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    color: colors.muted,
                    fontWeight: '600',
                    textAlign: 'center',
                  }}>
                  Good Answers
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  backgroundColor: colors.card,
                  borderRadius: radius.xl,
                  paddingVertical: spacing.lg,
                  paddingHorizontal: spacing.md,
                  alignItems: 'center',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.08,
                  shadowRadius: radius.md,
                  elevation: 4,
                }}>
                <Text
                  style={{
                    fontSize: 32,
                    fontWeight: '700',
                    color: '#ff9500',
                    marginBottom: spacing.sm,
                  }}>
                  {againCount}
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    color: colors.muted,
                    fontWeight: '600',
                    textAlign: 'center',
                  }}>
                  Again Presses
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  backgroundColor: colors.card,
                  borderRadius: radius.xl,
                  paddingVertical: spacing.lg,
                  paddingHorizontal: spacing.md,
                  alignItems: 'center',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.08,
                  shadowRadius: radius.md,
                  elevation: 4,
                }}>
                <Text
                  style={{
                    fontSize: 32,
                    fontWeight: '700',
                    color: colors.success,
                    marginBottom: spacing.sm,
                  }}>
                  {accuracyPercent}%
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    color: colors.muted,
                    fontWeight: '600',
                    textAlign: 'center',
                  }}>
                  Accuracy %
                </Text>
              </View>
            </View>

            <View style={{ width: '100%', gap: 14 }}>
              <Pressable
                onPress={handleRestart}
                style={({ pressed }) => ({
                  backgroundColor: colors.primary,
                  paddingVertical: 18,
                  borderRadius: radius.lg,
                  alignItems: 'center',
                  opacity: pressed ? 0.85 : 1,
                  shadowColor: colors.primary,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.25,
                  shadowRadius: spacing.sm,
                  elevation: 4,
                })}>
                <Text
                  style={{
                    color: colors.card,
                    fontSize: 16,
                    fontWeight: '600',
                  }}>
                  Study Again
                </Text>
              </Pressable>
              <Pressable
                onPress={() => router.replace('/')}
                style={({ pressed }) => ({
                  backgroundColor: colors.card,
                  paddingVertical: 18,
                  borderRadius: radius.lg,
                  alignItems: 'center',
                  opacity: pressed ? 0.85 : 1,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.08,
                  shadowRadius: 6,
                  elevation: 2,
                })}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: colors.text,
                  }}>
                  Back Home
                </Text>
              </Pressable>
            </View>
          </ContentContainer>
        </View>
      ) : (
        <ContentContainer
          style={{
            flex: 1,
            paddingHorizontal: spacing.lg,
            paddingBottom: spacing.lg,
          }}>
          <Text
            style={{
              fontSize: 22,
              fontWeight: '700',
              color: colors.text,
              textAlign: 'center',
              marginBottom: spacing.lg,
            }}>
            {getSessionTitle(mode)}
          </Text>

          <View style={{ marginBottom: 12 }}>
            <ProgressBar
              current={currentIndex + 1}
              total={studyQueue.length}
            />
          </View>

          <Text
            style={{
              fontSize: 18,
              fontWeight: '700',
              color: colors.primary,
              textAlign: 'center',
              marginBottom: spacing.md,
            }}>
            {progressPercent}%
          </Text>

          <Text
            style={{
              fontSize: 14,
              color: colors.muted,
              textAlign: 'center',
              marginBottom: spacing.md,
            }}>
            Card {currentIndex + 1} of {studyQueue.length}
            {cardsRemaining > 0 ? ` · ${cardsRemaining} remaining` : ''}
          </Text>

          <View
            style={{
              alignSelf: 'center',
              alignItems: 'center',
              marginBottom: spacing.xl,
            }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: '700',
                color: colors.text,
                marginBottom: 4,
              }}>
              {deckProgress?.name}
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: colors.muted,
                fontWeight: '500',
              }}>
              {deckProgress?.learned} / {deckProgress?.total} learned
            </Text>
          </View>

          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: spacing.xl,
            }}>
            <Flashcard
              key={`${currentCard.id}-${flipResetKeys[currentCard.id] ?? 0}`}
              front={currentCard.front}
              back={currentCard.back}
              deck={currentCard.deck}
              example={currentCard.example}
              exampleTranslation={currentCard.exampleTranslation}
            />
          </View>

          <View style={{ flexDirection: 'row', gap: spacing.md }}>
            <Pressable
              onPress={handleAgain}
              style={{
                flex: 1,
                backgroundColor: '#e5e5e5',
                borderRadius: radius.md,
                paddingVertical: spacing.md,
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '600',
                }}>
                Again
              </Text>
            </Pressable>
            <Pressable
              onPress={handleGood}
              style={{
                flex: 1,
                backgroundColor: colors.primary,
                borderRadius: radius.md,
                paddingVertical: spacing.md,
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: colors.card,
                }}>
                Good
              </Text>
            </Pressable>
          </View>
        </ContentContainer>
      )}
    </SafeAreaView>
  );
}
