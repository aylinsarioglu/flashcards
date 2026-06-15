import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import ContentContainer from '../components/ContentContainer';
import { darkTheme, lightTheme, radius, spacing } from '../constants/theme';
import { ACHIEVEMENT_DEFINITIONS, useCards } from '../storage/CardsContext';
import { useTheme } from '../storage/ThemeContext';

export default function HomeScreen() {
  const { cards, dailyProgress, dailyGoal, currentStreak, achievements } =
    useCards();
  const { isDark, toggleTheme } = useTheme();
  const colors = isDark ? darkTheme : lightTheme;

  const totalCards = cards.length;
  const learnedCount = cards.filter((card) => card.learned).length;
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

  const deckGroups = cards.reduce<
    Record<string, { total: number; learned: number }>
  >((groups, card) => {
    if (!groups[card.deck]) {
      groups[card.deck] = { total: 0, learned: 0 };
    }

    groups[card.deck].total += 1;

    if (card.learned) {
      groups[card.deck].learned += 1;
    }

    return groups;
  }, {});

  const deckList = Object.entries(deckGroups).map(([name, stats]) => ({
    name,
    total: stats.total,
    learned: stats.learned,
    progressPercent:
      stats.total > 0 ? Math.round((stats.learned / stats.total) * 100) : 0,
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
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              marginBottom: spacing.sm,
            }}>
            <Pressable
              onPress={toggleTheme}
              style={({ pressed }) => ({
                paddingVertical: spacing.sm,
                paddingHorizontal: spacing.md,
                borderRadius: radius.md,
                backgroundColor: colors.card,
                opacity: pressed ? 0.85 : 1,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.08,
                shadowRadius: spacing.sm,
                elevation: 2,
              })}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '600',
                  color: colors.text,
                }}>
                {isDark ? '☀️ Light Mode' : '🌙 Dark Mode'}
              </Text>
            </Pressable>
          </View>
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
                  color: '#5856d6',
                  marginBottom: 4,
                }}>
                {learnedCount}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: colors.muted,
                  fontWeight: '500',
                }}>
                Learned
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
                marginBottom: spacing.md,
              }}>
              Achievements
            </Text>
            <View style={{ gap: 12 }}>
              {ACHIEVEMENT_DEFINITIONS.map((achievement) => {
                const unlocked = achievements[achievement.id];

                return (
                  <View
                    key={achievement.id}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}>
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: '600',
                        color: unlocked ? colors.text : colors.muted,
                      }}>
                      {achievement.title}
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: '600',
                        color: unlocked ? colors.success : colors.muted,
                      }}>
                      {unlocked ? '✅' : '🔒'}
                    </Text>
                  </View>
                );
              })}
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
                {deckList.map(({ name, total, learned, progressPercent }) => (
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
                      📚 {name}
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        color: colors.muted,
                        fontWeight: '500',
                        marginBottom: spacing.sm,
                      }}>
                      {learned} / {total} learned
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
                  </Pressable>
                ))}
              </View>
            </View>
          )}

          <View
            style={{
              backgroundColor: colors.card,
              borderRadius: radius.lg,
              padding: 20,
              marginBottom: 12,
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
                marginBottom: spacing.md,
              }}>
              Study Modes
            </Text>
            <View style={{ gap: 12 }}>
              <Pressable
                onPress={() => router.push('/study?mode=all')}
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
                  📚 All Cards
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
                  borderWidth: 1,
                  borderColor: '#e5e5e5',
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
                  ⭐ Favorites
                </Text>
              </Pressable>
              <Pressable
                onPress={() => router.push('/study?mode=learning')}
                style={({ pressed }) => ({
                  backgroundColor: colors.card,
                  paddingVertical: spacing.md,
                  borderRadius: radius.lg,
                  alignItems: 'center',
                  opacity: pressed ? 0.85 : 1,
                  borderWidth: 1,
                  borderColor: '#e5e5e5',
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
                  🧠 Learning Cards
                </Text>
              </Pressable>
            </View>
          </View>

          <View style={{ gap: 12 }}>
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
