import { useState } from 'react';
import { Pressable, Text, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import ContentContainer from '../components/ContentContainer';
import { darkTheme, lightTheme, radius, spacing } from '../constants/theme';
import { useCards } from '../storage/CardsContext';
import { useTheme } from '../storage/ThemeContext';
import type { Card } from '../types/card';

export default function AddCardScreen() {
  const { cards, setCards } = useCards();
  const { isDark } = useTheme();
  const colors = isDark ? darkTheme : lightTheme;
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
      learned: false,
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
    borderColor: isDark ? '#333333' : '#ddd',
    borderRadius: radius.sm,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: spacing.md,
    fontSize: 16,
    backgroundColor: colors.card,
    color: colors.text,
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
            color: colors.text,
          }}>
          Front
        </Text>
        <TextInput
          value={front}
          onChangeText={setFront}
          placeholder="Enter front text"
          placeholderTextColor={colors.muted}
          style={inputStyle}
        />
        <Text
          style={{
            fontSize: 14,
            fontWeight: '600',
            marginBottom: 6,
            color: colors.text,
          }}>
          Back
        </Text>
        <TextInput
          value={back}
          onChangeText={setBack}
          placeholder="Enter back text"
          placeholderTextColor={colors.muted}
          style={inputStyle}
        />
        <Text
          style={{
            fontSize: 14,
            fontWeight: '600',
            marginBottom: 6,
            color: colors.text,
          }}>
          Example (optional)
        </Text>
        <TextInput
          value={example}
          onChangeText={setExample}
          placeholder="Enter example sentence"
          placeholderTextColor={colors.muted}
          style={inputStyle}
        />
        <Text
          style={{
            fontSize: 14,
            fontWeight: '600',
            marginBottom: 6,
            color: colors.text,
          }}>
          Example Translation (optional)
        </Text>
        <TextInput
          value={exampleTranslation}
          onChangeText={setExampleTranslation}
          placeholder="Enter example translation"
          placeholderTextColor={colors.muted}
          style={inputStyle}
        />
        <Text
          style={{
            fontSize: 14,
            fontWeight: '600',
            marginBottom: 6,
            color: colors.text,
          }}>
          Deck
        </Text>
        <TextInput
          value={deck}
          onChangeText={setDeck}
          placeholder="Deck Name"
          placeholderTextColor={colors.muted}
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
