import type { Card } from '../types/card';

import { dailyEnglishCards } from './dailyEnglish';
import { phrasalVerbsCards } from './phrasalVerbs';
import { travelEnglishCards } from './travelEnglish';

export const starterDecks = {
  'Daily English': dailyEnglishCards,
  'Travel English': travelEnglishCards,
  'Phrasal Verbs': phrasalVerbsCards,
} as const satisfies Record<string, Card[]>;

export type StarterDeckName = keyof typeof starterDecks;

export const STARTER_DECK_NAMES = Object.keys(starterDecks) as StarterDeckName[];

export function isStarterDeck(name: string): name is StarterDeckName {
  return name in starterDecks;
}

export const starterLibrary: Card[] = [
  ...dailyEnglishCards,
  ...travelEnglishCards,
  ...phrasalVerbsCards,
];

export { dailyEnglishCards, travelEnglishCards, phrasalVerbsCards };
