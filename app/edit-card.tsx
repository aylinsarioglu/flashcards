import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import AppButton from '../components/AppButton';
import AppCard from '../components/AppCard';
import AppInput from '../components/AppInput';
import ScreenContainer from '../components/ScreenContainer';
import { FadeInView, motion } from '../components/animations';
import { PageHeader } from '../components/ui';
import { layout, spacing } from '../constants/theme';
import { useCards } from '../storage/CardsContext';
import { useTheme } from '../storage/ThemeContext';

export default function EditCardScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const cardId = Array.isArray(params.id) ? params.id[0] : params.id;

  const { cards, setCards } = useCards();
  const { colors } = useTheme();
  const existingCard = cards.find((card) => card.id === cardId);

  const [front, setFront] = useState(existingCard?.front ?? '');
  const [back, setBack] = useState(existingCard?.back ?? '');
  const [example, setExample] = useState(existingCard?.example ?? '');
  const [exampleTranslation, setExampleTranslation] = useState(
    existingCard?.exampleTranslation ?? '',
  );
  const [deck, setDeck] = useState(existingCard?.deck ?? '');

  const canSave = front.trim() && back.trim() && deck.trim() && existingCard;

  function handleSaveChanges() {
    if (!canSave) {
      return;
    }

    setCards(
      cards.map((card) =>
        card.id === cardId
          ? {
              ...card,
              front,
              back,
              category: deck,
              deck,
              ...(example ? { example } : {}),
              ...(exampleTranslation ? { exampleTranslation } : {}),
            }
          : card,
      ),
    );

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
        <FadeInView delay={0}>
          <PageHeader
            title="Edit Card"
            subtitle="Update your flashcard details."
            colors={colors}
          />
        </FadeInView>

        <FadeInView delay={motion.stagger}>
          <AppCard accentColor={colors.primary}>
          <AppInput
            label="Front"
            value={front}
            onChangeText={setFront}
            placeholder="Enter front text"
          />
          <AppInput
            label="Back"
            value={back}
            onChangeText={setBack}
            placeholder="Enter back text"
          />
          <AppInput
            label="Example"
            value={example}
            onChangeText={setExample}
            placeholder="Enter example sentence"
            multiline
          />
          <AppInput
            label="Example Translation"
            value={exampleTranslation}
            onChangeText={setExampleTranslation}
            placeholder="Enter example translation"
            multiline
          />
          <AppInput
            label="Deck"
            value={deck}
            onChangeText={setDeck}
            placeholder="Deck name"
            style={{ marginBottom: 0 }}
          />
        </AppCard>
        </FadeInView>

        <FadeInView delay={motion.stagger * 2}>
          <View style={{ marginTop: spacing.lg }}>
            <AppButton
              title="Save Changes"
              onPress={handleSaveChanges}
              disabled={!canSave}
            />
          </View>
        </FadeInView>
      </ScrollView>
    </ScreenContainer>
  );
}
