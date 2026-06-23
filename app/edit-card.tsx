import { useEffect, useState } from 'react';
import { ScrollView, Switch, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import AppButton from '../components/AppButton';
import AppCard from '../components/AppCard';
import AppInput from '../components/AppInput';
import ScreenContainer from '../components/ScreenContainer';
import { FadeInView, motion } from '../components/animations';
import { PageHeader } from '../components/ui';
import { layout, spacing, typography } from '../constants/theme';
import { useCards } from '../storage/CardsContext';
import { useTheme } from '../storage/ThemeContext';
import type { Card } from '../types/card';

function ToggleRow({
  label,
  description,
  value,
  onValueChange,
  activeColor,
  colors,
}: {
  label: string;
  description: string;
  value: boolean;
  onValueChange: (next: boolean) => void;
  activeColor: string;
  colors: ReturnType<typeof useTheme>['colors'];
}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: spacing.md,
        paddingVertical: spacing.sm,
        borderTopWidth: 1,
        borderTopColor: colors.borderLight,
        marginTop: spacing.md,
      }}>
      <View style={{ flex: 1 }}>
        <Text style={[typography.subtitle, { color: colors.text }]}>{label}</Text>
        <Text style={[typography.caption, { color: colors.muted, marginTop: 2 }]}>
          {description}
        </Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: colors.track, true: activeColor + '66' }}
        thumbColor={value ? activeColor : colors.muted}
      />
    </View>
  );
}

export default function EditCardScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const cardId = Array.isArray(params.id) ? params.id[0] : params.id;

  const { cards, setCards } = useCards();
  const { colors } = useTheme();
  const existingCard = cards.find((card) => card.id === cardId);

  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [example, setExample] = useState('');
  const [exampleTranslation, setExampleTranslation] = useState('');
  const [deck, setDeck] = useState('');
  const [favorite, setFavorite] = useState(false);
  const [learned, setLearned] = useState(false);

  useEffect(() => {
    if (!existingCard) {
      return;
    }

    setFront(existingCard.front);
    setBack(existingCard.back);
    setExample(existingCard.example ?? '');
    setExampleTranslation(existingCard.exampleTranslation ?? '');
    setDeck(existingCard.deck);
    setFavorite(existingCard.favorite === true);
    setLearned(existingCard.learned);
  }, [existingCard]);

  const canSave = Boolean(front.trim() && back.trim() && deck.trim() && existingCard);

  function handleSaveChanges() {
    if (!canSave || !existingCard) {
      return;
    }

    const trimmedFront = front.trim();
    const trimmedBack = back.trim();
    const trimmedDeck = deck.trim();
    const trimmedExample = example.trim();
    const trimmedExampleTranslation = exampleTranslation.trim();

    const updated: Card = {
      ...existingCard,
      front: trimmedFront,
      back: trimmedBack,
      deck: trimmedDeck,
      category: trimmedDeck,
      learned,
      favorite,
    };

    if (trimmedExample) {
      updated.example = trimmedExample;
    } else {
      delete updated.example;
    }

    if (trimmedExampleTranslation) {
      updated.exampleTranslation = trimmedExampleTranslation;
    } else {
      delete updated.exampleTranslation;
    }

    if (!favorite) {
      delete updated.favorite;
    }

    setCards(cards.map((card) => (card.id === cardId ? updated : card)));
    router.replace('/cards');
  }

  if (!existingCard) {
    return (
      <ScreenContainer style={{ paddingHorizontal: layout.contentPadding }}>
        <View style={{ flex: 1, justifyContent: 'center', paddingVertical: spacing.xxl }}>
          <AppCard style={{ alignItems: 'center' }}>
            <Text style={[typography.title, { color: colors.text, marginBottom: spacing.sm }]}>
              Card not found
            </Text>
            <Text style={[typography.body, { color: colors.muted, marginBottom: spacing.lg }]}>
              This card may have been deleted.
            </Text>
            <AppButton title="Back to Manage Cards" onPress={() => router.replace('/cards')} />
          </AppCard>
        </View>
      </ScreenContainer>
    );
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

            <ToggleRow
              label="Favorite"
              description="Show in favorites study mode"
              value={favorite}
              onValueChange={setFavorite}
              activeColor={colors.warning}
              colors={colors}
            />
            <ToggleRow
              label="Learned"
              description="Mark as mastered"
              value={learned}
              onValueChange={setLearned}
              activeColor={colors.success}
              colors={colors}
            />
          </AppCard>
        </FadeInView>

        <FadeInView delay={motion.stagger * 2}>
          <View style={{ marginTop: spacing.lg, gap: spacing.sm }}>
            <AppButton title="Save Changes" onPress={handleSaveChanges} disabled={!canSave} />
            <AppButton
              title="Cancel"
              variant="outline"
              onPress={() => router.back()}
            />
          </View>
        </FadeInView>
      </ScrollView>
    </ScreenContainer>
  );
}
