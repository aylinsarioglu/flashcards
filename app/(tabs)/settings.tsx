import Constants from 'expo-constants';
import {
  Alert,
  ScrollView,
  Text,
  View,
  type AlertButton,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import AppCard from '../../components/AppCard';
import ScreenContainer from '../../components/ScreenContainer';
import { FadeInView, motion, PressableScale } from '../../components/animations';
import { spacing as dsSpacing } from '../../constants/spacing';
import { typography as dsTypography } from '../../constants/typography';
import {
  getShadow,
  layout,
  radius,
  spacing,
  type ThemeColors,
} from '../../constants/theme';
import { useCards } from '../../storage/CardsContext';
import {
  getThemeModeLabel,
  useTheme,
  type ThemeMode,
} from '../../storage/ThemeContext';

const APP_VERSION =
  Constants.expoConfig?.version ?? Constants.manifest?.version ?? '1.0.0';

const DAILY_GOAL_OPTIONS = [5, 10, 15, 20, 30];

type SettingsRowProps = {
  emoji: string;
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
  emoji,
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
    <PressableScale
      onPress={onPress}
      disabled={!onPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.md,
        borderRadius: radius.lg,
        backgroundColor: colors.surface,
        ...getShadow('soft', isDark),
      }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing.md,
          flex: 1,
        }}>
        <Text style={{ fontSize: 20 }}>{emoji}</Text>
        <Ionicons
          name={icon}
          size={20}
          color={destructive ? colors.danger : colors.primary}
        />
        <Text
          style={[
            dsTypography.subtitle,
            { color: textColor, flex: 1, fontWeight: '600' },
          ]}>
          {label}
        </Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing.sm,
        }}>
        {value ? (
          <Text style={[dsTypography.body, { color: colors.muted, fontSize: 15 }]}>
            {value}
          </Text>
        ) : null}
        {showChevron && onPress ? (
          <Ionicons name="chevron-forward" size={20} color={colors.muted} />
        ) : null}
      </View>
    </PressableScale>
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
      'Dark Mode',
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

    Alert.alert(
      'Daily Goal',
      'How many cards do you want to review each day?',
      buttons,
    );
  }

  function handleBackupPress() {
    Alert.alert(
      'Backup Data',
      'Export and import your cards and progress will be available in a future update.',
    );
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
      'About',
      `Flashcards helps you learn vocabulary and collocations with a simple, focused study flow.\n\nBuilt with Expo.`,
    );
  }

  return (
    <ScreenContainer style={{ paddingHorizontal: layout.contentPadding }}>
      <ScrollView
        contentContainerStyle={{
          paddingTop: dsSpacing[24],
          paddingBottom: dsSpacing[40],
        }}
        showsVerticalScrollIndicator={false}>
        <Text
          style={[
            dsTypography.heading,
            { color: colors.text, fontSize: 32, marginBottom: dsSpacing[8] },
          ]}>
          Settings
        </Text>
        <Text
          style={[
            dsTypography.body,
            { color: colors.muted, marginBottom: dsSpacing[24] },
          ]}>
          Customize your learning experience.
        </Text>

        <AppCard style={{ marginBottom: spacing.lg }}>
          <FadeInView delay={0}>
            <View style={{ gap: spacing.sm }}>
              <SettingsRow
                emoji="🌙"
                icon={isDark ? 'moon' : 'sunny'}
                label="Dark Mode"
                value={getThemeModeLabel(themeMode)}
                colors={colors}
                isDark={isDark}
                onPress={handleThemePress}
              />
              <SettingsRow
                emoji="🎯"
                icon="flag-outline"
                label="Daily Goal"
                value={`${dailyGoal} cards`}
                colors={colors}
                isDark={isDark}
                onPress={handleDailyGoalPress}
              />
            </View>
          </FadeInView>
        </AppCard>

        <AppCard style={{ marginBottom: spacing.lg }}>
          <FadeInView delay={motion.stagger}>
            <View style={{ gap: spacing.sm }}>
              <SettingsRow
                emoji="📦"
                icon="cloud-upload-outline"
                label="Backup Data"
                value="Coming soon"
                colors={colors}
                isDark={isDark}
                onPress={handleBackupPress}
              />
              <SettingsRow
                emoji="♻"
                icon="refresh-outline"
                label="Reset Progress"
                colors={colors}
                isDark={isDark}
                onPress={handleResetProgress}
                destructive
              />
            </View>
          </FadeInView>
        </AppCard>

        <AppCard>
          <FadeInView delay={motion.stagger * 2}>
            <View style={{ gap: spacing.sm }}>
              <SettingsRow
                emoji="ℹ️"
                icon="information-circle-outline"
                label="About"
                colors={colors}
                isDark={isDark}
                onPress={handleAboutPress}
              />
              <SettingsRow
                emoji="📱"
                icon="phone-portrait-outline"
                label="Version"
                value={APP_VERSION}
                colors={colors}
                isDark={isDark}
                showChevron={false}
              />
            </View>
          </FadeInView>
        </AppCard>
      </ScrollView>
    </ScreenContainer>
  );
}
