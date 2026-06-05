import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

export default function HomeScreen() {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Text
        style={{
          fontSize: 32,
          fontWeight: 'bold',
          marginBottom: 8,
        }}>
        Flashcards
      </Text>
      <Text
        style={{
          fontSize: 16,
          color: '#666',
          marginBottom: 32,
        }}>
        Learn English Smarter
      </Text>
      <View style={{ gap: 12 }}>
        <Pressable
          onPress={() => router.push('/study')}
          style={({ pressed }) => ({
            backgroundColor: pressed ? '#0056b3' : '#007AFF',
            paddingHorizontal: 24,
            paddingVertical: 12,
            borderRadius: 8,
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
            paddingHorizontal: 24,
            paddingVertical: 12,
            borderRadius: 8,
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
      </View>
    </SafeAreaView>
  );
}
