import { useStore } from "zustand";
import { createStore } from "zustand/vanilla";

import { filter } from "lodash-es";

import english10 from "../../node_modules/wordlist-english/english-words-10.json";
import english20 from "../../node_modules/wordlist-english/english-words-20.json";
import english35 from "../../node_modules/wordlist-english/english-words-35.json";
import english40 from "../../node_modules/wordlist-english/english-words-40.json";
import english50 from "../../node_modules/wordlist-english/english-words-50.json";
import english55 from "../../node_modules/wordlist-english/english-words-55.json";
import english60 from "../../node_modules/wordlist-english/english-words-70.json";
import english70 from "../../node_modules/wordlist-english/english-words-70.json";

export enum Difficulty {
  easy = "easy",
  medium = "medium",
  hard = "hard",
}

const difficulties = {
  [Difficulty.easy]: [...english10, ...english20],
  [Difficulty.medium]: [...english20, ...english35],
  [Difficulty.hard]: [...english35, ...english40],
};

const allWords = [
  ...english10,
  ...english20,
  ...english35,
  ...english40,
  ...english50,
  ...english55,
  ...english60,
  ...english70,
];

interface WordState {
  checkWordExists: (word: string) => boolean;
  generateWord: (wordLength: number, difficulty?: Difficulty) => string;
}

const useWordStore = createStore<WordState>()((set, get) => ({
  checkWordExists: (word: string) => {
    return allWords.indexOf(word.toLowerCase()) > -1;
  },

  generateWord: (
    wordLength: number,
    difficulty: Difficulty = Difficulty.easy
  ) => {
    const words = difficulties[difficulty];
    const lengthedWords = filter(words, (w) => w.length === wordLength);
    const randomIndex = Math.floor(Math.random() * lengthedWords.length);

    return lengthedWords[randomIndex];
  },
}));

export const vanillaStore = useWordStore;

const store = (selector: any = undefined) =>
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useStore(vanillaStore, selector) as WordState;

export default store;
