import type { Card } from '../types/card';
import type { Achievements } from '../types/achievements';
import type { ContinueLearningState } from './continueLearningStorage';

export const BACKUP_FORMAT_VERSION = 1;

export type AppBackup = {
  version: typeof BACKUP_FORMAT_VERSION;
  exportedAt: string;
  cards: Card[];
  dailyGoal: number;
  dailyProgress: {
    date: string;
    cardsReviewedToday: number;
  };
  streak: {
    currentStreak: number;
    lastStudyDate: string | null;
  };
  achievements: Achievements;
  continueLearning: ContinueLearningState | null;
};

export function parseAppBackup(raw: string): AppBackup {
  const parsed = JSON.parse(raw) as AppBackup;

  if (parsed.version !== BACKUP_FORMAT_VERSION || !Array.isArray(parsed.cards)) {
    throw new Error('Invalid backup file.');
  }

  return parsed;
}

export function serializeAppBackup(backup: AppBackup): string {
  return JSON.stringify(backup, null, 2);
}
