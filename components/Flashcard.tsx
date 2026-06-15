import { useEffect, useRef, useState } from 'react';
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
  const isAnimating = useRef(false);
  const flipAnimation = useRef(new Animated.Value(0)).current;

  const frontRotate = flipAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const backRotate = flipAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg'],
  });

  useEffect(() => {
    flipAnimation.setValue(0);
    setFlipped(false);
  }, [front, back, deck, flipAnimation]);

  function handlePress() {
    if (isAnimating.current) {
      return;
    }

    const nextFlipped = !flipped;
    const toValue = nextFlipped ? 1 : 0;

    isAnimating.current = true;

    Animated.timing(flipAnimation, {
      toValue,
      duration: 300,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) {
        setFlipped(nextFlipped);
      }

      isAnimating.current = false;
    });
  }

  return (
    <Pressable onPress={handlePress}>
      <View style={styles.card}>
        <View style={styles.flipContainer}>
          <Animated.View
            style={[
              styles.cardFace,
              {
                transform: [{ rotateY: frontRotate }],
              },
            ]}>
            <DeckBadge deck={deck} />

            <View style={styles.contentCenter}>
              <Text style={styles.frontText}>{front}</Text>
            </View>

            <Text style={styles.hintText}>Tap to reveal meaning</Text>
          </Animated.View>

          <Animated.View
            style={[
              styles.cardFace,
              {
                transform: [{ rotateY: backRotate }],
              },
            ]}>
            <DeckBadge deck={deck} />

            <View style={styles.backContent}>
              <View style={{ marginBottom: 20 }}>
                <Text style={styles.sectionLabel}>Meaning</Text>
                <Text style={styles.backText}>{back}</Text>
              </View>

              {example && (
                <View style={{ marginBottom: exampleTranslation ? 20 : 0 }}>
                  <Text style={styles.sectionLabel}>Example</Text>
                  <Text style={styles.exampleText}>{example}</Text>
                </View>
              )}

              {exampleTranslation && (
                <View>
                  <Text style={styles.sectionLabel}>Translation</Text>
                  <Text style={styles.translationText}>
                    {exampleTranslation}
                  </Text>
                </View>
              )}
            </View>

            <Text style={[styles.hintText, { marginTop: 16 }]}>
              Tap to flip back
            </Text>
          </Animated.View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
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
  },
  flipContainer: {
    flex: 1,
    minHeight: 252,
    perspective: 1000,
  },
  cardFace: {
    ...StyleSheet.absoluteFillObject,
    backfaceVisibility: 'hidden',
  },
  contentCenter: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 16,
  },
  backContent: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 8,
  },
  frontText: {
    fontSize: 30,
    fontWeight: '700',
    textAlign: 'center',
    color: '#1a1a1a',
    lineHeight: 38,
  },
  backText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    lineHeight: 32,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#999',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  exampleText: {
    fontSize: 15,
    color: '#444',
    fontStyle: 'italic',
    lineHeight: 22,
  },
  translationText: {
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
  },
  hintText: {
    fontSize: 13,
    color: '#aaa',
    textAlign: 'center',
    fontWeight: '500',
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
