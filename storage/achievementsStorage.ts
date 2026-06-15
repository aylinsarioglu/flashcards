import type { Card } from '../types/card';
import {
  type Achievements,
  DEFAULT_ACHIEVEMENTS,
} from '../types/achievements';

export function computeAchievements(
  cards: Card[],
  current: Achievements,
  initialCardCount: number,
): Achievements {
  const learnedCount = cards.filter((card) => card.learned).length;

  const deckGroups = cards.reduce<Record<string, { total: number; learned: number }>>(
    (groups, card) => {
      if (!groups[card.deck]) {
        groups[card.deck] = { total: 0, learned: 0 };
      }

      groups[card.deck].total += 1;

      if (card.learned) {
        groups[card.deck].learned += 1;
      }

      return groups;
    },
    {},
  );

  const hasCompletedDeck = Object.values(deckGroups).some(
    (deck) => deck.total > 0 && deck.learned === deck.total,
  );

  return {
    firstCardAdded:
      current.firstCardAdded || cards.length > initialCardCount,
    tenCardsLearned: current.tenCardsLearned || learnedCount >= 10,
    firstDeckCompleted:
      current.firstDeckCompleted || hasCompletedDeck,
  };
}

export function hasAchievementChanges(
  previous: Achievements,
  next: Achievements,
): boolean {
  return (
    previous.firstCardAdded !== next.firstCardAdded ||
    previous.tenCardsLearned !== next.tenCardsLearned ||
    previous.firstDeckCompleted !== next.firstDeckCompleted
  );
}

export { DEFAULT_ACHIEVEMENTS };
