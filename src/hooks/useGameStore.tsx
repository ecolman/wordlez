import { createStore } from "zustand/vanilla";
import { useStore } from "zustand";
import { persist } from "zustand/middleware";
import { filter, reduce } from "lodash-es";

import { vanillaStore as vanillaAppStore } from "@/hooks/useAppStore";
import {
  vanillaStore as vanillaWordStore,
  Difficulty,
} from "@/hooks/useWordStore";

export enum LetterMatchType {
  NotFound,
  InWord,
  Match,
}

export enum WordMatchType {
  NotInWordList,
  NotEnoughLetters,
  Match,
  NoMatch,
}

interface PositionMatchType {
  matchType: LetterMatchType;
  position: number;
}

interface GameState {
  word: string | null;
  generateWord: () => void;
  setWord: (word: string) => void;

  guess: string;
  setGuess: (guess: string) => void;
  addToGuess: (letter: string) => void;
  deleteFromGuess: () => void;
  checkGuess: () => Promise<WordMatchType>;

  maxGuesses: number;
  pastGuesses: string[];

  testMatch: (guess: string) => Promise<WordMatchType>;
  checkLetter: (
    position: number,
    letter: string | null,
    guess: string | null
  ) => LetterMatchType;

  letters: Letters;

  hasMatched: boolean;
  tileCount: number;
  tryCount: number;

  hardMode: boolean;
  setHardMode: (hardMode: boolean) => void;

  resetGame: () => void;
  resetOnLoad: boolean;
}

const useGameStore = createStore<GameState>()(
  persist(
    (set, get) => ({
      word: null,
      generateWord: () => {
        const tileCount: number = get().tileCount;
        const wordStore = vanillaWordStore.getState();
        const word: string = wordStore.generateWord(tileCount, Difficulty.easy);

        set({ word: word.toUpperCase() });
      },
      setWord: (word: string) => set({ word }),

      guess: "",
      setGuess: (guess: string) => set({ guess }),
      addToGuess: (letter: string) => {
        const guess = get()?.guess;

        if (
          get()?.pastGuesses.length < get()?.maxGuesses &&
          guess.length < get().tileCount
        ) {
          set({ guess: guess + letter });
        }
      },
      deleteFromGuess: () => {
        const guess: string = get()?.guess;
        const hasMatched: boolean = get()?.hasMatched;

        if (!hasMatched && guess.length > 0) {
          set({ guess: guess.slice(0, -1) });
        }
      },
      checkGuess: async (): Promise<WordMatchType> => {
        const appStore = vanillaAppStore.getState();
        const wordStore = vanillaWordStore.getState();

        const currentTryCount = get()?.tryCount;
        const guess = get().guess;

        if (guess.length < get().tileCount) {
          appStore.showToastMessage("Not enough letters");
          appStore.setShakeRowIndex(currentTryCount);
          return WordMatchType.NotEnoughLetters;
        } else if (wordStore.checkWordExists(guess)) {
          return await get().testMatch(guess);
        } else {
          appStore.showToastMessage("Not in word list");
          appStore.setShakeRowIndex(currentTryCount);
          return WordMatchType.NotInWordList;
        }
      },

      maxGuesses: 6,
      pastGuesses: [],

      testMatch: async (guess: string): Promise<WordMatchType> => {
        const appStore = vanillaAppStore.getState();
        const currentTryCount = get()?.tryCount;
        let hasMatched = false;

        if (
          guess.length === get().tileCount &&
          currentTryCount <= get().maxGuesses &&
          !get().hasMatched
        ) {
          if (get()?.word === guess) {
            set({
              hasMatched: true,
              pastGuesses: [...get().pastGuesses, guess],
            });
            hasMatched = true;

            await new Promise((r) => setTimeout(r, appStore.rowAnimationsMs));

            // show toast after waiting for animation to run

            let toastMessage;
            switch (currentTryCount) {
              case 1:
                toastMessage = "Nailed it!";
                break;

              case 2:
                toastMessage = "Amazing!";
                break;

              case 3:
                toastMessage = "Great job!";
                break;

              case 4:
                toastMessage = "Nice one!";
                break;

              case 5:
                toastMessage = "You got it!";
                break;

              case 6:
                toastMessage = "Alright alright alright!";
                break;

              case 7:
                toastMessage = "Royale with cheese!";
                break;

              default:
                toastMessage = "Close call, phew!";
                break;
            }

            appStore.showToastMessage(
              <div
                className="cursor-pointer"
                onClick={() => {
                  appStore.clearToastMessages();
                  get().resetGame();
                }}
              >
                Click here to play again
              </div>,
              {
                duration: Infinity,
              }
            );
            appStore.showToastMessage(toastMessage, { duration: Infinity });
            set({ resetOnLoad: true });
          } else {
            set({
              guess: "",
              pastGuesses: [...get().pastGuesses, guess],
              tryCount: currentTryCount + 1,
            });
          }

          appStore.setRevealRowIndex(currentTryCount);

          // wait on code execution until letters are revealed
          await new Promise((r) => setTimeout(r, appStore.rowAnimationsMs));

          // if all guesses are used and hasn't matched, show toast to allow reset of game and set
          // boolean to reset game on load
          if (!get().hasMatched && get().tryCount > get().maxGuesses) {
            appStore.showToastMessage(
              <div
                className="cursor-pointer"
                onClick={() => {
                  appStore.clearToastMessages();
                  get().resetGame();
                }}
              >
                Click here to play again
              </div>,
              {
                duration: Infinity,
              }
            );
            appStore.showToastMessage(`The word was: ${get().word}`, {
              duration: Infinity,
            });
            set({ resetOnLoad: true });
          }

          let newLetters: Letters = {
            notMatched: [],
            inWord: [],
            matched: [],
          };

          // check each letter in guess and put into right bucket for keyboard colors
          for (let index = 0; index < guess.length; index++) {
            const result = get().checkLetter(index, guess[index], guess);

            switch (result) {
              case LetterMatchType.InWord:
                newLetters.inWord.push(guess[index]);

                break;

              case LetterMatchType.Match:
                newLetters.matched.push(guess[index]);

                break;

              default:
                newLetters.notMatched.push(guess[index]);

                break;
            }
          }

          const letters: Letters = get().letters;
          const notMatched = [...letters.notMatched, ...newLetters.notMatched];
          const inWord = [...letters.inWord, ...newLetters.inWord];
          const matched = [...letters.matched, ...newLetters.matched];

          set({
            letters: {
              notMatched,
              inWord,
              matched,
            } as Letters,
          });
        }

        return hasMatched ? WordMatchType.Match : WordMatchType.NoMatch;
      },

      checkLetter: (
        position: number,
        letter: string | null,
        guess: string | null
      ) => {
        const word = get()?.word;

        if (word && letter) {
          const guessOccurances: number = filter(
            guess?.split(""),
            (w) => w === letter
          ).length;
          const wordOccurances: number = filter(
            word.split(""),
            (w) => w === letter
          ).length;

          const wordMatchTypeInAnotherPosition: PositionMatchType = reduce(
            word.split(""),
            (positionMatchType, wLetter, wIndex) => {
              if (
                positionMatchType.matchType === LetterMatchType.NotFound &&
                wIndex !== position
              ) {
                if (wLetter === letter) {
                  return {
                    matchType: LetterMatchType.Match,
                    position: wIndex,
                  } as PositionMatchType;
                } else {
                  // take out current position in word and see if letter is still in word
                  // meaning it occures somewhere else in the word
                  const wordCopy = word.split("");
                  wordCopy[wIndex] = "";
                  const wPosition = wordCopy.indexOf(letter);
                  if (wPosition > -1) {
                    return {
                      matchType: LetterMatchType.InWord,
                      position: wPosition,
                    } as PositionMatchType;
                  }
                }
              }

              return positionMatchType;
            },
            {
              matchType: LetterMatchType.NotFound,
              position: -1,
            } as PositionMatchType
          );

          const guessMatchTypeInAnotherPosition: PositionMatchType = reduce(
            guess?.split(""),
            (positionMatchType, gLetter, gIndex) => {
              if (
                positionMatchType.matchType === LetterMatchType.NotFound &&
                gIndex !== position
              ) {
                if (gLetter === word[gIndex]) {
                  return {
                    matchType: LetterMatchType.Match,
                    position: gIndex,
                  } as PositionMatchType;
                } else {
                  // take out current position in word and see if letter is still in word
                  // meaning it occures somewhere else in the word
                  const wordCopy = word.split("");
                  wordCopy[gIndex] = "";
                  const wPosition = wordCopy.indexOf(gLetter);
                  if (wPosition > -1) {
                    return {
                      matchType: LetterMatchType.InWord,
                      position: wPosition,
                    } as PositionMatchType;
                  }
                }
              }

              return positionMatchType;
            },
            {
              matchType: LetterMatchType.NotFound,
              position: -1,
            } as PositionMatchType
          );

          // if the letter occures twice in word or guess, or both, treat a differently
          if (position < word.length && word[position] === letter) {
            return LetterMatchType.Match;
          } else if (guessOccurances > 1) {
            if (
              guessMatchTypeInAnotherPosition.matchType ===
              LetterMatchType.Match
            ) {
              return LetterMatchType.NotFound;
            } else if (
              guessMatchTypeInAnotherPosition.matchType ===
              LetterMatchType.InWord
            ) {
              // console.log(
              //   "here",
              //   position,
              //   guessMatchTypeInAnotherPosition.position,
              //   position < guessMatchTypeInAnotherPosition.position
              // );
              return position < guessMatchTypeInAnotherPosition.position
                ? LetterMatchType.InWord
                : LetterMatchType.NotFound;
            }
          } else if (word.indexOf(letter) > -1) {
            if (
              wordMatchTypeInAnotherPosition.matchType === LetterMatchType.Match
            ) {
              return LetterMatchType.NotFound;
            } else if (
              wordMatchTypeInAnotherPosition.matchType ===
              LetterMatchType.InWord
            ) {
              // console.log(
              //   "here2",
              //   position,
              //   wordMatchTypeInAnotherPosition.position,
              //   position < wordMatchTypeInAnotherPosition.position
              // );
              return position < wordMatchTypeInAnotherPosition.position
                ? LetterMatchType.InWord
                : LetterMatchType.NotFound;
            }

            return LetterMatchType.InWord;
          } else {
          }
        }

        return LetterMatchType.NotFound;
      },

      letters: {
        notMatched: [],
        inWord: [],
        matched: [],
      },

      hasMatched: false,
      tileCount: 5,
      tryCount: 1,

      hardMode: false,
      setHardMode: (hardMode: boolean) => set({ hardMode }),

      resetGame: () => {
        get()?.generateWord();
        set({
          guess: "",
          hasMatched: false,
          letters: {
            notMatched: [],
            inWord: [],
            matched: [],
          } as Letters,
          pastGuesses: [],
          tryCount: 1,
          resetOnLoad: false,
        });
      },
      resetOnLoad: false,
    }),
    {
      name: "wordelz-storage",
    }
  )
);

export const vanillaStore = useGameStore;

const store = (selector: any = undefined) =>
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useStore(vanillaStore, selector) as GameState;

export default store;
