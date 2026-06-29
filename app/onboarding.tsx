import { useCallback, useRef, useState } from 'react';
import {
  FlatList,
  Text,
  View,
  useWindowDimensions,
  type ListRenderItemInfo,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import AppButton from '../components/AppButton';
import OnboardingIllustration, {
  type OnboardingIllustrationVariant,
} from '../components/OnboardingIllustration';
import { FadeInView, motion } from '../components/animations';
import { layout, spacing, typography } from '../constants/theme';
import { saveOnboardingComplete } from '../storage/onboardingStorage';
import { useTheme } from '../storage/ThemeContext';

type OnboardingSlide = {
  id: string;
  variant: OnboardingIllustrationVariant;
  title: string;
  subtitle: string;
};

const SLIDES: OnboardingSlide[] = [
  {
    id: 'welcome',
    variant: 'welcome',
    title: 'Welcome to Flashcards',
    subtitle: 'Learn English naturally.',
  },
  {
    id: 'offline',
    variant: 'offline',
    title: 'Study anywhere.',
    subtitle: 'Works offline.',
  },
  {
    id: 'ready',
    variant: 'ready',
    title: 'Ready to start?',
    subtitle: '',
  },
];

const STARTER_DECK = 'Collocations';

export default function OnboardingScreen() {
  const { colors, isDark } = useTheme();
  const { width: screenWidth } = useWindowDimensions();
  const listRef = useRef<FlatList<OnboardingSlide>>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const pageWidth = Math.min(screenWidth, layout.maxWidth);
  const isLastSlide = activeIndex === SLIDES.length - 1;

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const index = Math.round(
        event.nativeEvent.contentOffset.x / pageWidth,
      );
      setActiveIndex(index);
    },
    [pageWidth],
  );

  function goToSlide(index: number) {
    listRef.current?.scrollToIndex({ index, animated: true });
    setActiveIndex(index);
  }

  async function completeOnboarding() {
    await saveOnboardingComplete();
  }

  async function handleExploreStarterDecks() {
    await completeOnboarding();
    router.replace(`/(tabs)/study?deck=${encodeURIComponent(STARTER_DECK)}`);
  }

  async function handleCreateDeck() {
    await completeOnboarding();
    router.replace('/(tabs)/add-card');
  }

  function handleNext() {
    if (isLastSlide) {
      return;
    }

    goToSlide(activeIndex + 1);
  }

  function renderSlide({ item, index }: ListRenderItemInfo<OnboardingSlide>) {
    return (
      <View
        style={{
          width: pageWidth,
          flex: 1,
          paddingHorizontal: layout.contentPadding,
        }}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            paddingTop: spacing.lg,
          }}>
          <FadeInView delay={index === activeIndex ? 0 : motion.stagger}>
            <OnboardingIllustration
              variant={item.variant}
              colors={colors}
              isDark={isDark}
            />
          </FadeInView>

          <FadeInView delay={motion.stagger} style={{ marginTop: spacing.xxl }}>
            <Text
              style={[
                typography.hero,
                {
                  color: colors.text,
                  textAlign: 'center',
                  marginBottom: item.subtitle ? spacing.sm : 0,
                },
              ]}>
              {item.title}
            </Text>
            {item.subtitle ? (
              <Text
                style={[
                  typography.body,
                  {
                    color: colors.muted,
                    textAlign: 'center',
                    maxWidth: 320,
                    alignSelf: 'center',
                  },
                ]}>
                {item.subtitle}
              </Text>
            ) : null}
          </FadeInView>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View
        style={{
          flex: 1,
          width: '100%',
          maxWidth: layout.maxWidth,
          alignSelf: 'center',
        }}>
        <FlatList
          ref={listRef}
          data={SLIDES}
          keyExtractor={(item) => item.id}
          renderItem={renderSlide}
          horizontal
          pagingEnabled
          bounces={false}
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleScroll}
          onScrollToIndexFailed={(info) => {
            listRef.current?.scrollToOffset({
              offset: info.averageItemLength * info.index,
              animated: true,
            });
          }}
          getItemLayout={(_, index) => ({
            length: pageWidth,
            offset: pageWidth * index,
            index,
          })}
          style={{ flex: 1 }}
        />

        <View
          style={{
            paddingHorizontal: layout.contentPadding,
            paddingBottom: spacing.lg,
            paddingTop: spacing.md,
            gap: spacing.md,
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              gap: spacing.sm,
            }}
            accessibilityRole="tablist"
            accessibilityLabel={`Onboarding step ${activeIndex + 1} of ${SLIDES.length}`}>
            {SLIDES.map((slide, index) => (
              <View
                key={slide.id}
                accessibilityRole="tab"
                accessibilityState={{ selected: index === activeIndex }}
                style={{
                  width: index === activeIndex ? spacing.lg : spacing.sm,
                  height: spacing.sm,
                  borderRadius: spacing.sm,
                  backgroundColor:
                    index === activeIndex ? colors.primary : colors.track,
                }}
              />
            ))}
          </View>

          {isLastSlide ? (
            <View style={{ gap: spacing.sm }}>
              <AppButton
                title="Explore Starter Decks"
                onPress={() => void handleExploreStarterDecks()}
              />
              <AppButton
                title="Create My Own Deck"
                variant="outline"
                onPress={() => void handleCreateDeck()}
              />
            </View>
          ) : (
            <AppButton title="Continue" onPress={handleNext} />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
