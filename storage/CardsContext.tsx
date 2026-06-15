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
import { loadCards, saveCards } from './cardsStorage';

const DAILY_PROGRESS_KEY = 'FLASHCARDS_DAILY_PROGRESS';
const STREAK_KEY = 'FLASHCARDS_STREAK';
const ACHIEVEMENTS_KEY = 'FLASHCARDS_ACHIEVEMENTS';
const DAILY_GOAL = 10;

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
  currentStreak: number;
  achievements: Achievements;
  incrementCardsReviewedToday: () => void;
  completeStudySession: () => void;
};

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
  const [isProgressLoaded, setIsProgressLoaded] = useState(false);
  const [isStreakLoaded, setIsStreakLoaded] = useState(false);
  const [isAchievementsLoaded, setIsAchievementsLoaded] = useState(false);
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

  return (
    <CardsContext.Provider
      value={{
        cards,
        setCards,
        dailyProgress,
        dailyGoal: DAILY_GOAL,
        currentStreak,
        achievements,
        incrementCardsReviewedToday,
        completeStudySession,
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
