export type Card = {
  id: string;
  front: string;
  back: string;
  example?: string;
  exampleTranslation?: string;
  category: string;
  deck: string;
  learned: boolean;
  favorite?: boolean;
};
