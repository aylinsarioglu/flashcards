import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';

import {
  cardRadius,
  getShadow,
  layout,
  radius,
  spacing,
  typography,
} from '../constants/theme';
import { motion } from './animations';
import { useTheme } from '../storage/ThemeContext';

type FlashcardProps = {
  front: string;
  back: string;
  deck: string;
  example?: string;
  exampleTranslation?: string;
  favorite?: boolean;
  learned?: boolean;
  size?: 'default' | 'large' | 'study';
  showDeckBadge?: boolean;
};

const FLIP_DURATION = motion.flipDuration;

export default function Flashcard({
  front,
  back,
  deck,
  example,
  exampleTranslation,
  favorite = false,
  learned = false,
  size = 'default',
  showDeckBadge = true,
}: FlashcardProps) {
  const { colors, isDark } = useTheme();
  const { width, height } = useWindowDimensions();
  const isStudy = size === 'study';
  const isLarge = size === 'large' || isStudy;
  const cardWidth = Math.min(
    width - layout.contentPadding * 2,
    isStudy ? 500 : isLarge ? 440 : 400,
  );
  const cardMinHeight = isStudy
    ? Math.min(Math.max(height * 0.48, 380), 520)
    : isLarge
      ? 420
      : 360;
  const flipMinHeight = cardMinHeight - 48;

  const [flipped, setFlipped] = useState(false);
  const isAnimating = useRef(false);
  const flipAnimation = useRef(new Animated.Value(0)).current;
  const scaleAnimation = useRef(new Animated.Value(1)).current;

  const frontRotate = flipAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const backRotate = flipAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg'],
  });

  const frontOpacity = flipAnimation.interpolate({
    inputRange: [0, 0.5, 0.51, 1],
    outputRange: [1, 1, 0, 0],
  });

  const backOpacity = flipAnimation.interpolate({
    inputRange: [0, 0.49, 0.5, 1],
    outputRange: [0, 0, 1, 1],
  });

  useEffect(() => {
    flipAnimation.setValue(0);
    setFlipped(false);
    scaleAnimation.setValue(0.96);
    Animated.spring(scaleAnimation, {
      toValue: 1,
      friction: 7,
      tension: 80,
      useNativeDriver: true,
    }).start();
  }, [front, back, deck, flipAnimation, scaleAnimation]);

  function handlePressIn() {
    if (isAnimating.current) {
      return;
    }

    Animated.timing(scaleAnimation, {
      toValue: motion.cardPressScale,
      duration: 120,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  }

  function handlePressOut() {
    if (isAnimating.current) {
      return;
    }

    Animated.spring(scaleAnimation, {
      toValue: 1,
      friction: 7,
      tension: 80,
      useNativeDriver: true,
    }).start();
  }

  function handlePress() {
    if (isAnimating.current) {
      return;
    }

    const nextFlipped = !flipped;
    const toValue = nextFlipped ? 1 : 0;

    isAnimating.current = true;

    Animated.timing(flipAnimation, {
      toValue,
      duration: FLIP_DURATION,
      easing: Easing.inOut(Easing.cubic),
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) {
        setFlipped(nextFlipped);
      }

      isAnimating.current = false;
    });
  }

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnimation }] }}>
      <Pressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={{ width: cardWidth }}>
        <View
          style={[
            styles.card,
            {
              width: cardWidth,
              minHeight: cardMinHeight,
              backgroundColor: colors.card,
              borderColor: colors.borderLight,
              ...getShadow('elevated', isDark),
            },
          ]}>
          <View
            style={[
              styles.flipContainer,
              { minHeight: flipMinHeight },
            ]}>
            <Animated.View
              style={[
                styles.cardFace,
                {
                  opacity: frontOpacity,
                  transform: [{ rotateY: frontRotate }],
                },
              ]}>
              {showDeckBadge ? (
                <View
                  style={[
                    styles.deckBadge,
                    { backgroundColor: colors.primarySoft },
                  ]}>
                  <Text style={[styles.deckBadgeText, { color: colors.primary }]}>
                    {deck}
                  </Text>
                </View>
              ) : null}

              <View style={[styles.contentCenter, !showDeckBadge && { paddingTop: spacing.md }]}>
                <Text
                  style={[
                    styles.frontText,
                    isStudy && styles.frontTextStudy,
                    isLarge && !isStudy && styles.frontTextLarge,
                    { color: colors.text },
                  ]}>
                  {front}
                </Text>
              </View>

              <View
                style={[
                  styles.hintPill,
                  { backgroundColor: colors.surface },
                ]}>
                <Text style={[styles.hintText, { color: colors.muted }]}>
                  Tap to reveal
                </Text>
              </View>
            </Animated.View>

            <Animated.View
              style={[
                styles.cardFace,
                {
                  opacity: backOpacity,
                  transform: [{ rotateY: backRotate }],
                },
              ]}>
              <View style={styles.backHeader}>
                {showDeckBadge ? (
                  <View
                    style={[
                      styles.deckBadge,
                      styles.backDeckBadge,
                      { backgroundColor: colors.secondarySoft },
                    ]}>
                    <Text style={[styles.deckBadgeText, { color: colors.secondary }]}>
                      {deck}
                    </Text>
                  </View>
                ) : (
                  <View />
                )}
                <View style={styles.statusBadges}>
                  <View
                    style={[
                      styles.statusBadge,
                      {
                        backgroundColor: favorite
                          ? colors.warningSoft
                          : colors.surface,
                      },
                    ]}>
                    <Text
                      style={[
                        styles.statusText,
                        {
                          color: favorite ? colors.warning : colors.muted,
                        },
                      ]}>
                      {favorite ? 'Favorite' : 'Not Favorite'}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.statusBadge,
                      {
                        backgroundColor: learned
                          ? colors.successSoft
                          : colors.surface,
                      },
                    ]}>
                    <Text
                      style={[
                        styles.statusText,
                        {
                          color: learned ? colors.success : colors.muted,
                        },
                      ]}>
                      {learned ? 'Learned' : 'Learning'}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.backContent}>
                <View style={{ marginBottom: spacing.md }}>
                  <Text
                    style={[
                      typography.label,
                      styles.sectionLabel,
                      { color: colors.muted },
                    ]}>
                    Meaning
                  </Text>
                  <Text style={[styles.backText, { color: colors.text }]}>
                    {back}
                  </Text>
                </View>

                {example ? (
                  <View
                    style={[
                      styles.exampleBox,
                      {
                        backgroundColor: colors.surfaceElevated,
                        marginBottom: exampleTranslation ? spacing.md : 0,
                      },
                    ]}>
                    <Text
                      style={[
                        typography.label,
                        styles.sectionLabel,
                        { color: colors.muted },
                      ]}>
                      Example
                    </Text>
                    <Text style={[styles.exampleText, { color: colors.text }]}>
                      {example}
                    </Text>
                  </View>
                ) : null}

                {exampleTranslation ? (
                  <View
                    style={[
                      styles.exampleBox,
                      { backgroundColor: colors.surfaceElevated },
                    ]}>
                    <Text
                      style={[
                        typography.label,
                        styles.sectionLabel,
                        { color: colors.muted },
                      ]}>
                      Translation
                    </Text>
                    <Text
                      style={[styles.translationText, { color: colors.muted }]}>
                      {exampleTranslation}
                    </Text>
                  </View>
                ) : null}
              </View>

              <View
                style={[
                  styles.hintPill,
                  { backgroundColor: colors.surface },
                ]}>
                <Text style={[styles.hintText, { color: colors.muted }]}>
                  Tap to flip back
                </Text>
              </View>
            </Animated.View>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: cardRadius,
    padding: spacing.lg,
    borderWidth: 1,
  },
  flipContainer: {
    flex: 1,
  },
  cardFace: {
    ...StyleSheet.absoluteFill,
    backfaceVisibility: 'hidden',
  },
  contentCenter: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: spacing.md,
  },
  backContent: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: spacing.sm,
  },
  backHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  frontText: {
    fontSize: 30,
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 38,
    letterSpacing: -0.4,
  },
  frontTextLarge: {
    fontSize: 34,
    lineHeight: 42,
    letterSpacing: -0.5,
  },
  frontTextStudy: {
    fontSize: 36,
    lineHeight: 44,
    letterSpacing: -0.6,
  },
  backText: {
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 30,
  },
  sectionLabel: {
    marginBottom: spacing.sm,
  },
  exampleBox: {
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  exampleText: {
    fontSize: 15,
    fontStyle: 'italic',
    lineHeight: 22,
  },
  translationText: {
    fontSize: 15,
    lineHeight: 22,
  },
  hintPill: {
    alignSelf: 'center',
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  hintText: {
    fontSize: 13,
    fontWeight: '600',
  },
  deckBadge: {
    alignSelf: 'flex-start',
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    marginBottom: spacing.md,
  },
  backDeckBadge: {
    marginBottom: 0,
  },
  deckBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  statusBadges: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
  },
  statusBadge: {
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs + 1,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
