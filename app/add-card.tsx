import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { useCards } from '../storage/CardsContext';
import type { Card } from '../types/card';

export default function AddCardScreen() {
  const { cards, setCards } = useCards();
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [example, setExample] = useState('');
  const [exampleTranslation, setExampleTranslation] = useState('');
  const [category, setCategory] = useState('');

  function handleAddCard() {
    const newCard: Card = {
      id: Date.now().toString(),
      front,
      back,
      category,
      ...(example ? { example } : {}),
      ...(exampleTranslation ? { exampleTranslation } : {}),
    };

    setCards([...cards, newCard]);

    setFront('');
    setBack('');
    setExample('');
    setExampleTranslation('');
    setCategory('');

    router.replace('/');
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
      }}>
      <View style={{ width: '100%', maxWidth: 320 }}>
        <Text
          style={{
            fontSize: 14,
            fontWeight: '600',
            marginBottom: 6,
          }}>
          Front
        </Text>
        <TextInput
          value={front}
          onChangeText={setFront}
          placeholder="Enter front text"
          style={{
            borderWidth: 1,
            borderColor: '#ddd',
            borderRadius: 8,
            paddingHorizontal: 12,
            paddingVertical: 10,
            marginBottom: 16,
            fontSize: 16,
          }}
        />
        <Text
          style={{
            fontSize: 14,
            fontWeight: '600',
            marginBottom: 6,
          }}>
          Back
        </Text>
        <TextInput
          value={back}
          onChangeText={setBack}
          placeholder="Enter back text"
          style={{
            borderWidth: 1,
            borderColor: '#ddd',
            borderRadius: 8,
            paddingHorizontal: 12,
            paddingVertical: 10,
            marginBottom: 16,
            fontSize: 16,
          }}
        />
        <Text
          style={{
            fontSize: 14,
            fontWeight: '600',
            marginBottom: 6,
          }}>
          Example (optional)
        </Text>
        <TextInput
          value={example}
          onChangeText={setExample}
          placeholder="Enter example sentence"
          style={{
            borderWidth: 1,
            borderColor: '#ddd',
            borderRadius: 8,
            paddingHorizontal: 12,
            paddingVertical: 10,
            marginBottom: 16,
            fontSize: 16,
          }}
        />
        <Text
          style={{
            fontSize: 14,
            fontWeight: '600',
            marginBottom: 6,
          }}>
          Example Translation (optional)
        </Text>
        <TextInput
          value={exampleTranslation}
          onChangeText={setExampleTranslation}
          placeholder="Enter example translation"
          style={{
            borderWidth: 1,
            borderColor: '#ddd',
            borderRadius: 8,
            paddingHorizontal: 12,
            paddingVertical: 10,
            marginBottom: 16,
            fontSize: 16,
          }}
        />
        <Text
          style={{
            fontSize: 14,
            fontWeight: '600',
            marginBottom: 6,
          }}>
          Category
        </Text>
        <TextInput
          value={category}
          onChangeText={setCategory}
          placeholder="Enter category"
          style={{
            borderWidth: 1,
            borderColor: '#ddd',
            borderRadius: 8,
            paddingHorizontal: 12,
            paddingVertical: 10,
            marginBottom: 24,
            fontSize: 16,
          }}
        />
        <Pressable
          onPress={handleAddCard}
          style={({ pressed }) => ({
            backgroundColor: pressed ? '#0056b3' : '#007AFF',
            paddingVertical: 12,
            borderRadius: 8,
            alignItems: 'center',
          })}>
          <Text
            style={{
              color: '#fff',
              fontSize: 16,
              fontWeight: '600',
            }}>
            Add Card
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
