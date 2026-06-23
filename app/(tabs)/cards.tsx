import { FlatList, Text, View } from 'react-native';
import { useMemo, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import AppButton from '../../components/AppButton';
import AppCard from '../../components/AppCard';
import CardSearch from '../../components/CardSearch';
import ScreenContainer from '../../components/ScreenContainer';
import { FadeInView, motion, PressableScale } from '../../components/animations';
import { Badge, IconCircle, PageHeader } from '../../components/ui';
import { layout, radius, spacing, typography } from '../../constants/theme';
import { useCards } from '../../storage/CardsContext';
import { useTheme } from '../../storage/ThemeContext';
import type { Card } from '../../types/card';

type CardWithFavorite = Card & { favorite?: boolean };

export default function CardsScreen() {
  const { cards, setCards } = useCards();
  const { colors } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');

  const learnedCount = cards.filter((card) => card.learned).length;

  const displayedCards = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return cards;
    }

    return cards.filter((card) => {
      const haystack = [card.front, card.back, card.deck, card.example, card.category]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return haystack.includes(query);
    });
  }, [cards, searchQuery]);

  function handleDelete(id: string) {
    setCards(cards.filter((card) => card.id !== id));
  }

  function renderCard({ item }: { item: Card }) {
    const card = item as CardWithFavorite;
    const isFavorite = card.favorite === true;

    return (
      <AppCard
        style={{ marginBottom: spacing.md }}
        accentColor={card.learned ? colors.success : colors.primary}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: spacing.md,
            gap: spacing.md,
          }}>
          <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
            <Badge
              label={card.deck}
              icon="folder"
              backgroundColor={colors.primarySoft}
              textColor={colors.primary}
            />
            <Badge
              label={card.learned ? 'Learned' : 'Learning'}
              icon={card.learned ? 'checkmark-circle' : 'time'}
              backgroundColor={card.learned ? colors.successSoft : colors.surface}
              textColor={card.learned ? colors.success : colors.muted}
            />
          </View>

          <PressableScale
            scaleTo={motion.cardPressScale}
            style={{
              width: 44,
              height: 44,
              borderRadius: radius.full,
              backgroundColor: isFavorite ? colors.warningSoft : colors.surface,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Ionicons
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={22}
              color={isFavorite ? colors.warning : colors.muted}
            />
          </PressableScale>
        </View>

        <View style={{ marginBottom: spacing.md }}>
          <Text style={[typography.label, { color: colors.muted, marginBottom: spacing.xs }]}>
            Front
          </Text>
          <Text style={[typography.title, { color: colors.text }]}>{card.front}</Text>
        </View>

        <View style={{ marginBottom: spacing.md }}>
          <Text style={[typography.label, { color: colors.muted, marginBottom: spacing.xs }]}>
            Back
          </Text>
          <Text style={[typography.bodyMedium, { color: colors.text }]}>{card.back}</Text>
        </View>

        {card.example ? (
          <View
            style={{
              backgroundColor: colors.surfaceElevated,
              borderRadius: radius.lg,
              padding: spacing.md,
              marginBottom: spacing.md,
            }}>
            <Text style={[typography.body, { color: colors.muted, fontStyle: 'italic' }]}>
              {card.example}
            </Text>
          </View>
        ) : null}

        <View style={{ flexDirection: 'row', gap: spacing.sm }}>
          <View style={{ flex: 1 }}>
            <AppButton
              title="Edit"
              onPress={() => router.push(`/edit-card?id=${card.id}`)}
            />
          </View>
          <View style={{ flex: 1 }}>
            <AppButton
              title="Delete"
              variant="danger"
              onPress={() => handleDelete(card.id)}
            />
          </View>
        </View>
      </AppCard>
    );
  }

  return (
    <ScreenContainer>
      <View style={{ paddingHorizontal: layout.contentPadding, paddingTop: spacing.lg }}>
        <FadeInView delay={0}>
          <PageHeader
            title="Manage Cards"
            subtitle={`${cards.length} cards · ${learnedCount} learned`}
            colors={colors}
            right={
              <PressableScale
                onPress={() => router.push('/add-card')}
                scaleTo={motion.cardPressScale}>
                <IconCircle
                  icon="add"
                  backgroundColor={colors.primarySoft}
                  iconColor={colors.primary}
                />
              </PressableScale>
            }
          />
        </FadeInView>

        {cards.length > 0 ? (
          <FadeInView delay={motion.stagger}>
            <View
              style={{
                flexDirection: 'row',
                gap: spacing.sm,
                marginBottom: spacing.md,
              }}>
              <AppCard style={{ flex: 1, padding: spacing.md }}>
                <Text style={[typography.caption, { color: colors.muted }]}>Total</Text>
                <Text style={[typography.title, { color: colors.text }]}>{cards.length}</Text>
              </AppCard>
              <AppCard style={{ flex: 1, padding: spacing.md }}>
                <Text style={[typography.caption, { color: colors.muted }]}>Learned</Text>
                <Text style={[typography.title, { color: colors.success }]}>{learnedCount}</Text>
              </AppCard>
            </View>
          </FadeInView>
        ) : null}

        <FadeInView delay={motion.stagger * 2}>
          <CardSearch
            cards={cards}
            onSelectCard={(card) => router.push(`/edit-card?id=${card.id}`)}
            onQueryChange={setSearchQuery}
            style={{ marginBottom: spacing.md }}
          />
        </FadeInView>
      </View>

      <FlatList
        data={displayedCards}
        keyExtractor={(item) => item.id}
        renderItem={renderCard}
        contentContainerStyle={{
          paddingHorizontal: layout.contentPadding,
          paddingBottom: spacing.xxl,
        }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <AppCard style={{ alignItems: 'center' }}>
            <IconCircle
              icon="albums-outline"
              backgroundColor={colors.primarySoft}
              iconColor={colors.primary}
              size={56}
            />
            <Text
              style={[
                typography.title,
                { color: colors.text, textAlign: 'center', marginTop: spacing.lg },
              ]}>
              No cards yet
            </Text>
            <Text
              style={[
                typography.body,
                {
                  color: colors.muted,
                  textAlign: 'center',
                  marginTop: spacing.sm,
                  marginBottom: spacing.lg,
                },
              ]}>
              Create your first flashcard and start building your library.
            </Text>
            <AppButton title="Create Card" onPress={() => router.push('/add-card')} />
          </AppCard>
        }
      />
    </ScreenContainer>
  );
}
