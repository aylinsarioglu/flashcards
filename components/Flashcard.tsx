import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

type FlashcardProps = {
  front: string;
  back: string;
  example?: string;
};

export default function Flashcard({ front, back, example }: FlashcardProps) {
  const [showBack, setShowBack] = useState(false);

  return (
    <Pressable
      onPress={() => setShowBack((prev) => !prev)}
      style={{
        width: 320,
        height: 220,
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 5,
      }}>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        {showBack ? (
          <>
            <Text
              style={{
                fontSize: 22,
                fontWeight: '600',
                textAlign: 'center',
                marginBottom: example ? 16 : 0,
              }}>
              {back}
            </Text>
            {example ? (
              <View style={{ alignSelf: 'stretch' }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '600',
                    color: '#666',
                    marginBottom: 4,
                  }}>
                  Example:
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: '#444',
                    fontStyle: 'italic',
                  }}>
                  {example}
                </Text>
              </View>
            ) : null}
          </>
        ) : (
          <Text
            style={{
              fontSize: 22,
              fontWeight: '600',
              textAlign: 'center',
            }}>
            {front}
          </Text>
        )}
      </View>
    </Pressable>
  );
}
