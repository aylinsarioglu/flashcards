import { useState, type ReactNode } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';

import ScreenContainer from '../components/ScreenContainer';
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

  const labelStyle = {
    fontSize: 13,
    fontWeight: '700' as const,
    color: colors.muted,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.6,
    marginBottom: spacing.sm,
  };

  const inputStyle = {
    borderWidth: 1,
    borderColor: isDark ? '#333333' : '#e0e0e0',
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    fontSize: 16,
    backgroundColor: colors.card,
    color: colors.text,
  };

  function Field({
    label,
    children,
  }: {
    label: string;
    children: ReactNode;
  }) {
    return (
      <View style={{ marginBottom: spacing.lg }}>
        <Text style={labelStyle}>{label}</Text>
        {children}
      </View>
    );
  }

  return (
    <ScreenContainer
      style={{
        backgroundColor: colors.background,
        paddingHorizontal: spacing.lg,
      }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingVertical: spacing.xl,
          paddingBottom: spacing.xl,
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <Text
          style={{
            fontSize: 32,
            fontWeight: '700',
            color: colors.text,
            marginBottom: spacing.sm,
          }}>
          Add Card
        </Text>
        <Text
          style={{
            fontSize: 16,
            color: colors.muted,
            marginBottom: spacing.xl,
            lineHeight: spacing.lg,
          }}>
          Create a new flashcard for your deck.
        </Text>

        <Field label="Front">
          <TextInput
            value={front}
            onChangeText={setFront}
            placeholder="e.g. make a decision"
            placeholderTextColor={colors.muted}
            style={inputStyle}
          />
        </Field>

        <Field label="Back">
          <TextInput
            value={back}
            onChangeText={setBack}
            placeholder="e.g. to decide something"
            placeholderTextColor={colors.muted}
            style={inputStyle}
          />
        </Field>

        <Field label="Example">
          <TextInput
            value={example}
            onChangeText={setExample}
            placeholder="e.g. She made a difficult decision."
            placeholderTextColor={colors.muted}
            style={inputStyle}
            multiline
          />
        </Field>

        <Field label="Example Translation">
          <TextInput
            value={exampleTranslation}
            onChangeText={setExampleTranslation}
            placeholder="e.g. Ella tomó una decisión difícil."
            placeholderTextColor={colors.muted}
            style={inputStyle}
            multiline
          />
        </Field>

        <Field label="Deck">
          <TextInput
            value={deck}
            onChangeText={setDeck}
            placeholder="e.g. Collocations"
            placeholderTextColor={colors.muted}
            style={inputStyle}
          />
        </Field>

        <Pressable
          onPress={handleAddCard}
          style={({ pressed }) => ({
            backgroundColor: colors.primary,
            paddingVertical: 18,
            borderRadius: radius.lg,
            alignItems: 'center',
            marginTop: spacing.sm,
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
            Add Card
          </Text>
        </Pressable>
      </ScrollView>
    </ScreenContainer>
  );
}
