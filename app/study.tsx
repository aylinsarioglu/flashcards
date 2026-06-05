import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Flashcard from '../components/Flashcard';
import { starterCards } from '../data/starterCards';

export default function StudyScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentCard = starterCards[currentIndex];

  function handleGood() {
    setCurrentIndex((prev) =>
      prev === starterCards.length - 1 ? 0 : prev + 1,
    );
  }

  function handleAgain() {}

  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
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
          Collocations (2)
        </Text>
      </Pressable>
      <Text
        style={{
          fontSize: 14,
          color: '#666',
          marginBottom: 24,
        }}>
        Card {currentIndex + 1} / {starterCards.length}
      </Text>
      <Flashcard
        key={currentCard.id}
        front={currentCard.front}
        back={currentCard.back}
        example={currentCard.example}
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
    </SafeAreaView>
  );
}
