import { FlatList, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

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
          width: '100%',
          maxWidth: 360,
          backgroundColor: '#fff',
          borderRadius: 16,
          padding: 20,
          marginBottom: 16,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.08,
          shadowRadius: 8,
          elevation: 3,
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16,
          }}>
          <View
            style={{
              backgroundColor: '#eef4ff',
              borderRadius: 20,
              paddingHorizontal: 12,
              paddingVertical: 6,
            }}>
            <Text
              style={{
                fontSize: 12,
                fontWeight: '600',
                color: '#007AFF',
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
            color: '#1a1a1a',
            marginBottom: 16,
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

        <Pressable
          onPress={() => handleDelete(item.id)}
          style={({ pressed }) => ({
            backgroundColor: pressed ? '#d70015' : '#ff3b30',
            paddingVertical: 12,
            borderRadius: 12,
            alignItems: 'center',
          })}>
          <Text
            style={{
              color: '#fff',
              fontSize: 15,
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
        backgroundColor: '#f8f9fa',
      }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 16,
          paddingVertical: 12,
        }}>
        <Pressable onPress={() => router.replace('/')}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: '600',
              color: '#007AFF',
            }}>
            ← Back
          </Text>
        </Pressable>
        <Text
          style={{
            fontSize: 18,
            fontWeight: '700',
            color: '#1a1a1a',
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
          paddingHorizontal: 24,
          paddingTop: 8,
          paddingBottom: 32,
        }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', paddingTop: 48 }}>
            <Text
              style={{
                fontSize: 16,
                color: '#666',
                textAlign: 'center',
              }}>
              No cards yet. Add your first card from the home screen.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
