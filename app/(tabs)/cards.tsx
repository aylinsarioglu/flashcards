import { FlatList, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import ScreenContainer from '../../components/ScreenContainer';
import {
  AppCard,
  Badge,
  IconCircle,
  PageHeader,
  PrimaryButton,
} from '../../components/ui';
import {
  cardRadius,
  getShadow,
  layout,
  radius,
  spacing,
  typography,
} from '../../constants/theme';
import { useCards } from '../../storage/CardsContext';
import { useTheme } from '../../storage/ThemeContext';
import type { Card } from '../../types/card';

type CardWithFavorite = Card & { favorite?: boolean };

export default function CardsScreen() {
  const { cards, setCards } = useCards();
  const { colors, isDark } = useTheme();

  const learnedCount = cards.filter((card) => card.learned).length;

  function handleDelete(id: string) {
    setCards(cards.filter((card) => card.id !== id));
  }

  function renderCard({ item }: { item: Card }) {
    const card = item as CardWithFavorite;
    const isFavorite = card.favorite === true;

    return (
      <AppCard
        colors={colors}
        isDark={isDark}
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

          <Pressable
            style={({ pressed }) => ({
              width: 44,
              height: 44,
              borderRadius: radius.full,
              backgroundColor: isFavorite ? colors.warningSoft : colors.surface,
              alignItems: 'center',
              justifyContent: 'center',
              opacity: pressed ? 0.85 : 1,
            })}>
            <Ionicons
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={22}
              color={isFavorite ? colors.warning : colors.muted}
            />
          </Pressable>
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
          <Pressable
            onPress={() => router.push(`/edit-card?id=${card.id}`)}
            style={({ pressed }) => ({
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: spacing.sm,
              backgroundColor: colors.primary,
              paddingVertical: spacing.md,
              borderRadius: radius.lg,
              opacity: pressed ? 0.9 : 1,
              ...getShadow('soft', isDark),
            })}>
            <Ionicons name="create-outline" size={18} color={colors.onPrimary} />
            <Text style={[typography.button, { color: colors.onPrimary }]}>Edit</Text>
          </Pressable>
          <Pressable
            onPress={() => handleDelete(card.id)}
            style={({ pressed }) => ({
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: spacing.sm,
              backgroundColor: colors.dangerSoft,
              paddingVertical: spacing.md,
              borderRadius: radius.lg,
              borderWidth: 1,
              borderColor: colors.danger + '33',
              opacity: pressed ? 0.9 : 1,
            })}>
            <Ionicons name="trash-outline" size={18} color={colors.danger} />
            <Text style={[typography.button, { color: colors.danger }]}>Delete</Text>
          </Pressable>
        </View>
      </AppCard>
    );
  }

  return (
    <ScreenContainer>
      <View style={{ paddingHorizontal: layout.contentPadding, paddingTop: spacing.lg }}>
        <PageHeader
          title="Manage Cards"
          subtitle={`${cards.length} cards · ${learnedCount} learned`}
          colors={colors}
          right={
            <Pressable
              onPress={() => router.push('/add-card')}
              style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}>
              <IconCircle
                icon="add"
                backgroundColor={colors.primarySoft}
                iconColor={colors.primary}
              />
            </Pressable>
          }
        />

        {cards.length > 0 ? (
          <View
            style={{
              flexDirection: 'row',
              gap: spacing.sm,
              marginBottom: spacing.md,
            }}>
            <View
              style={{
                flex: 1,
                backgroundColor: colors.card,
                borderRadius: cardRadius,
                padding: spacing.md,
                borderWidth: 1,
                borderColor: colors.borderLight,
                ...getShadow('soft', isDark),
              }}>
              <Text style={[typography.caption, { color: colors.muted }]}>Total</Text>
              <Text style={[typography.title, { color: colors.text }]}>{cards.length}</Text>
            </View>
            <View
              style={{
                flex: 1,
                backgroundColor: colors.card,
                borderRadius: cardRadius,
                padding: spacing.md,
                borderWidth: 1,
                borderColor: colors.borderLight,
                ...getShadow('soft', isDark),
              }}>
              <Text style={[typography.caption, { color: colors.muted }]}>Learned</Text>
              <Text style={[typography.title, { color: colors.success }]}>{learnedCount}</Text>
            </View>
          </View>
        ) : null}
      </View>

      <FlatList
        data={cards}
        keyExtractor={(item) => item.id}
        renderItem={renderCard}
        contentContainerStyle={{
          paddingHorizontal: layout.contentPadding,
          paddingBottom: spacing.xxl,
        }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <AppCard colors={colors} isDark={isDark} style={{ alignItems: 'center' }}>
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
            <PrimaryButton
              label="Create Card"
              icon="add"
              onPress={() => router.push('/add-card')}
              colors={colors}
              isDark={isDark}
              style={{ width: '100%' }}
            />
          </AppCard>
        }
      />
    </ScreenContainer>
  );
}
