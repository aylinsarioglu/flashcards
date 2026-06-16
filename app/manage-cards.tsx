import { FlatList, Pressable, Text, View } from 'react-native';
import { router } from 'expo-router';

import ScreenContainer from '../components/ScreenContainer';
import { darkTheme, lightTheme, radius, spacing } from '../constants/theme';
import { useCards } from '../storage/CardsContext';
import { useTheme } from '../storage/ThemeContext';
import type { Card } from '../types/card';

type CardWithFavorite = Card & { favorite?: boolean };

export default function ManageCardsScreen() {
  const { cards, setCards } = useCards();
  const { isDark } = useTheme();
  const colors = isDark ? darkTheme : lightTheme;

  function handleDelete(id: string) {
    setCards(cards.filter((card) => card.id !== id));
  }

  function renderCard({ item }: { item: Card }) {
    const card = item as CardWithFavorite;
    const isFavorite = card.favorite === true;

    return (
      <View
        style={{
          width: '100%',
          backgroundColor: colors.card,
          borderRadius: radius.xl,
          padding: spacing.lg,
          marginBottom: spacing.lg,
          borderWidth: 1,
          borderColor: isDark ? '#2a2a2a' : '#f0f0f0',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: isDark ? 0.2 : 0.08,
          shadowRadius: 12,
          elevation: 4,
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: spacing.lg,
            gap: spacing.md,
          }}>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: spacing.sm,
            }}>
            <View
              style={{
                backgroundColor: isDark ? '#1a2a44' : '#eef4ff',
                borderRadius: radius.xl,
                paddingHorizontal: 12,
                paddingVertical: 6,
              }}>
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: '700',
                  color: colors.primary,
                  letterSpacing: 0.2,
                }}>
                📚 {card.deck}
              </Text>
            </View>

            <View
              style={{
                backgroundColor: card.learned
                  ? isDark
                    ? '#1a3324'
                    : '#e8f8ee'
                  : isDark
                    ? '#2a2a2a'
                    : '#f5f5f5',
                borderRadius: radius.xl,
                paddingHorizontal: 12,
                paddingVertical: 6,
              }}>
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: '700',
                  color: card.learned ? colors.success : colors.muted,
                }}>
                {card.learned ? '✅ Learned' : '⏳ Learning'}
              </Text>
            </View>
          </View>

          <Pressable
            style={({ pressed }) => ({
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: isFavorite
                ? isDark
                  ? '#3d3200'
                  : '#fff8e1'
                : isDark
                  ? '#2a2a2a'
                  : '#f8f8f8',
              borderWidth: 1.5,
              borderColor: isFavorite ? '#ffb800' : isDark ? '#444444' : '#e0e0e0',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: pressed ? 0.85 : 1,
            })}>
            <Text
              style={{
                fontSize: 22,
                color: isFavorite ? '#ffb800' : isDark ? '#d4d4d4' : '#888888',
              }}>
              {isFavorite ? '★' : '☆'}
            </Text>
          </Pressable>
        </View>

        <View style={{ marginBottom: spacing.md }}>
          <Text
            style={{
              fontSize: 11,
              fontWeight: '700',
              color: colors.muted,
              textTransform: 'uppercase',
              letterSpacing: 0.8,
              marginBottom: spacing.sm,
            }}>
            Front
          </Text>
          <Text
            style={{
              fontSize: 22,
              fontWeight: '700',
              color: colors.text,
              lineHeight: 30,
            }}>
            {card.front}
          </Text>
        </View>

        <View style={{ marginBottom: spacing.lg }}>
          <Text
            style={{
              fontSize: 11,
              fontWeight: '700',
              color: colors.muted,
              textTransform: 'uppercase',
              letterSpacing: 0.8,
              marginBottom: spacing.sm,
            }}>
            Back
          </Text>
          <Text
            style={{
              fontSize: 16,
              fontWeight: '500',
              color: isDark ? '#d4d4d4' : '#444444',
              lineHeight: 24,
            }}>
            {card.back}
          </Text>
        </View>

        {card.example && (
          <View
            style={{
              backgroundColor: isDark ? '#1a1a1a' : '#f8f9fa',
              borderRadius: radius.md,
              padding: spacing.md,
              marginBottom: spacing.lg,
            }}>
            <Text
              style={{
                fontSize: 14,
                color: isDark ? '#d4d4d4' : '#555555',
                fontStyle: 'italic',
                lineHeight: 22,
              }}>
              {card.example}
            </Text>
          </View>
        )}

        <View style={{ flexDirection: 'row', gap: spacing.md }}>
          <Pressable
            onPress={() => router.push(`/edit-card?id=${card.id}`)}
            style={({ pressed }) => ({
              flex: 1,
              backgroundColor: colors.primary,
              paddingVertical: 14,
              borderRadius: radius.lg,
              alignItems: 'center',
              opacity: pressed ? 0.85 : 1,
              shadowColor: colors.primary,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 4,
              elevation: 2,
            })}>
            <Text
              style={{
                color: colors.card,
                fontSize: 15,
                fontWeight: '600',
              }}>
              Edit
            </Text>
          </Pressable>
          <Pressable
            onPress={() => handleDelete(card.id)}
            style={({ pressed }) => ({
              flex: 1,
              backgroundColor: colors.danger,
              paddingVertical: 14,
              borderRadius: radius.lg,
              alignItems: 'center',
              opacity: pressed ? 0.85 : 1,
            })}>
            <Text
              style={{
                color: colors.card,
                fontSize: 15,
                fontWeight: '600',
              }}>
              Delete
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <ScreenContainer
      style={{
        backgroundColor: colors.background,
      }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: spacing.lg,
          paddingTop: spacing.md,
          paddingBottom: spacing.sm,
        }}>
        <Pressable onPress={() => router.replace('/')}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: '600',
              color: colors.primary,
            }}>
            ← Back
          </Text>
        </Pressable>
        <Text
          style={{
            fontSize: 18,
            fontWeight: '700',
            color: colors.text,
          }}>
          Manage Cards
        </Text>
        <View style={{ width: 60 }} />
      </View>

      <FlatList
        data={cards}
        keyExtractor={(item) => item.id}
        renderItem={renderCard}
        contentContainerStyle={{
          paddingHorizontal: spacing.lg,
          paddingTop: spacing.md,
          paddingBottom: spacing.xl,
        }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', paddingTop: 64 }}>
            <Text style={{ fontSize: 72, marginBottom: spacing.lg }}>📚</Text>
            <Text
              style={{
                fontSize: 28,
                fontWeight: 'bold',
                marginBottom: 12,
                color: colors.text,
                textAlign: 'center',
              }}>
              No Cards Yet
            </Text>
            <Text
              style={{
                fontSize: 16,
                color: colors.muted,
                marginBottom: spacing.xl,
                textAlign: 'center',
                lineHeight: spacing.lg,
              }}>
              Create your first flashcard to start learning.
            </Text>
            <Pressable
              onPress={() => router.push('/add-card')}
              style={({ pressed }) => ({
                width: '100%',
                backgroundColor: colors.primary,
                paddingVertical: 18,
                borderRadius: radius.lg,
                alignItems: 'center',
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
                Create Card
              </Text>
            </Pressable>
          </View>
        }
      />
    </ScreenContainer>
  );
}
