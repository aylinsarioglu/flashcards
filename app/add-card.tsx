import { useState } from 'react';
import { Pressable, Text, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import ContentContainer from '../components/ContentContainer';
import { colors, radius, spacing } from '../constants/theme';
import { useCards } from '../storage/CardsContext';
import type { Card } from '../types/card';

export default function AddCardScreen() {
  const { cards, setCards } = useCards();
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [example, setExample] = useState('');
  const [exampleTranslation, setExampleTranslation] = useState('');
  const [deck, setDeck] = useState('');

  function handleAddCard() {
    if (!front.trim() || !back.trim() || !deck.trim()) {
      return;
    }

    const newCard: Card = {
      id: Date.now().toString(),
      front,
      back,
      category: deck,
      deck,
      ...(example ? { example } : {}),
      ...(exampleTranslation ? { exampleTranslation } : {}),
    };

    setCards([...cards, newCard]);

    setFront('');
    setBack('');
    setExample('');
    setExampleTranslation('');
    setDeck('');

    router.replace('/');
  }

  const inputStyle = {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: radius.sm,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: spacing.md,
    fontSize: 16,
    backgroundColor: colors.card,
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: 'center',
        backgroundColor: colors.background,
        paddingHorizontal: spacing.lg,
      }}>
      <ContentContainer>
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
          style={inputStyle}
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
          style={inputStyle}
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
          style={inputStyle}
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
          style={inputStyle}
        />
        <Text
          style={{
            fontSize: 14,
            fontWeight: '600',
            marginBottom: 6,
          }}>
          Deck
        </Text>
        <TextInput
          value={deck}
          onChangeText={setDeck}
          placeholder="Deck Name"
          style={{
            ...inputStyle,
            marginBottom: spacing.lg,
          }}
        />
        <Pressable
          onPress={handleAddCard}
          style={({ pressed }) => ({
            backgroundColor: pressed ? '#0056b3' : colors.primary,
            paddingVertical: 12,
            borderRadius: radius.sm,
            alignItems: 'center',
          })}>
          <Text
            style={{
              color: colors.card,
              fontSize: 16,
              fontWeight: '600',
            }}>
            Add Card
          </Text>
        </Pressable>
      </ContentContainer>
    </SafeAreaView>
  );
}
