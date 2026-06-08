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
    <SafeAreaView style={{ flex: 1 }}>
      <Pressable
        onPress={() => router.replace('/')}
        style={{
          alignSelf: 'flex-start',
          paddingHorizontal: 16,
          paddingVertical: 12,
        }}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: '600',
          }}>
          ← Back
        </Text>
      </Pressable>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        {completed ? (
          <>
            <Text
              style={{
                fontSize: 32,
                fontWeight: 'bold',
                marginBottom: 8,
              }}>
              Session Complete 🎉
            </Text>
            <Text
              style={{
                fontSize: 16,
                color: '#666',
                marginBottom: 32,
              }}>
              You reviewed all cards
            </Text>
            <Pressable
              onPress={handleRestart}
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
                Restart Session
              </Text>
            </Pressable>
          </>
        ) : (
          <>
            <View style={{ marginBottom: 16 }}>
              <ProgressBar
                current={currentIndex + 1}
                total={cards.length}
              />
            </View>
            <Pressable
              style={{
                backgroundColor: '#e5e5e5',
                borderRadius: 20,
                paddingHorizontal: 16,
                paddingVertical: 8,
                marginBottom: 8,
              }}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '500',
                }}>
                {currentCard.category} ({cards.length})
              </Text>
            </Pressable>
            <View style={{ alignItems: 'center', marginBottom: 24 }}>
              <Text
                style={{
                  fontSize: 14,
                  color: '#666',
                }}>
                Card {currentIndex + 1} / {cards.length}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: '#666',
                  marginTop: 4,
                }}>
                {cards.length - (currentIndex + 1) === 0
                  ? 'Last card'
                  : `${cards.length - (currentIndex + 1)} cards remaining`}
              </Text>
            </View>
            <Flashcard
              key={currentCard.id}
              front={currentCard.front}
              back={currentCard.back}
              example={currentCard.example}
              exampleTranslation={currentCard.exampleTranslation}
            />
            <View
              style={{
                flexDirection: 'row',
                marginTop: 24,
                gap: 16,
              }}>
              <Pressable
                onPress={handleAgain}
                style={{
                  width: 120,
                  backgroundColor: '#e5e5e5',
                  borderRadius: 8,
                  paddingVertical: 12,
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
                  borderRadius: 8,
                  paddingVertical: 12,
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
