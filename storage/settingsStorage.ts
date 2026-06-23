import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemeMode = 'light' | 'dark' | 'system';

export const SETTINGS_KEYS = {
  theme: 'FLASHCARDS_THEME',
  dailyGoal: 'FLASHCARDS_DAILY_GOAL',
} as const;

export const DEFAULT_DAILY_GOAL = 10;

export function isThemeMode(value: string | null): value is ThemeMode {
  return value === 'light' || value === 'dark' || value === 'system';
}

export async function loadThemeMode(): Promise<ThemeMode> {
  const stored = await AsyncStorage.getItem(SETTINGS_KEYS.theme);

  if (isThemeMode(stored)) {
    return stored;
  }

  if (stored === 'dark') {
    return 'dark';
  }

  if (stored === 'light') {
    return 'light';
  }

  return 'system';
}

export async function saveThemeMode(mode: ThemeMode): Promise<void> {
  await AsyncStorage.setItem(SETTINGS_KEYS.theme, mode);
}

export async function loadDailyGoal(): Promise<number> {
  const data = await AsyncStorage.getItem(SETTINGS_KEYS.dailyGoal);

  if (!data) {
    return DEFAULT_DAILY_GOAL;
  }

  const parsed = Number.parseInt(data, 10);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return DEFAULT_DAILY_GOAL;
  }

  return parsed;
}

export async function saveDailyGoal(goal: number): Promise<void> {
  await AsyncStorage.setItem(SETTINGS_KEYS.dailyGoal, String(goal));
}
