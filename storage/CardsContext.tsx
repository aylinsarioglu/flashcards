import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';

import { starterCards } from '../data/starterCards';
import type { Card } from '../types/card';
import {
  ACHIEVEMENT_DEFINITIONS,
  type Achievements,
  DEFAULT_ACHIEVEMENTS,
} from '../types/achievements';
import {
  computeAchievements,
  hasAchievementChanges,
} from './achievementsStorage';
import {
  clearContinueLearningStorage,
  loadContinueLearning,
  saveContinueLearning as persistContinueLearning,
  type ContinueLearningState,
} from './continueLearningStorage';
import { loadCards, saveCards } from './cardsStorage';
import type { AppBackup } from './backupStorage';
import {
  DEFAULT_STUDY_STATS,
  addStudyTime,
  clearStudyStatsStorage,
  getAccuracyPercent,
  loadStudyStats,
  recordAgainReview,
  recordGoodReview,
  recordStudySessionComplete,
  saveStudyStats,
  type StudyStats,
} from './studyStatsStorage';

const DAILY_PROGRESS_KEY = 'FLASHCARDS_DAILY_PROGRESS';
const STREAK_KEY = 'FLASHCARDS_STREAK';
const ACHIEVEMENTS_KEY = 'FLASHCARDS_ACHIEVEMENTS';
import {
  DEFAULT_DAILY_GOAL,
  loadDailyGoal,
  saveDailyGoal,
} from './settingsStorage';

export type { Achievements };
export { ACHIEVEMENT_DEFINITIONS };

export type DailyProgress = {
  cardsReviewedToday: number;
};

type StoredDailyProgress = {
  date: string;
  cardsReviewedToday: number;
};

type StoredStreak = {
  currentStreak: number;
  lastStudyDate: string | null;
};

type CardsContextValue = {
  cards: Card[];
  setCards: React.Dispatch<React.SetStateAction<Card[]>>;
  dailyProgress: DailyProgress;
  dailyGoal: number;
  setDailyGoal: (goal: number) => void;
  currentStreak: number;
  achievements: Achievements;
  continueLearning: ContinueLearningState | null;
  isContinueLearningLoaded: boolean;
  saveContinueLearning: (deck: string, cardIndex: number) => void;
  clearContinueLearning: () => void;
  incrementCardsReviewedToday: () => void;
  completeStudySession: () => void;
  resetProgress: () => void;
  exportBackupData: () => AppBackup;
  restoreBackupData: (backup: AppBackup) => Promise<void>;
  studyStats: StudyStats;
  isStudyStatsLoaded: boolean;
  recordGoodReview: () => void;
  recordAgainReview: () => void;
  addStudySessionTime: (minutes: number) => void;
  recordStudySessionComplete: () => void;
  getStudyAccuracy: () => number | null;
};

export type { ContinueLearningState };

const CardsContext = createContext<CardsContextValue | null>(null);

type CardsProviderProps = {
  children: ReactNode;
};

function getTodayKey() {
  return new Date().toISOString().slice(0, 10);
}

function getYesterdayKey() {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  return date.toISOString().slice(0, 10);
}

function normalizeDailyProgress(
  stored: StoredDailyProgress | null,
): DailyProgress {
  const today = getTodayKey();

  if (!stored || stored.date !== today) {
    return { cardsReviewedToday: 0 };
  }

  return { cardsReviewedToday: stored.cardsReviewedToday };
}

function normalizeStreak(stored: StoredStreak | null): StoredStreak {
  const today = getTodayKey();
  const yesterday = getYesterdayKey();

  if (!stored || !stored.lastStudyDate) {
    return { currentStreak: 0, lastStudyDate: null };
  }

  if (
    stored.lastStudyDate === today ||
    stored.lastStudyDate === yesterday
  ) {
    return stored;
  }

  return { currentStreak: 0, lastStudyDate: stored.lastStudyDate };
}

export function CardsProvider({ children }: CardsProviderProps) {
  const [cards, setCards] = useState<Card[]>(starterCards);
  const [isLoaded, setIsLoaded] = useState(false);
  const [dailyProgress, setDailyProgress] = useState<DailyProgress>({
    cardsReviewedToday: 0,
  });
  const [currentStreak, setCurrentStreak] = useState(0);
  const [achievements, setAchievements] = useState<Achievements>(
    DEFAULT_ACHIEVEMENTS,
  );
  const [dailyGoal, setDailyGoalState] = useState(DEFAULT_DAILY_GOAL);
  const [continueLearning, setContinueLearning] =
    useState<ContinueLearningState | null>(null);
  const [isProgressLoaded, setIsProgressLoaded] = useState(false);
  const [isStreakLoaded, setIsStreakLoaded] = useState(false);
  const [isAchievementsLoaded, setIsAchievementsLoaded] = useState(false);
  const [isDailyGoalLoaded, setIsDailyGoalLoaded] = useState(false);
  const [isContinueLearningLoaded, setIsContinueLearningLoaded] =
    useState(false);
  const [studyStats, setStudyStats] = useState<StudyStats>(DEFAULT_STUDY_STATS);
  const [isStudyStatsLoaded, setIsStudyStatsLoaded] = useState(false);
  const progressDateRef = useRef(getTodayKey());
  const streakStateRef = useRef<StoredStreak>({
    currentStreak: 0,
    lastStudyDate: null,
  });
  const initialCardCountRef = useRef<number | null>(null);

  useEffect(() => {
    loadCards().then((stored) => {
      setCards(stored ?? starterCards);
      setIsLoaded(true);
    });
  }, []);

  useEffect(() => {
    AsyncStorage.getItem(DAILY_PROGRESS_KEY).then((data) => {
      const stored = data
        ? (JSON.parse(data) as StoredDailyProgress)
        : null;
      const normalized = normalizeDailyProgress(stored);

      progressDateRef.current = getTodayKey();
      setDailyProgress(normalized);
      setIsProgressLoaded(true);
    });
  }, []);

  useEffect(() => {
    AsyncStorage.getItem(STREAK_KEY).then((data) => {
      const stored = data ? (JSON.parse(data) as StoredStreak) : null;
      const normalized = normalizeStreak(stored);

      streakStateRef.current = normalized;
      setCurrentStreak(normalized.currentStreak);
      setIsStreakLoaded(true);
    });
  }, []);

  useEffect(() => {
    AsyncStorage.getItem(ACHIEVEMENTS_KEY).then((data) => {
      const stored = data ? (JSON.parse(data) as Achievements) : null;

      setAchievements({
        ...DEFAULT_ACHIEVEMENTS,
        ...stored,
      });
      setIsAchievementsLoaded(true);
    });
  }, []);

  useEffect(() => {
    loadDailyGoal().then((goal) => {
      setDailyGoalState(goal);
      setIsDailyGoalLoaded(true);
    });
  }, []);

  useEffect(() => {
    loadContinueLearning().then((stored) => {
      setContinueLearning(stored);
      setIsContinueLearningLoaded(true);
    });
  }, []);

  useEffect(() => {
    loadStudyStats().then((stored) => {
      setStudyStats(stored);
      setIsStudyStatsLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (!isStudyStatsLoaded) {
      return;
    }

    saveStudyStats(studyStats);
  }, [studyStats, isStudyStatsLoaded]);

  useEffect(() => {
    if (!isLoaded || initialCardCountRef.current !== null) {
      return;
    }

    initialCardCountRef.current = cards.length;
  }, [isLoaded, cards.length]);

  useEffect(() => {
    if (!isLoaded || !isAchievementsLoaded || initialCardCountRef.current === null) {
      return;
    }

    setAchievements((current) => {
      const next = computeAchievements(
        cards,
        current,
        initialCardCountRef.current ?? cards.length,
      );

      return hasAchievementChanges(current, next) ? next : current;
    });
  }, [cards, isLoaded, isAchievementsLoaded]);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    saveCards(cards);
  }, [cards, isLoaded]);

  useEffect(() => {
    if (!isProgressLoaded) {
      return;
    }

    const today = getTodayKey();
    progressDateRef.current = today;

    const toSave: StoredDailyProgress = {
      date: today,
      cardsReviewedToday: dailyProgress.cardsReviewedToday,
    };

    AsyncStorage.setItem(DAILY_PROGRESS_KEY, JSON.stringify(toSave));
  }, [dailyProgress, isProgressLoaded]);

  useEffect(() => {
    if (!isStreakLoaded) {
      return;
    }

    AsyncStorage.setItem(STREAK_KEY, JSON.stringify(streakStateRef.current));
  }, [currentStreak, isStreakLoaded]);

  useEffect(() => {
    if (!isAchievementsLoaded) {
      return;
    }

    AsyncStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(achievements));
  }, [achievements, isAchievementsLoaded]);

  useEffect(() => {
    if (!isDailyGoalLoaded) {
      return;
    }

    void saveDailyGoal(dailyGoal);
  }, [dailyGoal, isDailyGoalLoaded]);

  useEffect(() => {
    if (!isContinueLearningLoaded) {
      return;
    }

    if (continueLearning) {
      persistContinueLearning(continueLearning);
      return;
    }

    clearContinueLearningStorage();
  }, [continueLearning, isContinueLearningLoaded]);

  function setDailyGoal(goal: number) {
    const clamped = Math.max(1, Math.min(100, Math.round(goal)));
    setDailyGoalState(clamped);
  }

  function completeStudySession() {
    const today = getTodayKey();

    if (streakStateRef.current.lastStudyDate === today) {
      return;
    }

    const yesterday = getYesterdayKey();
    const nextStreak =
      streakStateRef.current.lastStudyDate === yesterday
        ? streakStateRef.current.currentStreak + 1
        : 1;

    streakStateRef.current = {
      currentStreak: nextStreak,
      lastStudyDate: today,
    };

    setCurrentStreak(nextStreak);
  }

  function incrementCardsReviewedToday() {
    const today = getTodayKey();

    setDailyProgress((prev) => {
      const currentCount =
        progressDateRef.current === today ? prev.cardsReviewedToday : 0;

      progressDateRef.current = today;

      return {
        cardsReviewedToday: currentCount + 1,
      };
    });
  }

  function saveContinueLearning(deck: string, cardIndex: number) {
    setContinueLearning({
      deck,
      cardIndex: Math.max(0, Math.round(cardIndex)),
    });
  }

  function clearContinueLearning() {
    setContinueLearning(null);
  }

  function resetProgress() {
    const today = getTodayKey();

    progressDateRef.current = today;
    setDailyProgress({ cardsReviewedToday: 0 });

    streakStateRef.current = { currentStreak: 0, lastStudyDate: null };
    setCurrentStreak(0);

    setAchievements(DEFAULT_ACHIEVEMENTS);
    initialCardCountRef.current = cards.length;
    setContinueLearning(null);

    setCards((current) =>
      current.map((card) => ({ ...card, learned: false })),
    );

    setStudyStats(DEFAULT_STUDY_STATS);
    void clearStudyStatsStorage();
  }

  function recordGoodReviewRating() {
    setStudyStats((current) => recordGoodReview(current));
  }

  function recordAgainReviewRating() {
    setStudyStats((current) => recordAgainReview(current));
  }

  function addStudySessionTime(minutes: number) {
    setStudyStats((current) => addStudyTime(current, minutes));
  }

  function recordStudySessionCompleteRating() {
    setStudyStats((current) => recordStudySessionComplete(current));
  }

  function getStudyAccuracy() {
    return getAccuracyPercent(studyStats);
  }

  function exportBackupData(): AppBackup {
    return {
      version: 1,
      exportedAt: new Date().toISOString(),
      cards,
      dailyGoal,
      dailyProgress: {
        date: progressDateRef.current,
        cardsReviewedToday: dailyProgress.cardsReviewedToday,
      },
      streak: { ...streakStateRef.current },
      achievements,
      continueLearning,
    };
  }

  async function restoreBackupData(backup: AppBackup) {
    progressDateRef.current = backup.dailyProgress.date;
    setDailyProgress({
      cardsReviewedToday: backup.dailyProgress.cardsReviewedToday,
    });
    await AsyncStorage.setItem(
      DAILY_PROGRESS_KEY,
      JSON.stringify(backup.dailyProgress),
    );

    streakStateRef.current = { ...backup.streak };
    setCurrentStreak(backup.streak.currentStreak);
    await AsyncStorage.setItem(STREAK_KEY, JSON.stringify(backup.streak));

    setAchievements({ ...DEFAULT_ACHIEVEMENTS, ...backup.achievements });
    await AsyncStorage.setItem(
      ACHIEVEMENTS_KEY,
      JSON.stringify(backup.achievements),
    );

    setDailyGoalState(backup.dailyGoal);
    await saveDailyGoal(backup.dailyGoal);

    setCards(backup.cards);
    await saveCards(backup.cards);
    initialCardCountRef.current = backup.cards.length;

    setContinueLearning(backup.continueLearning);
    if (backup.continueLearning) {
      await persistContinueLearning(backup.continueLearning);
    } else {
      await clearContinueLearningStorage();
    }
  }

  return (
    <CardsContext.Provider
      value={{
        cards,
        setCards,
        dailyProgress,
        dailyGoal,
        setDailyGoal,
        currentStreak,
        achievements,
        continueLearning,
        isContinueLearningLoaded,
        saveContinueLearning,
        clearContinueLearning,
        incrementCardsReviewedToday,
        completeStudySession,
        resetProgress,
        exportBackupData,
        restoreBackupData,
        studyStats,
        isStudyStatsLoaded,
        recordGoodReview: recordGoodReviewRating,
        recordAgainReview: recordAgainReviewRating,
        addStudySessionTime,
        recordStudySessionComplete: recordStudySessionCompleteRating,
        getStudyAccuracy,
      }}>
      {children}
    </CardsContext.Provider>
  );
}

export function useCards() {
  const context = useContext(CardsContext);

  if (!context) {
    throw new Error('useCards must be used within a CardsProvider');
  }

  return context;
}

export { CardsContext };
