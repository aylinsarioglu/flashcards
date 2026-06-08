import { FlatList, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useCards } from '../storage/CardsContext';
import type { Card } from '../types/card';

export default function ManageCardsScreen() {
  const { cards, setCards } = useCards();

  function handleDelete(id: string) {
    setCards(cards.filter((card) => card.id !== id));
  }

  function renderCard({ item }: { item: Card }) {
    return (
      <View
        style={{
          width: 320,
          backgroundColor: '#fff',
          borderRadius: 12,
          padding: 16,
          marginBottom: 12,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        }}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: '600',
            marginBottom: 4,
          }}>
          {item.front}
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: '#444',
            marginBottom: 4,
          }}>
          {item.back}
        </Text>
        <Text
          style={{
            fontSize: 12,
            color: '#666',
            marginBottom: 12,
          }}>
          {item.category}
        </Text>
        <Pressable
          onPress={() => handleDelete(item.id)}
          style={{
            backgroundColor: '#ff3b30',
            paddingVertical: 8,
            borderRadius: 8,
            alignItems: 'center',
          }}>
          <Text
            style={{
              color: '#fff',
              fontSize: 14,
              fontWeight: '600',
            }}>
            Delete
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        alignItems: 'center',
      }}>
      <Text
        style={{
          fontSize: 32,
          fontWeight: 'bold',
          marginTop: 24,
          marginBottom: 24,
        }}>
        Manage Cards
      </Text>
      <FlatList
        data={cards}
        keyExtractor={(item) => item.id}
        renderItem={renderCard}
        contentContainerStyle={{
          alignItems: 'center',
          paddingBottom: 24,
        }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}
