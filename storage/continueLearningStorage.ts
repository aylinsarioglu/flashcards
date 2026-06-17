import AsyncStorage from '@react-native-async-storage/async-storage';

export const CONTINUE_LEARNING_KEY = 'FLASHCARDS_CONTINUE_LEARNING';

export type ContinueLearningState = {
  deck: string;
  cardIndex: number;
};

export async function loadContinueLearning(): Promise<ContinueLearningState | null> {
  const data = await AsyncStorage.getItem(CONTINUE_LEARNING_KEY);

  if (!data) {
    return null;
  }

  try {
    const parsed = JSON.parse(data) as ContinueLearningState;

    if (
      typeof parsed.deck === 'string' &&
      parsed.deck.length > 0 &&
      typeof parsed.cardIndex === 'number' &&
      parsed.cardIndex >= 0
    ) {
      return parsed;
    }
  } catch {
    return null;
  }

  return null;
}

export async function saveContinueLearning(
  state: ContinueLearningState,
): Promise<void> {
  await AsyncStorage.setItem(CONTINUE_LEARNING_KEY, JSON.stringify(state));
}

export async function clearContinueLearningStorage(): Promise<void> {
  await AsyncStorage.removeItem(CONTINUE_LEARNING_KEY);
}
