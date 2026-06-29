import { useMemo } from 'react';
import { ScrollView, Text, View, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import ScreenContainer from '../components/ScreenContainer';
import StarterDeckCard from '../components/StarterDeckCard';
import { FadeInView, motion, PressableScale } from '../components/animations';
import { PageHeader } from '../components/ui';
import { starterDecks, type StarterDeckName } from '../data/starterLibrary';
import { spacing as dsSpacing } from '../constants/spacing';
import { layout, spacing, typography } from '../constants/theme';
import { useTheme } from '../storage/ThemeContext';

const STARTER_DECK_META: Record<
  StarterDeckName,
  { icon: 'chatbubbles' | 'airplane' | 'flash'; accent: 'primary' | 'secondary' | 'accent' }
> = {
  'Daily English': { icon: 'chatbubbles', accent: 'primary' },
  'Travel English': { icon: 'airplane', accent: 'secondary' },
  'Phrasal Verbs': { icon: 'flash', accent: 'accent' },
};

export default function StarterLibraryScreen() {
  const { colors } = useTheme();
  const { width: screenWidth } = useWindowDimensions();

  const columns = screenWidth >= 720 ? 3 : screenWidth >= 480 ? 2 : 1;
  const cardWidth =
    columns === 1
      ? undefined
      : (Math.min(screenWidth, layout.maxWidth) -
          layout.contentPadding * 2 -
          spacing.md * (columns - 1)) /
        columns;

  const starterDeckEntries = useMemo(
    () =>
      (Object.keys(starterDecks) as StarterDeckName[]).map((name) => ({
        name,
        cardCount: starterDecks[name].length,
        meta: STARTER_DECK_META[name],
      })),
    [],
  );

  const totalCards = starterDeckEntries.reduce((sum, deck) => sum + deck.cardCount, 0);

  return (
    <ScreenContainer style={{ paddingHorizontal: layout.contentPadding }}>
      <ScrollView
        contentContainerStyle={{
          paddingTop: dsSpacing[24],
          paddingBottom: dsSpacing[40],
        }}
        showsVerticalScrollIndicator={false}>
        <PressableScale
          onPress={() => router.back()}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            alignSelf: 'flex-start',
            gap: dsSpacing[4],
            marginBottom: dsSpacing[16],
            paddingVertical: dsSpacing[4],
            paddingRight: dsSpacing[8],
          }}>
          <Ionicons name="chevron-back" size={22} color={colors.primary} />
          <Text
            style={[
              typography.subtitle,
              { color: colors.primary, fontWeight: '700' },
            ]}>
            Back
          </Text>
        </PressableScale>

        <PageHeader
          title="Starter Library"
          subtitle={`${starterDeckEntries.length} decks · ${totalCards} cards`}
          colors={colors}
        />

        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: spacing.md,
          }}>
          {starterDeckEntries.map((deck, index) => {
            const accentKey = deck.meta.accent;
            const accentColor = colors[accentKey];
            const accentSoft =
              accentKey === 'primary'
                ? colors.primarySoft
                : accentKey === 'secondary'
                  ? colors.secondarySoft
                  : colors.accentSoft;

            return (
              <View
                key={deck.name}
                style={{
                  width: columns === 1 ? '100%' : cardWidth,
                  flexGrow: columns === 1 ? 1 : 0,
                }}>
                <FadeInView delay={motion.stagger * index}>
                  <StarterDeckCard
                    name={deck.name}
                    cardCount={deck.cardCount}
                    icon={deck.meta.icon}
                    accentColor={accentColor}
                    accentSoft={accentSoft}
                    colors={colors}
                    onStudy={() =>
                      router.push(`/study?deck=${encodeURIComponent(deck.name)}`)
                    }
                  />
                </FadeInView>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
