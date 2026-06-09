import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import Flashcard from '../components/Flashcard';
import ProgressBar from '../components/ProgressBar';
import { useCards } from '../storage/CardsContext';

export default function StudyScreen() {
  const { cards } = useCards();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completed, setCompleted] = useState(false);

  const currentCard = cards[currentIndex];
  const progressPercent =
    cards.length > 0
      ? Math.round(((currentIndex + 1) / cards.length) * 100)
      : 0;
  const cardsRemaining = cards.length - (currentIndex + 1);

  function handleGood() {
    if (currentIndex === cards.length - 1) {
      setCompleted(true);
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  }

  function handleAgain() {}

  function handleRestart() {
    setCompleted(false);
    setCurrentIndex(0);
  }

  if (cards.length === 0) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#f8f9fa',
        }}>
        <Text
          style={{
            fontSize: 32,
            fontWeight: 'bold',
            marginBottom: 32,
          }}>
          No Cards Yet
        </Text>
        <Pressable
          onPress={() => router.replace('/add-card')}
          style={({ pressed }) => ({
            backgroundColor: pressed ? '#0056b3' : '#007AFF',
            paddingHorizontal: 24,
            paddingVertical: 12,
            borderRadius: 8,
          })}>
          <Text
            style={{
              color: '#fff',
              fontSize: 16,
              fontWeight: '600',
            }}>
            Create Cards
          </Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#f8f9fa',
      }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 16,
          paddingVertical: 12,
        }}>
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
        {!completed && (
          <Text
            style={{
              fontSize: 18,
              fontWeight: '700',
              color: '#1a1a1a',
            }}>
            Study Session
          </Text>
        )}
        <View style={{ width: 60 }} />
      </View>

      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 24,
        }}>
        {completed ? (
          <View style={{ width: '100%', maxWidth: 320, alignItems: 'center' }}>
            <Text style={{ fontSize: 72, marginBottom: 16 }}>🎉</Text>
            <Text
              style={{
                fontSize: 32,
                fontWeight: 'bold',
                marginBottom: 8,
                color: '#1a1a1a',
                textAlign: 'center',
              }}>
              Session Complete 🎉
            </Text>
            <Text
              style={{
                fontSize: 16,
                color: '#666',
                marginBottom: 32,
                textAlign: 'center',
              }}>
              Great job! You finished this study session.
            </Text>

            <View
              style={{
                flexDirection: 'row',
                gap: 12,
                width: '100%',
                marginBottom: 32,
              }}>
              <View
                style={{
                  flex: 1,
                  backgroundColor: '#fff',
                  borderRadius: 16,
                  padding: 20,
                  alignItems: 'center',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.06,
                  shadowRadius: 8,
                  elevation: 2,
                }}>
                <Text
                  style={{
                    fontSize: 28,
                    fontWeight: '700',
                    color: '#007AFF',
                    marginBottom: 4,
                  }}>
                  {cards.length}
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    color: '#666',
                    fontWeight: '500',
                    textAlign: 'center',
                  }}>
                  Cards Reviewed
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  backgroundColor: '#fff',
                  borderRadius: 16,
                  padding: 20,
                  alignItems: 'center',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.06,
                  shadowRadius: 8,
                  elevation: 2,
                }}>
                <Text
                  style={{
                    fontSize: 28,
                    fontWeight: '700',
                    color: '#34c759',
                    marginBottom: 4,
                  }}>
                  100%
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    color: '#666',
                    fontWeight: '500',
                    textAlign: 'center',
                  }}>
                  Study Accuracy
                </Text>
              </View>
            </View>

            <View style={{ width: '100%', gap: 12 }}>
              <Pressable
                onPress={handleRestart}
                style={({ pressed }) => ({
                  backgroundColor: pressed ? '#0056b3' : '#007AFF',
                  paddingVertical: 16,
                  borderRadius: 12,
                  alignItems: 'center',
                })}>
                <Text
                  style={{
                    color: '#fff',
                    fontSize: 16,
                    fontWeight: '600',
                  }}>
                  Restart Session
                </Text>
              </Pressable>
              <Pressable
                onPress={() => router.replace('/')}
                style={({ pressed }) => ({
                  backgroundColor: pressed ? '#d1d1d1' : '#e5e5e5',
                  paddingVertical: 16,
                  borderRadius: 12,
                  alignItems: 'center',
                })}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '600',
                  }}>
                  Back Home
                </Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <>
            <View
              style={{
                width: '100%',
                maxWidth: 320,
                backgroundColor: '#fff',
                borderRadius: 16,
                padding: 20,
                marginBottom: 24,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.06,
                shadowRadius: 8,
                elevation: 2,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 16,
                }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '600',
                    color: '#666',
                  }}>
                  Progress
                </Text>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: '700',
                    color: '#007AFF',
                  }}>
                  {progressPercent}%
                </Text>
              </View>

              <ProgressBar
                current={currentIndex + 1}
                total={cards.length}
              />

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: 16,
                  paddingTop: 16,
                  borderTopWidth: 1,
                  borderTopColor: '#f0f0f0',
                }}>
                <View>
                  <Text
                    style={{
                      fontSize: 12,
                      color: '#999',
                      marginBottom: 4,
                    }}>
                    Current
                  </Text>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: '600',
                      color: '#1a1a1a',
                    }}>
                    Card {currentIndex + 1} / {cards.length}
                  </Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text
                    style={{
                      fontSize: 12,
                      color: '#999',
                      marginBottom: 4,
                    }}>
                    Remaining
                  </Text>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: '600',
                      color: '#1a1a1a',
                    }}>
                    {cardsRemaining === 0
                      ? 'Last card'
                      : `${cardsRemaining} cards`}
                  </Text>
                </View>
              </View>
            </View>

            <Pressable
              style={{
                backgroundColor: '#e5e5e5',
                borderRadius: 20,
                paddingHorizontal: 16,
                paddingVertical: 8,
                marginBottom: 24,
              }}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '500',
                }}>
                {currentCard.category} ({cards.length})
              </Text>
            </Pressable>

            <Flashcard
              key={currentCard.id}
              front={currentCard.front}
              back={currentCard.back}
              deck={currentCard.deck}
              example={currentCard.example}
              exampleTranslation={currentCard.exampleTranslation}
            />

            <View
              style={{
                flexDirection: 'row',
                marginTop: 32,
                gap: 16,
              }}>
              <Pressable
                onPress={handleAgain}
                style={{
                  width: 120,
                  backgroundColor: '#e5e5e5',
                  borderRadius: 12,
                  paddingVertical: 14,
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
                  width: 120,
                  backgroundColor: '#007AFF',
                  borderRadius: 12,
                  paddingVertical: 14,
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
          </>
        )}
      </View>
    </SafeAreaView>
  );
}
