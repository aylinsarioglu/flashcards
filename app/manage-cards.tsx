import { FlatList, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import ContentContainer from '../components/ContentContainer';
import { darkTheme, lightTheme, radius, spacing } from '../constants/theme';
import { useCards } from '../storage/CardsContext';
import { useTheme } from '../storage/ThemeContext';
import type { Card } from '../types/card';

export default function ManageCardsScreen() {
  const { cards, setCards } = useCards();
  const { isDark } = useTheme();
  const colors = isDark ? darkTheme : lightTheme;

  function handleDelete(id: string) {
    setCards(cards.filter((card) => card.id !== id));
  }

  function renderCard({ item }: { item: Card }) {
    return (
      <ContentContainer>
        <View
          style={{
            width: '100%',
            backgroundColor: colors.card,
            borderRadius: radius.lg,
            padding: 20,
            marginBottom: spacing.md,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: spacing.sm,
            elevation: 3,
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: spacing.md,
            }}>
            <View
              style={{
                backgroundColor: '#eef4ff',
                borderRadius: radius.xl,
                paddingHorizontal: 12,
                paddingVertical: 6,
              }}>
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: '600',
                  color: colors.primary,
                }}>
                {item.deck}
              </Text>
            </View>
            <Pressable
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: '#f5f5f5',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text style={{ fontSize: 18 }}>☆</Text>
            </Pressable>
          </View>

          <Text
            style={{
              fontSize: 11,
              fontWeight: '700',
              color: '#999',
              textTransform: 'uppercase',
              letterSpacing: 0.5,
              marginBottom: 6,
            }}>
            Front
          </Text>
          <Text
            style={{
              fontSize: 20,
              fontWeight: '700',
              color: colors.text,
              marginBottom: spacing.md,
              lineHeight: 28,
            }}>
            {item.front}
          </Text>

          <Text
            style={{
              fontSize: 11,
              fontWeight: '700',
              color: '#999',
              textTransform: 'uppercase',
              letterSpacing: 0.5,
              marginBottom: 6,
            }}>
            Back
          </Text>
          <Text
            style={{
              fontSize: 16,
              fontWeight: '500',
              color: '#444',
              marginBottom: 20,
              lineHeight: 24,
            }}>
            {item.back}
          </Text>

          <Text
            style={{
              fontSize: 14,
              fontWeight: '600',
              color: item.learned ? colors.success : colors.muted,
              marginBottom: 20,
            }}>
            {item.learned ? '✅ Learned' : '⏳ Learning'}
          </Text>

          <View style={{ flexDirection: 'row', gap: 12 }}>
            <Pressable
              onPress={() => router.push(`/edit-card?id=${item.id}`)}
              style={({ pressed }) => ({
                flex: 1,
                backgroundColor: pressed ? '#0056b3' : colors.primary,
                paddingVertical: 12,
                borderRadius: radius.md,
                alignItems: 'center',
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
              onPress={() => handleDelete(item.id)}
              style={({ pressed }) => ({
                flex: 1,
                backgroundColor: pressed ? '#d70015' : colors.danger,
                paddingVertical: 12,
                borderRadius: radius.md,
                alignItems: 'center',
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
      </ContentContainer>
    );
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.background,
      }}>
      <ContentContainer
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: spacing.lg,
          paddingVertical: 12,
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
      </ContentContainer>

      <FlatList
        data={cards}
        keyExtractor={(item) => item.id}
        renderItem={renderCard}
        contentContainerStyle={{
          alignItems: 'center',
          paddingHorizontal: spacing.lg,
          paddingTop: spacing.sm,
          paddingBottom: spacing.xl,
        }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <ContentContainer style={{ alignItems: 'center', paddingTop: 64 }}>
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
          </ContentContainer>
        }
      />
    </SafeAreaView>
  );
}
