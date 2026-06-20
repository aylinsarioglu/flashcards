import Constants from 'expo-constants';
import { useState } from 'react';
import {
  Alert,
  Linking,
  Modal,
  Pressable,
  ScrollView,
  Share,
  Text,
  TextInput,
  View,
  type AlertButton,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import AppButton from '../../components/AppButton';
import AppCard from '../../components/AppCard';
import ScreenContainer from '../../components/ScreenContainer';
import {
  getShadow,
  radius,
  spacing,
  typography,
  type ThemeColors,
} from '../../constants/theme';
import { parseAppBackup, serializeAppBackup } from '../../storage/backupStorage';
import { useCards } from '../../storage/CardsContext';
import { getThemeModeLabel, useTheme, type ThemeMode } from '../../storage/ThemeContext';

const APP_VERSION =
  Constants.expoConfig?.version ?? Constants.manifest?.version ?? '1.0.0';

const CONTACT_EMAIL = 'hello@flashcards.app';

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
        <Text style={{ fontSize: 20 }}>{emoji}</Text>
        <Ionicons
          name={icon}
          size={20}
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
  const { dailyGoal, setDailyGoal, resetProgress, exportBackupData, restoreBackupData } =
    useCards();
  const [importVisible, setImportVisible] = useState(false);
  const [importText, setImportText] = useState('');

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

    Alert.alert('Daily Goal', 'How many cards do you want to review each day?', buttons);
  }

  function handleBackupPress() {
    Alert.alert('Backup', 'Export or restore your flashcards and progress.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Export',
        onPress: async () => {
          try {
            const backup = exportBackupData();
            const message = serializeAppBackup(backup);

            await Share.share({
              title: 'Flashcards Backup',
              message,
            });
          } catch {
            Alert.alert('Export failed', 'Could not create backup. Please try again.');
          }
        },
      },
      {
        text: 'Import',
        onPress: () => {
          setImportText('');
          setImportVisible(true);
        },
      },
    ]);
  }

  async function handleImportBackup() {
    try {
      const backup = parseAppBackup(importText.trim());
      await restoreBackupData(backup);
      setImportVisible(false);
      setImportText('');
      Alert.alert('Backup restored', 'Your data was imported successfully.');
    } catch {
      Alert.alert('Import failed', 'Invalid backup data. Check the JSON and try again.');
    }
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

  function handleContactPress() {
    const mailUrl = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('Flashcards App Feedback')}`;

    Linking.openURL(mailUrl).catch(() => {
      Alert.alert('Contact', `Email us at ${CONTACT_EMAIL}`);
    });
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

        <AppCard style={{ marginBottom: spacing.lg }}>
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
        </AppCard>

        <AppCard style={{ marginBottom: spacing.lg }}>
          <View style={{ gap: spacing.sm }}>
            <SettingsRow
              emoji="📦"
              icon="cloud-upload-outline"
              label="Backup"
              value="Export / Import"
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
        </AppCard>

        <AppCard>
          <View style={{ gap: spacing.sm }}>
            <SettingsRow
              emoji="📱"
              icon="phone-portrait-outline"
              label="Version"
              value={APP_VERSION}
              colors={colors}
              isDark={isDark}
              showChevron={false}
            />
            <SettingsRow
              emoji="📧"
              icon="mail-outline"
              label="Contact"
              value={CONTACT_EMAIL}
              colors={colors}
              isDark={isDark}
              onPress={handleContactPress}
            />
          </View>
        </AppCard>
      </ScrollView>

      <Modal
        visible={importVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setImportVisible(false)}>
        <View
          style={{
            flex: 1,
            justifyContent: 'flex-end',
            backgroundColor: 'rgba(0,0,0,0.45)',
          }}>
          <View
            style={{
              backgroundColor: colors.card,
              borderTopLeftRadius: radius.xl,
              borderTopRightRadius: radius.xl,
              padding: spacing.lg,
              paddingBottom: spacing.xxl,
              borderWidth: 1,
              borderColor: colors.border,
            }}>
            <Text style={[typography.title, { color: colors.text, marginBottom: spacing.sm }]}>
              Import Backup
            </Text>
            <Text style={[typography.body, { color: colors.muted, marginBottom: spacing.md }]}>
              Paste your backup JSON below.
            </Text>
            <TextInput
              value={importText}
              onChangeText={setImportText}
              multiline
              placeholder="Paste backup JSON..."
              placeholderTextColor={colors.muted}
              style={{
                minHeight: 160,
                borderWidth: 1.5,
                borderColor: colors.border,
                borderRadius: radius.lg,
                padding: spacing.md,
                backgroundColor: colors.surfaceElevated,
                color: colors.text,
                textAlignVertical: 'top',
                marginBottom: spacing.lg,
              }}
            />
            <AppButton title="Restore Backup" onPress={handleImportBackup} />
            <View style={{ marginTop: spacing.sm }}>
              <AppButton
                title="Cancel"
                variant="outline"
                onPress={() => setImportVisible(false)}
              />
            </View>
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
}
