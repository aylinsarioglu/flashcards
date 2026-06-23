import AsyncStorage from '@react-native-async-storage/async-storage';

export const STUDY_STATS_KEY = 'FLASHCARDS_STUDY_STATS';

export type ReviewHistoryEntry = {
  date: string;
  reviewed: number;
  good: number;
  again: number;
};

export type StudyStats = {
  totalGood: number;
  totalAgain: number;
  studyTimeMinutes: number;
  totalSessions: number;
  history: ReviewHistoryEntry[];
};

export const DEFAULT_STUDY_STATS: StudyStats = {
  totalGood: 0,
  totalAgain: 0,
  studyTimeMinutes: 0,
  totalSessions: 0,
  history: [],
};

function getTodayKey() {
  return new Date().toISOString().slice(0, 10);
}

export async function loadStudyStats(): Promise<StudyStats> {
  const data = await AsyncStorage.getItem(STUDY_STATS_KEY);

  if (!data) {
    return { ...DEFAULT_STUDY_STATS, history: [] };
  }

  try {
    const parsed = JSON.parse(data) as StudyStats;

    return {
      totalGood: parsed.totalGood ?? 0,
      totalAgain: parsed.totalAgain ?? 0,
      studyTimeMinutes: parsed.studyTimeMinutes ?? 0,
      totalSessions: parsed.totalSessions ?? 0,
      history: Array.isArray(parsed.history) ? parsed.history : [],
    };
  } catch {
    return { ...DEFAULT_STUDY_STATS, history: [] };
  }
}

export async function saveStudyStats(stats: StudyStats): Promise<void> {
  await AsyncStorage.setItem(STUDY_STATS_KEY, JSON.stringify(stats));
}

function upsertTodayEntry(
  history: ReviewHistoryEntry[],
  update: (entry: ReviewHistoryEntry) => ReviewHistoryEntry,
): ReviewHistoryEntry[] {
  const today = getTodayKey();
  const index = history.findIndex((entry) => entry.date === today);

  if (index === -1) {
    return [
      update({ date: today, reviewed: 0, good: 0, again: 0 }),
      ...history,
    ].slice(0, 14);
  }

  const next = [...history];
  next[index] = update(next[index]);
  return next;
}

export function recordGoodReview(stats: StudyStats): StudyStats {
  return {
    ...stats,
    totalGood: stats.totalGood + 1,
    history: upsertTodayEntry(stats.history, (entry) => ({
      ...entry,
      reviewed: entry.reviewed + 1,
      good: entry.good + 1,
    })),
  };
}

export function recordAgainReview(stats: StudyStats): StudyStats {
  return {
    ...stats,
    totalAgain: stats.totalAgain + 1,
    history: upsertTodayEntry(stats.history, (entry) => ({
      ...entry,
      reviewed: entry.reviewed + 1,
      again: entry.again + 1,
    })),
  };
}

export function addStudyTime(stats: StudyStats, minutes: number): StudyStats {
  return {
    ...stats,
    studyTimeMinutes: stats.studyTimeMinutes + Math.max(0, Math.round(minutes)),
  };
}

export function recordStudySessionComplete(stats: StudyStats): StudyStats {
  return {
    ...stats,
    totalSessions: stats.totalSessions + 1,
  };
}

export type WeeklyProgressDay = {
  date: string;
  label: string;
  reviewed: number;
};

export function getWeeklyProgress(history: ReviewHistoryEntry[]): WeeklyProgressDay[] {
  const days: WeeklyProgressDay[] = [];
  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  for (let offset = 6; offset >= 0; offset -= 1) {
    const date = new Date();
    date.setDate(date.getDate() - offset);
    const dateKey = date.toISOString().slice(0, 10);
    const entry = history.find((item) => item.date === dateKey);

    days.push({
      date: dateKey,
      label: dayLabels[date.getDay()],
      reviewed: entry?.reviewed ?? 0,
    });
  }

  return days;
}

export function getAccuracyPercent(stats: StudyStats): number | null {
  const total = stats.totalGood + stats.totalAgain;

  if (total === 0) {
    return null;
  }

  return Math.round((stats.totalGood / total) * 100);
}

export async function clearStudyStatsStorage(): Promise<void> {
  await AsyncStorage.removeItem(STUDY_STATS_KEY);
}
