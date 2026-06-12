import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import ContentContainer from '../components/ContentContainer';
import { useCards } from '../storage/CardsContext';

export default function HomeScreen() {
  const { cards } = useCards();

  const totalCards = cards.length;
  const favorites = 0;
  const decks = new Set(cards.map((card) => card.deck)).size;
  const reviewedToday = 0;
  const progressPercent =
    totalCards > 0 ? Math.round((reviewedToday / totalCards) * 100) : 0;

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#f8f9fa',
        paddingHorizontal: 24,
      }}>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
        }}>
        <ContentContainer>
          <Text
            style={{
              fontSize: 40,
              fontWeight: 'bold',
              marginBottom: 8,
              color: '#1a1a1a',
              textAlign: 'center',
            }}>
            Flashcards
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: '#666',
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
                backgroundColor: '#fff',
                borderRadius: 16,
                padding: 16,
                alignItems: 'center',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.08,
                shadowRadius: 8,
                elevation: 3,
              }}>
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: 'bold',
                  color: '#007AFF',
                  marginBottom: 4,
                }}>
                {totalCards}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: '#666',
                  fontWeight: '500',
                }}>
                Total Cards
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                backgroundColor: '#fff',
                borderRadius: 16,
                padding: 16,
                alignItems: 'center',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.08,
                shadowRadius: 8,
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
                  color: '#666',
                  fontWeight: '500',
                }}>
                Favorites
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                backgroundColor: '#fff',
                borderRadius: 16,
                padding: 16,
                alignItems: 'center',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.08,
                shadowRadius: 8,
                elevation: 3,
              }}>
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: 'bold',
                  color: '#34c759',
                  marginBottom: 4,
                }}>
                {decks}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: '#666',
                  fontWeight: '500',
                }}>
                Decks
              </Text>
            </View>
          </View>

          <View
            style={{
              backgroundColor: '#fff',
              borderRadius: 16,
              padding: 20,
              marginBottom: 40,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.08,
              shadowRadius: 8,
              elevation: 3,
            }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: '700',
                color: '#1a1a1a',
                marginBottom: 12,
              }}>
              Today's Progress
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: '#666',
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
                marginBottom: 8,
              }}>
              <View
                style={{
                  width: `${progressPercent}%`,
                  height: '100%',
                  backgroundColor: '#007AFF',
                  borderRadius: 5,
                }}
              />
            </View>
            <Text
              style={{
                fontSize: 12,
                color: '#666',
                fontWeight: '500',
              }}>
              {progressPercent}%
            </Text>
          </View>

          <View style={{ gap: 12 }}>
            <Pressable
              onPress={() => router.push('/study')}
              style={({ pressed }) => ({
                backgroundColor: '#007AFF',
                paddingVertical: 16,
                borderRadius: 16,
                alignItems: 'center',
                opacity: pressed ? 0.85 : 1,
                shadowColor: '#007AFF',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.25,
                shadowRadius: 8,
                elevation: 4,
              })}>
              <Text
                style={{
                  color: '#fff',
                  fontSize: 16,
                  fontWeight: '600',
                }}>
                ▶ Start Learning
              </Text>
            </Pressable>
            <Pressable
              onPress={() => router.push('/add-card')}
              style={({ pressed }) => ({
                backgroundColor: '#fff',
                paddingVertical: 16,
                borderRadius: 16,
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
                  color: '#1a1a1a',
                }}>
                ➕ Add Card
              </Text>
            </Pressable>
            <Pressable
              onPress={() => router.push('/manage-cards')}
              style={({ pressed }) => ({
                backgroundColor: '#fff',
                paddingVertical: 16,
                borderRadius: 16,
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
                  color: '#1a1a1a',
                }}>
                🗂 Manage Cards
              </Text>
            </Pressable>
          </View>
        </ContentContainer>
      </View>
    </SafeAreaView>
  );
}
