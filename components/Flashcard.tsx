import { useRef, useState } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

type FlashcardProps = {
  front: string;
  back: string;
  deck: string;
  example?: string;
  exampleTranslation?: string;
};

function DeckBadge({ deck }: { deck: string }) {
  return (
    <View style={styles.deckBadge}>
      <Text style={styles.deckBadgeText}>{deck}</Text>
    </View>
  );
}

export default function Flashcard({
  front,
  back,
  deck,
  example,
  exampleTranslation,
}: FlashcardProps) {
  const [flipped, setFlipped] = useState(false);
  const flipAnimation = useRef(new Animated.Value(0)).current;

  const frontRotate = flipAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const backRotate = flipAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg'],
  });

  function handlePress() {
    const toValue = flipped ? 0 : 1;

    Animated.timing(flipAnimation, {
      toValue,
      duration: 300,
      useNativeDriver: true,
    }).start();

    setFlipped(!flipped);
  }

  return (
    <Pressable onPress={handlePress}>
      <View
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
          <Animated.View
            style={[
              styles.cardFace,
              {
                transform: [{ perspective: 1000 }, { rotateY: frontRotate }],
              },
            ]}>
            <DeckBadge deck={deck} />

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
          </Animated.View>

          <Animated.View
            style={[
              styles.cardFace,
              {
                transform: [{ perspective: 1000 }, { rotateY: backRotate }],
              },
            ]}>
            <DeckBadge deck={deck} />

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
          </Animated.View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cardFace: {
    ...StyleSheet.absoluteFillObject,
    backfaceVisibility: 'hidden',
  },
  deckBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#eef4ff',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 24,
  },
  deckBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#007AFF',
    letterSpacing: 0.3,
  },
});
