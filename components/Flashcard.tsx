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
import { typography as dsTypography } from '../constants/typography';
import {
  getShadow,
  layout,
  radius,
} from '../constants/theme';
import { motion } from './animations';
import { useTheme } from '../storage/ThemeContext';
import { speakEnglish } from '../utils/speech';
import * as Speech from 'expo-speech';

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

function DeckBadge({ label, tint, textColor }: { label: string; tint: string; textColor: string }) {
  return (
    <View style={[styles.deckBadge, { backgroundColor: tint }]}>
      <Ionicons name="folder-outline" size={13} color={textColor} />
      <Text style={[styles.deckBadgeText, { color: textColor }]} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

function SpeakButton({
  text,
  colors,
}: {
  text: string;
  colors: ReturnType<typeof useTheme>['colors'];
}) {
  return (
    <Pressable
      onPress={(event) => {
        event?.stopPropagation?.();
        speakEnglish(text);
      }}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel="Speak text aloud"
      style={({ pressed }) => [
        styles.speakButton,
        {
          backgroundColor: colors.primarySoft,
          borderColor: colors.borderLight,
          opacity: pressed ? 0.75 : 1,
        },
      ]}>
      <Ionicons name="volume-high" size={20} color={colors.primary} />
    </Pressable>
  );
}

function FlipHint({ label, colors }: { label: string; colors: ReturnType<typeof useTheme>['colors'] }) {
  return (
    <View style={[styles.hintPill, { backgroundColor: colors.surfaceElevated, borderColor: colors.borderLight }]}>
      <Ionicons name="sync-outline" size={14} color={colors.muted} />
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
  colors: ReturnType<typeof useTheme>['colors'];
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

function StatusRow({
  favorite,
  learned,
  colors,
}: {
  favorite: boolean;
  learned: boolean;
  colors: ReturnType<typeof useTheme>['colors'];
}) {
  return (
    <View style={styles.statusRow}>
      <View
        style={[
          styles.favoriteIcon,
          {
            backgroundColor: favorite ? colors.warningSoft : colors.surface,
            borderColor: favorite ? colors.warning + '44' : colors.borderLight,
          },
        ]}>
        <Ionicons
          name={favorite ? 'heart' : 'heart-outline'}
          size={18}
          color={favorite ? colors.warning : colors.muted}
        />
      </View>
      <View
        style={[
          styles.learnedBadge,
          {
            backgroundColor: learned ? colors.successSoft : colors.surface,
            borderColor: learned ? colors.success + '44' : colors.borderLight,
          },
        ]}>
        <Ionicons
          name={learned ? 'checkmark-circle' : 'school-outline'}
          size={14}
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
    ? Math.min(Math.max(height * 0.48, 380), 520)
    : isLarge
      ? 420
      : 360;
  const flipMinHeight = cardMinHeight - dsSpacing[32];

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
    outputRange: [1, 0.97, 1],
  });

  useEffect(() => {
    flipAnimation.setValue(0);
    setFlipped(false);
    scaleAnimation.setValue(0.96);
    Speech.stop();
    Animated.spring(scaleAnimation, {
      toValue: 1,
      friction: 7,
      tension: 80,
      useNativeDriver: true,
    }).start();
  }, [front, back, deck, flipAnimation, scaleAnimation]);

  useEffect(() => () => {
    Speech.stop();
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
                {showDeckBadge ? (
                  <DeckBadge
                    label={deck}
                    tint={colors.primarySoft}
                    textColor={colors.primary}
                  />
                ) : null}

                <View
                  style={[
                    styles.contentCenter,
                    !showDeckBadge && { paddingTop: dsSpacing[8] },
                  ]}>
                  <View style={styles.textWithSpeaker}>
                    <Text style={[frontTextStyle, styles.textWithSpeakerLabel]}>{front}</Text>
                    <SpeakButton text={front} colors={colors} />
                  </View>
                </View>

                <FlipHint label="Tap to flip" colors={colors} />
              </View>

              <View style={[styles.cardFace, styles.cardBack]}>
                <View style={styles.backHeader}>
                  {showDeckBadge ? (
                    <DeckBadge
                      label={deck}
                      tint={colors.secondarySoft}
                      textColor={colors.secondary}
                    />
                  ) : (
                    <View />
                  )}
                  <StatusRow favorite={favorite} learned={learned} colors={colors} />
                </View>

                <View style={styles.backContent}>
                  <ContentSection title="Meaning" colors={colors} accent={colors.primary}>
                    <Text style={meaningTextStyle}>{back}</Text>
                  </ContentSection>

                  {example ? (
                    <ContentSection
                      title="Example"
                      colors={colors}
                      accent={colors.secondary}>
                      <View style={styles.textWithSpeaker}>
                        <Text
                          style={[styles.exampleText, styles.textWithSpeakerLabel, { color: colors.text }]}>
                          {example}
                        </Text>
                        <SpeakButton text={example} colors={colors} />
                      </View>
                    </ContentSection>
                  ) : null}

                  {exampleTranslation ? (
                    <ContentSection
                      title="Translation"
                      colors={colors}
                      accent={colors.accent}>
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
    padding: dsSpacing[24],
    paddingTop: dsSpacing[20],
    borderWidth: 1,
    overflow: 'hidden',
  },
  accentBar: {
    position: 'absolute',
    top: 0,
    left: dsSpacing[24],
    right: dsSpacing[24],
    height: 3,
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
    paddingTop: dsSpacing[4],
  },
  cardBack: {
    transform: [{ rotateY: '180deg' }],
  },
  contentCenter: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: dsSpacing[20],
    paddingHorizontal: dsSpacing[8],
  },
  textWithSpeaker: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: dsSpacing[12],
    width: '100%',
  },
  textWithSpeakerLabel: {
    flexShrink: 1,
    textAlign: 'center',
  },
  speakButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    flexShrink: 0,
  },
  backContent: {
    flex: 1,
    justifyContent: 'center',
    gap: dsSpacing[12],
    paddingVertical: dsSpacing[8],
  },
  backHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: dsSpacing[12],
    marginBottom: dsSpacing[16],
  },
  frontText: {
    fontSize: 32,
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 40,
    letterSpacing: -0.6,
  },
  frontTextLarge: {
    fontSize: 36,
    lineHeight: 44,
    letterSpacing: -0.7,
  },
  frontTextStudy: {
    fontSize: 38,
    lineHeight: 46,
    letterSpacing: -0.8,
  },
  meaningText: {
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 30,
    letterSpacing: -0.3,
  },
  meaningTextLarge: {
    fontSize: 24,
    lineHeight: 32,
  },
  meaningTextStudy: {
    fontSize: 26,
    lineHeight: 34,
  },
  section: {
    borderRadius: dsRadius[16],
    padding: dsSpacing[16],
    borderWidth: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: dsSpacing[8],
    marginBottom: dsSpacing[12],
  },
  sectionDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  sectionTitle: {
    ...dsTypography.caption,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  exampleText: {
    fontSize: 16,
    fontStyle: 'italic',
    lineHeight: 24,
    letterSpacing: -0.1,
  },
  translationText: {
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: -0.1,
  },
  hintPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    gap: dsSpacing[8],
    borderRadius: radius.full,
    paddingHorizontal: dsSpacing[16],
    paddingVertical: dsSpacing[8],
    borderWidth: 1,
    marginTop: dsSpacing[8],
  },
  hintText: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  deckBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: dsSpacing[8],
    borderRadius: radius.full,
    paddingHorizontal: dsSpacing[12],
    paddingVertical: dsSpacing[8],
    maxWidth: '72%',
  },
  deckBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.3,
    flexShrink: 1,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: dsSpacing[8],
    flexShrink: 0,
  },
  favoriteIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  learnedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: dsSpacing[4],
    borderRadius: radius.full,
    paddingHorizontal: dsSpacing[12],
    paddingVertical: dsSpacing[8],
    borderWidth: 1,
  },
  learnedText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});
