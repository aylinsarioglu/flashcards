import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';

import ContentContainer from '../components/ContentContainer';
import Flashcard from '../components/Flashcard';
import ProgressBar from '../components/ProgressBar';
import { useCards } from '../storage/CardsContext';

export default function StudyScreen() {
  const params = useLocalSearchParams<{ mode?: string }>();
  const mode = Array.isArray(params.mode) ? params.mode[0] : params.mode;

  const { cards } = useCards();
  const studyCards =
    mode === 'favorites'
      ? cards.filter(
          (card) =>
            (card as (typeof card & { favorite?: boolean })).favorite === true,
        )
      : cards;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [goodCount, setGoodCount] = useState(0);
  const [againCount, setAgainCount] = useState(0);

  const currentCard = studyCards[currentIndex];
  const progressPercent =
    studyCards.length > 0
      ? Math.round(((currentIndex + 1) / studyCards.length) * 100)
      : 0;
  const cardsRemaining = studyCards.length - (currentIndex + 1);
  const totalAnswers = goodCount + againCount;
  const accuracyPercent =
    totalAnswers === 0
      ? 100
      : Math.round((goodCount / totalAnswers) * 100);

  function handleGood() {
    setGoodCount((prev) => prev + 1);

    if (currentIndex === studyCards.length - 1) {
      setCompleted(true);
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  }

  function handleAgain() {
    setAgainCount((prev) => prev + 1);
  }

  function handleRestart() {
    setCompleted(false);
    setCurrentIndex(0);
    setGoodCount(0);
    setAgainCount(0);
  }

  if (studyCards.length === 0) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: 'center',
          backgroundColor: '#f8f9fa',
          paddingHorizontal: 24,
        }}>
        <ContentContainer style={{ alignItems: 'center' }}>
          <Text
            style={{
              fontSize: 72,
              marginBottom: 24,
            }}>
            📚
          </Text>
          <Text
            style={{
              fontSize: 32,
              fontWeight: 'bold',
              marginBottom: 12,
              color: '#1a1a1a',
              textAlign: 'center',
            }}>
            No Cards Yet
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: '#666',
              marginBottom: 40,
              textAlign: 'center',
              lineHeight: 24,
            }}>
            Create your first flashcard to start learning.
          </Text>
          <Pressable
            onPress={() => router.replace('/add-card')}
            style={({ pressed }) => ({
              width: '100%',
              backgroundColor: '#007AFF',
              paddingVertical: 18,
              borderRadius: 16,
              alignItems: 'center',
              opacity: pressed ? 0.85 : 1,
              shadowColor: '#007AFF',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.25,
              shadowRadius: 8,
              elevation: 4,
            })}>
            <Text
              style={{
                color: '#fff',
                fontSize: 16,
                fontWeight: '600',
              }}>
              Create Card
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
        backgroundColor: '#f8f9fa',
      }}>
      <ContentContainer style={{ paddingHorizontal: 24, paddingVertical: 12 }}>
        <Pressable onPress={() => router.replace('/')}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: '600',
              color: '#007AFF',
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
            paddingHorizontal: 24,
          }}>
          <ContentContainer style={{ alignItems: 'center' }}>
            <Text
              style={{
                fontSize: 88,
                marginBottom: 24,
              }}>
              🎉
            </Text>
            <Text
              style={{
                fontSize: 34,
                fontWeight: 'bold',
                marginBottom: 12,
                color: '#1a1a1a',
                textAlign: 'center',
              }}>
              Session Complete
            </Text>
            <Text
              style={{
                fontSize: 16,
                color: '#666',
                marginBottom: 40,
                textAlign: 'center',
                lineHeight: 24,
              }}>
              Great job! You finished this study session.
            </Text>

            <View
              style={{
                flexDirection: 'row',
                gap: 16,
                width: '100%',
                marginBottom: 40,
              }}>
              <View
                style={{
                  flex: 1,
                  backgroundColor: '#fff',
                  borderRadius: 20,
                  paddingVertical: 24,
                  paddingHorizontal: 16,
                  alignItems: 'center',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.08,
                  shadowRadius: 12,
                  elevation: 4,
                }}>
                <Text
                  style={{
                    fontSize: 32,
                    fontWeight: '700',
                    color: '#007AFF',
                    marginBottom: 8,
                  }}>
                  {goodCount}
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    color: '#666',
                    fontWeight: '600',
                    textAlign: 'center',
                  }}>
                  Good Answers
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  backgroundColor: '#fff',
                  borderRadius: 20,
                  paddingVertical: 24,
                  paddingHorizontal: 16,
                  alignItems: 'center',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.08,
                  shadowRadius: 12,
                  elevation: 4,
                }}>
                <Text
                  style={{
                    fontSize: 32,
                    fontWeight: '700',
                    color: '#ff9500',
                    marginBottom: 8,
                  }}>
                  {againCount}
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    color: '#666',
                    fontWeight: '600',
                    textAlign: 'center',
                  }}>
                  Again Presses
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  backgroundColor: '#fff',
                  borderRadius: 20,
                  paddingVertical: 24,
                  paddingHorizontal: 16,
                  alignItems: 'center',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.08,
                  shadowRadius: 12,
                  elevation: 4,
                }}>
                <Text
                  style={{
                    fontSize: 32,
                    fontWeight: '700',
                    color: '#34c759',
                    marginBottom: 8,
                  }}>
                  {accuracyPercent}%
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    color: '#666',
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
                  backgroundColor: '#007AFF',
                  paddingVertical: 18,
                  borderRadius: 16,
                  alignItems: 'center',
                  opacity: pressed ? 0.85 : 1,
                  shadowColor: '#007AFF',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.25,
                  shadowRadius: 8,
                  elevation: 4,
                })}>
                <Text
                  style={{
                    color: '#fff',
                    fontSize: 16,
                    fontWeight: '600',
                  }}>
                  Study Again
                </Text>
              </Pressable>
              <Pressable
                onPress={() => router.replace('/')}
                style={({ pressed }) => ({
                  backgroundColor: '#fff',
                  paddingVertical: 18,
                  borderRadius: 16,
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
                    color: '#1a1a1a',
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
            paddingHorizontal: 24,
            paddingBottom: 24,
          }}>
          <Text
            style={{
              fontSize: 22,
              fontWeight: '700',
              color: '#1a1a1a',
              textAlign: 'center',
              marginBottom: 24,
            }}>
            📚 Study Session
          </Text>

          <View style={{ marginBottom: 12 }}>
            <ProgressBar
              current={currentIndex + 1}
              total={studyCards.length}
            />
          </View>

          <Text
            style={{
              fontSize: 18,
              fontWeight: '700',
              color: '#007AFF',
              textAlign: 'center',
              marginBottom: 16,
            }}>
            {progressPercent}%
          </Text>

          <Text
            style={{
              fontSize: 14,
              color: '#666',
              textAlign: 'center',
              marginBottom: 16,
            }}>
            {cardsRemaining === 0
              ? 'Last card'
              : `${cardsRemaining} cards remaining`}
          </Text>

          <View
            style={{
              alignSelf: 'center',
              backgroundColor: '#eef4ff',
              borderRadius: 20,
              paddingHorizontal: 16,
              paddingVertical: 8,
              marginBottom: 32,
            }}>
            <Text
              style={{
                fontSize: 13,
                fontWeight: '600',
                color: '#007AFF',
              }}>
              {currentCard.deck}
            </Text>
          </View>

          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 32,
            }}>
            <Flashcard
              key={currentCard.id}
              front={currentCard.front}
              back={currentCard.back}
              deck={currentCard.deck}
              example={currentCard.example}
              exampleTranslation={currentCard.exampleTranslation}
            />
          </View>

          <View style={{ flexDirection: 'row', gap: 16 }}>
            <Pressable
              onPress={handleAgain}
              style={{
                flex: 1,
                backgroundColor: '#e5e5e5',
                borderRadius: 12,
                paddingVertical: 16,
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
                backgroundColor: '#007AFF',
                borderRadius: 12,
                paddingVertical: 16,
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: '#fff',
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
