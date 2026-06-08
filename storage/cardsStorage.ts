import AsyncStorage from '@react-native-async-storage/async-storage';

import type { Card } from '../types/card';

const STORAGE_KEY = 'FLASHCARDS_STORAGE';

export async function saveCards(cards: Card[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
}

export async function loadCards(): Promise<Card[] | null> {
  const data = await AsyncStorage.getItem(STORAGE_KEY);

  if (!data) {
    return null;
  }

  return JSON.parse(data) as Card[];
}
