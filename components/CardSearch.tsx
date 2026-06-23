import { useMemo, useState } from 'react';
import {
  Text,
  TextInput,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { PressableScale } from './animations';

import { darkColors, lightColors } from '../constants/colors';
import { radius } from '../constants/radius';
import { getShadows } from '../constants/shadows';
import { spacing } from '../constants/spacing';
import { typography } from '../constants/typography';
import { useTheme } from '../storage/ThemeContext';
import type { Card } from '../types/card';

export type CardSearchProps = {
  cards: Card[];
  onSelectCard: (card: Card) => void;
  onQueryChange?: (query: string) => void;
  style?: StyleProp<ViewStyle>;
};

function matchesQuery(card: Card, query: string) {
  const haystack = [card.front, card.back, card.deck, card.example, card.category]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  return haystack.includes(query);
}

export default function CardSearch({
  cards,
  onSelectCard,
  onQueryChange,
  style,
}: CardSearchProps) {
  const { isDark } = useTheme();
  const palette = isDark ? darkColors : lightColors;
  const { cardShadow } = getShadows(isDark);

  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);

  const trimmedQuery = query.trim().toLowerCase();

  const results = useMemo(() => {
    if (!trimmedQuery) {
      return [];
    }

    return cards.filter((card) => matchesQuery(card, trimmedQuery)).slice(0, 8);
  }, [cards, trimmedQuery]);

  const showResults = focused && trimmedQuery.length > 0;

  return (
    <View style={[{ marginBottom: spacing[24], zIndex: 10 }, style]}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          borderWidth: 1.5,
          borderColor: focused ? palette.primary : palette.border,
          borderRadius: radius[16],
          backgroundColor: palette.card,
          paddingHorizontal: spacing[16],
          paddingVertical: spacing[12],
          gap: spacing[12],
          ...cardShadow,
        }}>
        <Ionicons name="search" size={20} color={palette.textSecondary} />
        <TextInput
          value={query}
          onChangeText={(text) => {
            setQuery(text);
            onQueryChange?.(text);
          }}
          placeholder="Search..."
          placeholderTextColor={palette.textSecondary}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          returnKeyType="search"
          autoCorrect={false}
          autoCapitalize="none"
          style={[
            typography.body,
            {
              flex: 1,
              color: palette.text,
              padding: 0,
            },
          ]}
        />
        {query.length > 0 ? (
          <PressableScale
            onPress={() => {
              setQuery('');
              onQueryChange?.('');
            }}
            scaleTo={0.92}
            style={{ padding: 2 }}>
            <Ionicons name="close-circle" size={20} color={palette.textSecondary} />
          </PressableScale>
        ) : null}
      </View>

      {showResults ? (
        <View
          style={{
            marginTop: spacing[8],
            borderRadius: radius[16],
            backgroundColor: palette.card,
            borderWidth: 1,
            borderColor: palette.border,
            overflow: 'hidden',
            ...cardShadow,
          }}>
          {results.length > 0 ? (
            results.map((card, index) => (
              <PressableScale
                key={card.id}
                onPress={() => {
                  onSelectCard(card);
                  setQuery('');
                  onQueryChange?.('');
                  setFocused(false);
                }}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: spacing[12],
                  paddingVertical: spacing[12],
                  paddingHorizontal: spacing[16],
                  backgroundColor: palette.card,
                  borderTopWidth: index === 0 ? 0 : 1,
                  borderTopColor: palette.border,
                }}>
                <Ionicons name="arrow-down-outline" size={16} color={palette.primary} />
                <View style={{ flex: 1 }}>
                  <Text style={[typography.subtitle, { color: palette.text, fontSize: 16 }]}>
                    {card.front}
                  </Text>
                  <Text
                    numberOfLines={1}
                    style={[typography.caption, { color: palette.textSecondary, marginTop: 2 }]}>
                    {card.back}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={palette.textSecondary} />
              </PressableScale>
            ))
          ) : (
            <View style={{ padding: spacing[16], alignItems: 'center' }}>
              <Text style={[typography.body, { color: palette.textSecondary }]}>
                No cards match &quot;{query.trim()}&quot;
              </Text>
            </View>
          )}
        </View>
      ) : null}
    </View>
  );
}
