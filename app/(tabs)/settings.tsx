import Constants from 'expo-constants';
import { Alert, Pressable, ScrollView, Text, View, type AlertButton } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import ScreenContainer from '../../components/ScreenContainer';
import { AppCard } from '../../components/ui';
import {
  getShadow,
  radius,
  spacing,
  typography,
  type ThemeColors,
} from '../../constants/theme';
import { useCards } from '../../storage/CardsContext';
import { getThemeModeLabel, useTheme, type ThemeMode } from '../../storage/ThemeContext';

const APP_VERSION =
  Constants.expoConfig?.version ?? Constants.manifest?.version ?? '1.0.0';

const DAILY_GOAL_OPTIONS = [5, 10, 15, 20, 30];

type SettingsRowProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value?: string;
  colors: ThemeColors;
  isDark: boolean;
  onPress?: () => void;
  destructive?: boolean;
  showChevron?: boolean;
};

function SettingsRow({
  icon,
  label,
  value,
  colors,
  isDark,
  onPress,
  destructive = false,
  showChevron = true,
}: SettingsRowProps) {
  const textColor = destructive ? colors.danger : colors.text;

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.md,
        borderRadius: radius.lg,
        backgroundColor: colors.surface,
        opacity: pressed && onPress ? 0.9 : 1,
        ...getShadow('soft', isDark),
      })}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md, flex: 1 }}>
        <Ionicons
          name={icon}
          size={22}
          color={destructive ? colors.danger : colors.primary}
        />
        <Text style={{ fontSize: 16, fontWeight: '600', color: textColor, flex: 1 }}>
          {label}
        </Text>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
        {value ? (
          <Text style={{ fontSize: 15, color: colors.muted }}>{value}</Text>
        ) : null}
        {showChevron && onPress ? (
          <Ionicons name="chevron-forward" size={20} color={colors.muted} />
        ) : null}
      </View>
    </Pressable>
  );
}

export default function SettingsScreen() {
  const { colors, isDark, themeMode, setThemeMode } = useTheme();
  const { dailyGoal, setDailyGoal, resetProgress } = useCards();

  function handleThemePress() {
    const options: { mode: ThemeMode; label: string }[] = [
      { mode: 'system', label: 'System' },
      { mode: 'light', label: 'Light' },
      { mode: 'dark', label: 'Dark' },
    ];

    const buttons: AlertButton[] = options.map(({ mode, label }) => ({
      text: `${label}${themeMode === mode ? ' ✓' : ''}`,
      onPress: () => setThemeMode(mode),
    }));

    buttons.push({ text: 'Cancel', style: 'cancel' });

    Alert.alert(
      'Theme',
      'Choose appearance. System follows your device setting.',
      buttons,
    );
  }

  function handleDailyGoalPress() {
    const buttons: AlertButton[] = DAILY_GOAL_OPTIONS.map((option) => ({
      text: `${option} cards${option === dailyGoal ? ' ✓' : ''}`,
      onPress: () => setDailyGoal(option),
    }));

    buttons.push({ text: 'Cancel', style: 'cancel' });

    Alert.alert('Daily Goal', 'How many cards do you want to review each day?', buttons);
  }

  function handleResetProgress() {
    Alert.alert(
      'Reset Progress',
      'This will reset your streak, daily progress, achievements, and learned cards. Your flashcards will be kept.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: resetProgress,
        },
      ],
    );
  }

  function handleAboutPress() {
    Alert.alert(
      'About App',
      'A simple flashcard app to help you learn vocabulary and concepts. Study decks, track your streak, and build a daily habit.',
      [{ text: 'OK' }],
    );
  }

  return (
    <ScreenContainer style={{ paddingHorizontal: spacing.lg }}>
      <ScrollView
        contentContainerStyle={{
          paddingVertical: spacing.xl,
          paddingBottom: spacing.xxl,
        }}
        showsVerticalScrollIndicator={false}>
        <Text style={[typography.hero, { color: colors.text, marginBottom: spacing.sm }]}>
          Settings
        </Text>
        <Text style={[typography.body, { color: colors.muted, marginBottom: spacing.xl }]}>
          Customize your learning experience.
        </Text>

        <AppCard colors={colors} isDark={isDark} style={{ marginBottom: spacing.lg }}>
          <Text style={[typography.subtitle, { color: colors.text, marginBottom: spacing.md }]}>
            Appearance
          </Text>
          <SettingsRow
            icon={isDark ? 'moon' : 'sunny'}
            label="Theme"
            value={getThemeModeLabel(themeMode)}
            colors={colors}
            isDark={isDark}
            onPress={handleThemePress}
          />
        </AppCard>

        <AppCard colors={colors} isDark={isDark} style={{ marginBottom: spacing.lg }}>
          <Text style={[typography.subtitle, { color: colors.text, marginBottom: spacing.md }]}>
            Learning
          </Text>
          <View style={{ gap: spacing.sm }}>
            <SettingsRow
              icon="flag-outline"
              label="Daily Goal"
              value={`${dailyGoal} cards`}
              colors={colors}
              isDark={isDark}
              onPress={handleDailyGoalPress}
            />
            <SettingsRow
              icon="refresh-outline"
              label="Reset Progress"
              colors={colors}
              isDark={isDark}
              onPress={handleResetProgress}
              destructive
            />
          </View>
        </AppCard>

        <AppCard colors={colors} isDark={isDark}>
          <Text style={[typography.subtitle, { color: colors.text, marginBottom: spacing.md }]}>
            App
          </Text>
          <View style={{ gap: spacing.sm }}>
            <SettingsRow
              icon="information-circle-outline"
              label="About App"
              colors={colors}
              isDark={isDark}
              onPress={handleAboutPress}
            />
            <SettingsRow
              icon="code-slash-outline"
              label="Version"
              value={APP_VERSION}
              colors={colors}
              isDark={isDark}
              showChevron={false}
            />
          </View>
        </AppCard>
      </ScrollView>
    </ScreenContainer>
  );
}
