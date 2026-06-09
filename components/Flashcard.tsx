import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

type FlashcardProps = {
  front: string;
  back: string;
  deck: string;
  example?: string;
  exampleTranslation?: string;
};

export default function Flashcard({
  front,
  back,
  deck,
  example,
  exampleTranslation,
}: FlashcardProps) {
  const [flipped, setFlipped] = useState(false);

  return (
    <Pressable
      onPress={() => setFlipped((prev) => !prev)}
      style={{
        width: 320,
        height: 260,
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 5,
      }}>
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: 12,
            fontWeight: '600',
            color: '#007AFF',
            textTransform: 'uppercase',
            letterSpacing: 0.5,
            marginBottom: 8,
          }}>
          {deck}
        </Text>

        <View
          style={{
            flex: 1,
            justifyContent: 'center',
          }}>
          {!flipped ? (
            <Text
              style={{
                fontSize: 28,
                fontWeight: '700',
                textAlign: 'center',
                color: '#1a1a1a',
                lineHeight: 36,
              }}>
              {front}
            </Text>
          ) : (
            <View style={{ width: '100%' }}>
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: '700',
                  color: '#999',
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                  marginBottom: 6,
                }}>
                Meaning
              </Text>
              <Text
                style={{
                  fontSize: 22,
                  fontWeight: '600',
                  color: '#1a1a1a',
                  marginBottom: 16,
                }}>
                {back}
              </Text>

              {example && (
                <View style={{ marginBottom: exampleTranslation ? 12 : 0 }}>
                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: '700',
                      color: '#999',
                      textTransform: 'uppercase',
                      letterSpacing: 0.5,
                      marginBottom: 6,
                    }}>
                    Example
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      color: '#444',
                      fontStyle: 'italic',
                      lineHeight: 20,
                    }}>
                    {example}
                  </Text>
                </View>
              )}

              {exampleTranslation && (
                <View>
                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: '700',
                      color: '#999',
                      textTransform: 'uppercase',
                      letterSpacing: 0.5,
                      marginBottom: 6,
                    }}>
                    Translation
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      color: '#666',
                      lineHeight: 20,
                    }}>
                    {exampleTranslation}
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>

        <Text
          style={{
            fontSize: 12,
            color: '#aaa',
            textAlign: 'center',
            marginTop: 8,
          }}>
          Tap to flip
        </Text>
      </View>
    </Pressable>
  );
}
