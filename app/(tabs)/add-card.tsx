import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { router } from 'expo-router';

import ScreenContainer from '../../components/ScreenContainer';
import {
  AppCard,
  PageHeader,
  PrimaryButton,
  TextField,
} from '../../components/ui';
import {
  layout,
  spacing,
} from '../../constants/theme';
import { useCards } from '../../storage/CardsContext';
import { useTheme } from '../../storage/ThemeContext';
import type { Card } from '../../types/card';

export default function AddCardScreen() {
  const { cards, setCards } = useCards();
  const { colors, isDark } = useTheme();
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [example, setExample] = useState('');
  const [exampleTranslation, setExampleTranslation] = useState('');
  const [deck, setDeck] = useState('');

  const canSubmit = front.trim() && back.trim() && deck.trim();

  function handleAddCard() {
    if (!canSubmit) {
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

    router.replace('/cards');
  }

  return (
    <ScreenContainer style={{ paddingHorizontal: layout.contentPadding }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingTop: spacing.lg,
          paddingBottom: spacing.xxl,
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <PageHeader
          title="Add Card"
          subtitle="Build your deck with rich examples and translations."
          colors={colors}
        />

        <AppCard colors={colors} isDark={isDark} accentColor={colors.primary}>
          <TextField
            label="Front"
            value={front}
            onChangeText={setFront}
            placeholder="e.g. make a decision"
            colors={colors}
            isDark={isDark}
          />
          <TextField
            label="Back"
            value={back}
            onChangeText={setBack}
            placeholder="e.g. karar vermek"
            colors={colors}
            isDark={isDark}
          />
          <TextField
            label="Example"
            value={example}
            onChangeText={setExample}
            placeholder="e.g. She made a difficult decision."
            colors={colors}
            isDark={isDark}
            multiline
          />
          <TextField
            label="Example Translation"
            value={exampleTranslation}
            onChangeText={setExampleTranslation}
            placeholder="e.g. Zor bir karar verdi."
            colors={colors}
            isDark={isDark}
            multiline
          />
          <TextField
            label="Deck"
            value={deck}
            onChangeText={setDeck}
            placeholder="e.g. Collocations"
            colors={colors}
            isDark={isDark}
            style={{ marginBottom: 0 }}
          />
        </AppCard>

        <View style={{ marginTop: spacing.lg }}>
          <PrimaryButton
            label="Add Card"
            icon="add-circle"
            onPress={handleAddCard}
            colors={colors}
            isDark={isDark}
            disabled={!canSubmit}
          />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
