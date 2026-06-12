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
        minHeight: 300,
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.12,
        shadowRadius: 16,
        elevation: 8,
      }}>
      <View style={{ flex: 1, minHeight: 252 }}>
        {!flipped ? (
          <>
            <View
              style={{
                alignSelf: 'flex-start',
                backgroundColor: '#eef4ff',
                borderRadius: 20,
                paddingHorizontal: 12,
                paddingVertical: 6,
                marginBottom: 24,
              }}>
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: '700',
                  color: '#007AFF',
                  letterSpacing: 0.3,
                }}>
                {deck}
              </Text>
            </View>

            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                paddingVertical: 16,
              }}>
              <Text
                style={{
                  fontSize: 30,
                  fontWeight: '700',
                  textAlign: 'center',
                  color: '#1a1a1a',
                  lineHeight: 38,
                }}>
                {front}
              </Text>
            </View>

            <Text
              style={{
                fontSize: 13,
                color: '#aaa',
                textAlign: 'center',
                fontWeight: '500',
              }}>
              Tap to reveal meaning
            </Text>
          </>
        ) : (
          <>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                paddingVertical: 8,
              }}>
              <View style={{ marginBottom: 20 }}>
                <Text
                  style={{
                    fontSize: 11,
                    fontWeight: '700',
                    color: '#999',
                    textTransform: 'uppercase',
                    letterSpacing: 0.8,
                    marginBottom: 8,
                  }}>
                  Meaning
                </Text>
                <Text
                  style={{
                    fontSize: 24,
                    fontWeight: '700',
                    color: '#1a1a1a',
                    lineHeight: 32,
                  }}>
                  {back}
                </Text>
              </View>

              {example && (
                <View style={{ marginBottom: exampleTranslation ? 20 : 0 }}>
                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: '700',
                      color: '#999',
                      textTransform: 'uppercase',
                      letterSpacing: 0.8,
                      marginBottom: 8,
                    }}>
                    Example
                  </Text>
                  <Text
                    style={{
                      fontSize: 15,
                      color: '#444',
                      fontStyle: 'italic',
                      lineHeight: 22,
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
                      letterSpacing: 0.8,
                      marginBottom: 8,
                    }}>
                    Translation
                  </Text>
                  <Text
                    style={{
                      fontSize: 15,
                      color: '#666',
                      lineHeight: 22,
                    }}>
                    {exampleTranslation}
                  </Text>
                </View>
              )}
            </View>

            <Text
              style={{
                fontSize: 13,
                color: '#aaa',
                textAlign: 'center',
                fontWeight: '500',
                marginTop: 16,
              }}>
              Tap to flip back
            </Text>
          </>
        )}
      </View>
    </Pressable>
  );
}
