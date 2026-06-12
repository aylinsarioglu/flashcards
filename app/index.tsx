import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import ContentContainer from '../components/ContentContainer';
import { colors, radius, spacing } from '../constants/theme';
import { useCards } from '../storage/CardsContext';

export default function HomeScreen() {
  const { cards, dailyProgress, dailyGoal, currentStreak } = useCards();

  const totalCards = cards.length;
  const favorites = 0;
  const deckCount = new Set(cards.map((card) => card.deck)).size;
  const reviewedToday = 0;
  const progressPercent =
    totalCards > 0 ? Math.round((reviewedToday / totalCards) * 100) : 0;
  const challengeProgressPercent =
    dailyGoal > 0
      ? Math.min(
          100,
          Math.round((dailyProgress.cardsReviewedToday / dailyGoal) * 100),
        )
      : 0;

  const deckGroups = cards.reduce<Record<string, number>>((groups, card) => {
    groups[card.deck] = (groups[card.deck] ?? 0) + 1;
    return groups;
  }, {});

  const deckList = Object.entries(deckGroups).map(([name, count]) => ({
    name,
    count,
  }));

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.background,
        paddingHorizontal: spacing.lg,
      }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingVertical: spacing.lg,
          paddingBottom: spacing.xl,
        }}
        showsVerticalScrollIndicator={false}>
        <ContentContainer>
          <Text
            style={{
              fontSize: 40,
              fontWeight: 'bold',
              marginBottom: spacing.sm,
              color: colors.text,
              textAlign: 'center',
            }}>
            Flashcards
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: colors.muted,
              marginBottom: 40,
              textAlign: 'center',
            }}>
            Ready to study today?
          </Text>

          <View
            style={{
              flexDirection: 'row',
              gap: 12,
              marginBottom: 40,
            }}>
            <View
              style={{
                flex: 1,
                backgroundColor: colors.card,
                borderRadius: radius.lg,
                padding: spacing.md,
                alignItems: 'center',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.08,
                shadowRadius: spacing.sm,
                elevation: 3,
              }}>
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: 'bold',
                  color: colors.primary,
                  marginBottom: 4,
                }}>
                {totalCards}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: colors.muted,
                  fontWeight: '500',
                }}>
                Total Cards
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                backgroundColor: colors.card,
                borderRadius: radius.lg,
                padding: spacing.md,
                alignItems: 'center',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.08,
                shadowRadius: spacing.sm,
                elevation: 3,
              }}>
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: 'bold',
                  color: '#ff9500',
                  marginBottom: 4,
                }}>
                {favorites}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: colors.muted,
                  fontWeight: '500',
                }}>
                Favorites
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                backgroundColor: colors.card,
                borderRadius: radius.lg,
                padding: spacing.md,
                alignItems: 'center',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.08,
                shadowRadius: spacing.sm,
                elevation: 3,
              }}>
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: 'bold',
                  color: colors.success,
                  marginBottom: 4,
                }}>
                {deckCount}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: colors.muted,
                  fontWeight: '500',
                }}>
                Decks
              </Text>
            </View>
          </View>

          <View
            style={{
              backgroundColor: colors.card,
              borderRadius: radius.lg,
              padding: 20,
              marginBottom: 40,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.08,
              shadowRadius: spacing.sm,
              elevation: 3,
            }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: '700',
                color: colors.text,
                marginBottom: 8,
              }}>
              🔥 Current Streak
            </Text>
            <Text
              style={{
                fontSize: 28,
                fontWeight: '700',
                color: colors.primary,
              }}>
              {currentStreak} Days
            </Text>
          </View>

          <View
            style={{
              backgroundColor: colors.card,
              borderRadius: radius.lg,
              padding: 20,
              marginBottom: 40,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.08,
              shadowRadius: spacing.sm,
              elevation: 3,
            }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: '700',
                color: colors.text,
                marginBottom: 12,
              }}>
              Today's Challenge
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: colors.muted,
                marginBottom: 12,
              }}>
              {dailyProgress.cardsReviewedToday} / {dailyGoal} Cards Reviewed
            </Text>
            <View
              style={{
                height: 10,
                backgroundColor: '#e5e5e5',
                borderRadius: 5,
                overflow: 'hidden',
                marginBottom: spacing.sm,
              }}>
              <View
                style={{
                  width: `${challengeProgressPercent}%`,
                  height: '100%',
                  backgroundColor: colors.primary,
                  borderRadius: 5,
                }}
              />
            </View>
            <Text
              style={{
                fontSize: 12,
                color: colors.muted,
                fontWeight: '500',
              }}>
              {challengeProgressPercent}%
            </Text>
          </View>

          <View
            style={{
              backgroundColor: colors.card,
              borderRadius: radius.lg,
              padding: 20,
              marginBottom: 40,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.08,
              shadowRadius: spacing.sm,
              elevation: 3,
            }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: '700',
                color: colors.text,
                marginBottom: 12,
              }}>
              Today's Progress
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: colors.muted,
                marginBottom: 12,
              }}>
              {reviewedToday} / {totalCards} Cards Reviewed
            </Text>
            <View
              style={{
                height: 10,
                backgroundColor: '#e5e5e5',
                borderRadius: 5,
                overflow: 'hidden',
                marginBottom: spacing.sm,
              }}>
              <View
                style={{
                  width: `${progressPercent}%`,
                  height: '100%',
                  backgroundColor: colors.primary,
                  borderRadius: 5,
                }}
              />
            </View>
            <Text
              style={{
                fontSize: 12,
                color: colors.muted,
                fontWeight: '500',
              }}>
              {progressPercent}%
            </Text>
          </View>

          {deckList.length > 0 && (
            <View style={{ marginBottom: 40 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '700',
                  color: colors.text,
                  marginBottom: spacing.md,
                }}>
                My Decks
              </Text>
              <View style={{ gap: 12 }}>
                {deckList.map(({ name, count }) => (
                  <Pressable
                    key={name}
                    onPress={() => router.push(`/study?deck=${name}`)}
                    style={({ pressed }) => ({
                      backgroundColor: colors.card,
                      borderRadius: radius.lg,
                      padding: spacing.md,
                      opacity: pressed ? 0.85 : 1,
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.08,
                      shadowRadius: spacing.sm,
                      elevation: 3,
                    })}>
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: '700',
                        color: colors.text,
                        marginBottom: 4,
                      }}>
                      {name}
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        color: colors.muted,
                        fontWeight: '500',
                      }}>
                      {count} cards
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          )}

          <View style={{ gap: 12 }}>
            <Pressable
              onPress={() => router.push('/study')}
              style={({ pressed }) => ({
                backgroundColor: colors.primary,
                paddingVertical: spacing.md,
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
                ▶ Start Learning
              </Text>
            </Pressable>
            <Pressable
              onPress={() => router.push('/study?mode=favorites')}
              style={({ pressed }) => ({
                backgroundColor: colors.card,
                paddingVertical: spacing.md,
                borderRadius: radius.lg,
                alignItems: 'center',
                opacity: pressed ? 0.85 : 1,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.08,
                shadowRadius: 6,
                elevation: 2,
              })}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: colors.text,
                }}>
                Review Favorites
              </Text>
            </Pressable>
            <Pressable
              onPress={() => router.push('/add-card')}
              style={({ pressed }) => ({
                backgroundColor: colors.card,
                paddingVertical: spacing.md,
                borderRadius: radius.lg,
                alignItems: 'center',
                opacity: pressed ? 0.85 : 1,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.08,
                shadowRadius: 6,
                elevation: 2,
              })}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: colors.text,
                }}>
                ➕ Add Card
              </Text>
            </Pressable>
            <Pressable
              onPress={() => router.push('/manage-cards')}
              style={({ pressed }) => ({
                backgroundColor: colors.card,
                paddingVertical: spacing.md,
                borderRadius: radius.lg,
                alignItems: 'center',
                opacity: pressed ? 0.85 : 1,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.08,
                shadowRadius: 6,
                elevation: 2,
              })}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: colors.text,
                }}>
                🗂 Manage Cards
              </Text>
            </Pressable>
          </View>
        </ContentContainer>
      </ScrollView>
    </SafeAreaView>
  );
}
