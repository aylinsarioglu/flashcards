import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

import { starterCards } from '../data/starterCards';
import type { Card } from '../types/card';
import { loadCards, saveCards } from './cardsStorage';

type CardsContextValue = {
  cards: Card[];
  setCards: React.Dispatch<React.SetStateAction<Card[]>>;
};

const CardsContext = createContext<CardsContextValue | null>(null);

type CardsProviderProps = {
  children: ReactNode;
};

export function CardsProvider({ children }: CardsProviderProps) {
  const [cards, setCards] = useState<Card[]>(starterCards);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    loadCards().then((stored) => {
      setCards(stored ?? starterCards);
      setIsLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    saveCards(cards);
  }, [cards, isLoaded]);

  return (
    <CardsContext.Provider value={{ cards, setCards }}>
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
