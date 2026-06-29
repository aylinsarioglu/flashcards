import { Text, View, useWindowDimensions } from 'react-native';
import { router, type Href } from 'expo-router';

import AppButton from './AppButton';
import AppCard from './AppCard';
import EmptyLibraryIllustration from './EmptyLibraryIllustration';
import { typography as dsTypography } from '../constants/typography';
import { layout, spacing, typography, type ThemeColors } from '../constants/theme';

type CustomDecksEmptyStateProps = {
  colors: ThemeColors;
  isDark: boolean;
};

export default function CustomDecksEmptyState({
  colors,
  isDark,
}: CustomDecksEmptyStateProps) {
  const { width: screenWidth } = useWindowDimensions();
  const isWide = screenWidth >= layout.maxWidth;

  return (
    <AppCard accentColor={colors.primary}>
      <View
        style={{
          alignItems: 'center',
          paddingVertical: isWide ? spacing.md : spacing.sm,
        }}>
        <EmptyLibraryIllustration colors={colors} isDark={isDark} compact />

        <Text
          style={[
            typography.title,
            {
              color: colors.text,
              textAlign: 'center',
              marginBottom: spacing.sm,
            },
          ]}>
          ✨ Explore Starter Decks
        </Text>
        <Text
          style={[
            dsTypography.body,
            {
              color: colors.muted,
              textAlign: 'center',
              marginBottom: spacing.lg,
              maxWidth: 320,
            },
          ]}>
          You have not created any decks yet. Browse ready-made collections to start
          learning right away.
        </Text>

        <View style={{ alignSelf: 'stretch', maxWidth: 280, width: '100%' }}>
          <AppButton
            title="Browse Library"
            onPress={() => router.push('/starter-library' as Href)}
          />
        </View>
      </View>
    </AppCard>
  );
}
