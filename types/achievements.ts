export type AchievementId =
  | 'firstCardAdded'
  | 'tenCardsLearned'
  | 'firstDeckCompleted';

export type Achievements = Record<AchievementId, boolean>;

export type AchievementDefinition = {
  id: AchievementId;
  title: string;
};

export const ACHIEVEMENT_DEFINITIONS: AchievementDefinition[] = [
  { id: 'firstCardAdded', title: 'First Card Added' },
  { id: 'tenCardsLearned', title: '10 Cards Learned' },
  { id: 'firstDeckCompleted', title: 'First Deck Completed' },
];

export const DEFAULT_ACHIEVEMENTS: Achievements = {
  firstCardAdded: false,
  tenCardsLearned: false,
  firstDeckCompleted: false,
};
