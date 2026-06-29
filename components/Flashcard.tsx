import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { radius as dsRadius } from '../constants/radius';
import { spacing as dsSpacing } from '../constants/spacing';
import {
  getShadow,
  layout,
  radius,
  spacing,
  typography,
} from '../constants/theme';
import { motion } from './animations';
import SpeakButton from './SpeakButton';
import { useTheme } from '../storage/ThemeContext';
import { stopSpeaking } from '../utils/speech';

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

const FLIP_DURATION = 300;
const FLIP_EASING = Easing.bezier(0.4, 0, 0.2, 1);
const FLIP_PERSPECTIVE = 1200;

type ThemeColors = ReturnType<typeof useTheme>['colors'];

function DeckBadge({
  label,
  tint,
  textColor,
}: {
  label: string;
  tint: string;
  textColor: string;
}) {
  return (
    <View style={[styles.deckBadge, { backgroundColor: tint }]}>
      <Ionicons name="folder-outline" size={14} color={textColor} />
      <Text style={[styles.deckBadgeText, { color: textColor }]} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

function FavoriteIcon({ active, colors }: { active: boolean; colors: ThemeColors }) {
  return (
    <View
      style={[
        styles.favoriteIcon,
        {
          backgroundColor: active ? colors.warningSoft : colors.surfaceElevated,
          borderColor: active ? `${colors.warning}55` : colors.borderLight,
        },
      ]}
      accessibilityLabel={active ? 'Favorite' : 'Not favorite'}>
      <Ionicons
        name={active ? 'heart' : 'heart-outline'}
        size={20}
        color={active ? colors.warning : colors.muted}
      />
    </View>
  );
}

function LearnedBadge({ learned, colors }: { learned: boolean; colors: ThemeColors }) {
  return (
    <View
      style={[
        styles.learnedBadge,
        {
          backgroundColor: learned ? colors.successSoft : colors.surfaceElevated,
          borderColor: learned ? `${colors.success}55` : colors.borderLight,
        },
      ]}>
      <Ionicons
        name={learned ? 'checkmark-circle' : 'ellipse-outline'}
        size={15}
        color={learned ? colors.success : colors.muted}
      />
      <Text
        style={[
          styles.learnedText,
          { color: learned ? colors.success : colors.muted },
        ]}>
        {learned ? 'Learned' : 'Learning'}
      </Text>
    </View>
  );
}

function CardMetaRow({
  deck,
  favorite,
  learned,
  colors,
  showDeckBadge,
}: {
  deck: string;
  favorite: boolean;
  learned: boolean;
  colors: ThemeColors;
  showDeckBadge: boolean;
}) {
  return (
    <View style={styles.metaRow}>
      {showDeckBadge ? (
        <DeckBadge label={deck} tint={colors.primarySoft} textColor={colors.primary} />
      ) : (
        <View style={styles.metaSpacer} />
      )}
      <View style={styles.statusRow}>
        <FavoriteIcon active={favorite} colors={colors} />
        <LearnedBadge learned={learned} colors={colors} />
      </View>
    </View>
  );
}

function FlipHint({
  label,
  colors,
}: {
  label: string;
  colors: ThemeColors;
}) {
  return (
    <View
      style={[
        styles.hintPill,
        {
          backgroundColor: colors.surfaceElevated,
          borderColor: colors.borderLight,
        },
      ]}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants">
      <Ionicons name="hand-left-outline" size={15} color={colors.muted} />
      <Text style={[styles.hintText, { color: colors.muted }]}>{label}</Text>
    </View>
  );
}

function ContentSection({
  title,
  children,
  colors,
  accent,
}: {
  title: string;
  children: ReactNode;
  colors: ThemeColors;
  accent?: string;
}) {
  return (
    <View
      style={[
        styles.section,
        {
          backgroundColor: colors.surfaceElevated,
          borderColor: colors.borderLight,
        },
      ]}>
      <View style={styles.sectionHeader}>
        <View style={[styles.sectionDot, { backgroundColor: accent ?? colors.primary }]} />
        <Text style={[styles.sectionTitle, { color: colors.muted }]}>{title}</Text>
      </View>
      {children}
    </View>
  );
}

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
    ? Math.min(Math.max(height * 0.48, 400), 540)
    : isLarge
      ? 440
      : 380;
  const flipMinHeight = cardMinHeight - spacing.xl;

  const [flipped, setFlipped] = useState(false);
  const isAnimating = useRef(false);
  const flipAnimation = useRef(new Animated.Value(0)).current;
  const scaleAnimation = useRef(new Animated.Value(1)).current;

  const spin = flipAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const flipDepth = flipAnimation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 0.98, 1],
  });

  useEffect(() => {
    flipAnimation.setValue(0);
    setFlipped(false);
    scaleAnimation.setValue(0.96);
    stopSpeaking();
    Animated.spring(scaleAnimation, {
      toValue: 1,
      friction: 7,
      tension: 80,
      useNativeDriver: true,
    }).start();
  }, [front, back, deck, flipAnimation, scaleAnimation]);

  useEffect(() => () => {
    stopSpeaking();
  }, []);

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
      easing: FLIP_EASING,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) {
        setFlipped(nextFlipped);
      }

      isAnimating.current = false;
    });
  }

  const frontTextStyle = [
    styles.frontText,
    isStudy && styles.frontTextStudy,
    isLarge && !isStudy && styles.frontTextLarge,
    { color: colors.text },
  ];

  const meaningTextStyle = [
    styles.meaningText,
    isStudy && styles.meaningTextStudy,
    isLarge && !isStudy && styles.meaningTextLarge,
    { color: colors.text },
  ];

  const cardShadow = getShadow('soft', isDark);

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnimation }] }}>
      <Pressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        accessibilityRole="button"
        accessibilityLabel={flipped ? 'Flashcard back side' : 'Flashcard front side'}
        accessibilityHint={flipped ? 'Tap to flip back' : 'Tap to flip'}
        style={{ width: cardWidth }}>
        <View
          style={[
            styles.card,
            {
              width: cardWidth,
              minHeight: cardMinHeight,
              backgroundColor: colors.card,
              borderColor: colors.borderLight,
              ...cardShadow,
            },
          ]}>
          <View style={[styles.accentBar, { backgroundColor: colors.primary }]} />

          <View style={[styles.flipContainer, { minHeight: flipMinHeight }]}>
            <Animated.View
              style={[
                styles.flipInner,
                {
                  transform: [
                    { perspective: FLIP_PERSPECTIVE },
                    { rotateY: spin },
                    { scale: flipDepth },
                  ],
                },
              ]}>
              <View style={styles.cardFace}>
                <CardMetaRow
                  deck={deck}
                  favorite={favorite}
                  learned={learned}
                  colors={colors}
                  showDeckBadge={showDeckBadge}
                />

                <View style={styles.contentCenter}>
                  <View style={styles.textWithSpeaker}>
                    <Text style={[frontTextStyle, styles.textWithSpeakerLabel]}>{front}</Text>
                    <SpeakButton text={front} />
                  </View>
                </View>

                <FlipHint label="Tap to flip" colors={colors} />
              </View>

              <View style={[styles.cardFace, styles.cardBack]}>
                <CardMetaRow
                  deck={deck}
                  favorite={favorite}
                  learned={learned}
                  colors={colors}
                  showDeckBadge={showDeckBadge}
                />

                <View style={styles.backContent}>
                  <ContentSection title="Meaning" colors={colors} accent={colors.primary}>
                    <Text style={meaningTextStyle}>{back}</Text>
                  </ContentSection>

                  {example ? (
                    <ContentSection title="Example" colors={colors} accent={colors.secondary}>
                      <View style={styles.textWithSpeaker}>
                        <Text
                          style={[
                            styles.exampleText,
                            styles.textWithSpeakerLabel,
                            { color: colors.text },
                          ]}>
                          {example}
                        </Text>
                        <SpeakButton text={example} />
                      </View>
                    </ContentSection>
                  ) : null}

                  {exampleTranslation ? (
                    <ContentSection title="Translation" colors={colors} accent={colors.accent}>
                      <Text style={[styles.translationText, { color: colors.muted }]}>
                        {exampleTranslation}
                      </Text>
                    </ContentSection>
                  ) : null}
                </View>

                <FlipHint label="Tap to flip back" colors={colors} />
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
    borderRadius: dsRadius[24],
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    borderWidth: 1,
    overflow: 'hidden',
  },
  accentBar: {
    position: 'absolute',
    top: 0,
    left: spacing.lg,
    right: spacing.lg,
    height: 4,
    borderRadius: radius.full,
  },
  flipContainer: {
    flex: 1,
    overflow: 'visible',
  },
  flipInner: {
    flex: 1,
    width: '100%',
  },
  cardFace: {
    ...StyleSheet.absoluteFill,
    backfaceVisibility: 'hidden',
    paddingTop: dsSpacing[8],
  },
  cardBack: {
    transform: [{ rotateY: '180deg' }],
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  metaSpacer: {
    flex: 1,
  },
  contentCenter: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.sm,
  },
  textWithSpeaker: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    width: '100%',
  },
  textWithSpeakerLabel: {
    flexShrink: 1,
    textAlign: 'center',
  },
  backContent: {
    flex: 1,
    justifyContent: 'center',
    gap: spacing.md,
    paddingBottom: spacing.sm,
  },
  frontText: {
    ...typography.hero,
    textAlign: 'center',
  },
  frontTextLarge: {
    ...typography.display,
    textAlign: 'center',
  },
  frontTextStudy: {
    fontSize: 36,
    fontWeight: '800',
    letterSpacing: -0.75,
    lineHeight: 44,
    textAlign: 'center',
  },
  meaningText: {
    ...typography.title,
    letterSpacing: -0.35,
  },
  meaningTextLarge: {
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 32,
    letterSpacing: -0.4,
  },
  meaningTextStudy: {
    fontSize: 26,
    fontWeight: '700',
    lineHeight: 34,
    letterSpacing: -0.45,
  },
  section: {
    borderRadius: dsRadius[16],
    padding: spacing.md,
    borderWidth: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  sectionDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  sectionTitle: {
    ...typography.label,
    fontSize: 11,
  },
  exampleText: {
    ...typography.bodyMedium,
    fontStyle: 'italic',
    letterSpacing: -0.15,
  },
  translationText: {
    ...typography.body,
    letterSpacing: -0.1,
  },
  hintPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    gap: spacing.sm,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    marginTop: spacing.sm,
  },
  hintText: {
    ...typography.caption,
    fontWeight: '600',
    letterSpacing: 0.15,
  },
  deckBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: spacing.sm,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    maxWidth: '58%',
  },
  deckBadgeText: {
    ...typography.caption,
    fontWeight: '700',
    letterSpacing: 0.25,
    flexShrink: 1,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flexShrink: 0,
  },
  favoriteIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  learnedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: dsSpacing[4],
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
  },
  learnedText: {
    ...typography.caption,
    fontWeight: '700',
    letterSpacing: 0.15,
  },
});
