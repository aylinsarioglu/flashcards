import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { useCards } from '../storage/CardsContext';

export default function HomeScreen() {
  const { cards } = useCards();

  const totalCards = cards.length;
  const favorites = 0;
  const decks = new Set(cards.map((card) => card.deck)).size;

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
        <Text
          style={{
            fontSize: 40,
            fontWeight: 'bold',
            marginBottom: 8,
            color: '#1a1a1a',
          }}>
          Flashcards
        </Text>
        <Text
          style={{
            fontSize: 16,
            color: '#666',
            marginBottom: 40,
          }}>
          Learn English Smarter
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

        <View style={{ gap: 12 }}>
          <Pressable
            onPress={() => router.push('/study')}
            style={({ pressed }) => ({
              backgroundColor: pressed ? '#0056b3' : '#007AFF',
              paddingVertical: 16,
              borderRadius: 12,
              alignItems: 'center',
            })}>
            <Text
              style={{
                color: '#fff',
                fontSize: 16,
                fontWeight: '600',
              }}>
              Start Learning
            </Text>
          </Pressable>
          <Pressable
            onPress={() => router.push('/add-card')}
            style={({ pressed }) => ({
              backgroundColor: pressed ? '#d1d1d1' : '#e5e5e5',
              paddingVertical: 16,
              borderRadius: 12,
              alignItems: 'center',
            })}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: '600',
              }}>
              Add Card
            </Text>
          </Pressable>
          <Pressable
            onPress={() => router.push('/manage-cards')}
            style={({ pressed }) => ({
              backgroundColor: pressed ? '#d1d1d1' : '#e5e5e5',
              paddingVertical: 16,
              borderRadius: 12,
              alignItems: 'center',
            })}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: '600',
              }}>
              Manage Cards
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
