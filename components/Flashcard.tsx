import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

type FlashcardProps = {
  front: string;
  back: string;
  example?: string;
  exampleTranslation?: string;
};

export default function Flashcard({
  front,
  back,
  example,
  exampleTranslation,
}: FlashcardProps) {
  const [flipped, setFlipped] = useState(false);

  return (
    <Pressable
      onPress={() => setFlipped((prev) => !prev)}
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
        {!flipped ? (
          <Text
            style={{
              fontSize: 22,
              fontWeight: '600',
              textAlign: 'center',
            }}>
            {front}
          </Text>
        ) : (
          <View style={{ width: '100%' }}>
            <Text
              style={{
                fontSize: 22,
                fontWeight: '600',
                textAlign: 'center',
                marginBottom: 12,
              }}>
              {back}
            </Text>
            {example && (
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
            )}
            {exampleTranslation && (
              <Text
                style={{
                  fontSize: 14,
                  color: '#666',
                  marginTop: 6,
                  alignSelf: 'stretch',
                }}>
                {exampleTranslation}
              </Text>
            )}
          </View>
        )}
      </View>
    </Pressable>
  );
}
