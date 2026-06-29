import AsyncStorage from '@react-native-async-storage/async-storage';

export const ONBOARDING_KEY = 'FLASHCARDS_ONBOARDING_COMPLETE';

export async function loadOnboardingComplete(): Promise<boolean> {
  const stored = await AsyncStorage.getItem(ONBOARDING_KEY);
  return stored === 'true';
}

export async function saveOnboardingComplete(): Promise<void> {
  await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
}
