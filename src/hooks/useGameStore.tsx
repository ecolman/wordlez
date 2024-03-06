import { create } from "zustand";
import { persist } from "zustand/middleware";
// @ts-ignore
import { generate, wordList } from "random-words";

import { vanillaStore as vanillaAppStore } from "@/hooks/useAppStore";

export enum MatchType {
  NotFound,
  InWord,
  Match,
}

interface GameState {
  word: string | null;
  generateWord: () => void;
  setWord: (word: string) => void;

  guess: string;
  addToGuess: (letter: string) => void;
  deleteFromGuess: () => void;
  checkGuess: () => void;

  maxGuesses: number;
  pastGuesses: string[];

  testMatch: (guess: string) => void;
  checkLetter: (index: number, letter: string) => MatchType;

  letters: Letters;

  hasMatched: boolean;
  tileCount: number;
  tryCount: number;

  resetGame: () => void;
  resetOnLoad: boolean;
}

const seed = new Date().toString();

const store = create<GameState>()(
  persist(
    (set, get) => ({
      word: null,
      generateWord: () => {
        const tileCount = get().tileCount;
        const possibleWords = generate({
          minLength: tileCount,
          maxLength: tileCount,
          seed,
          exactly: 20,
          formatter: (word) => word.toUpperCase(),
        });
        const randomIndex = Math.floor(Math.random() * 19);

        set({ word: possibleWords[randomIndex] });
      },
      setWord: (word: string) => set({ word }),

      guess: "",
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
        const guess = get()?.guess;
        const hasMatched = get()?.hasMatched;

        if (!hasMatched && guess.length > 0) {
          set({ guess: guess.slice(0, -1) });
        }
      },
      checkGuess: () => {
        const appStore = vanillaAppStore.getState();
        const currentTryCount = get()?.tryCount;
        const guess = get().guess;

        if (guess.length < get().tileCount) {
          appStore.showToastMessage("Not enough letters");
          appStore.setShakeRowIndex(currentTryCount);
        } else if (wordList.indexOf(guess.toLowerCase()) > -1) {
          get().testMatch(guess);
        } else {
          appStore.showToastMessage("Not in word list");
          appStore.setShakeRowIndex(currentTryCount);
        }
      },

      maxGuesses: 6,
      pastGuesses: [],

      testMatch: async (guess: string) => {
        const appStore = vanillaAppStore.getState();
        const currentTryCount = get()?.tryCount;

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

            // show toast after waiting for animation to run
            setTimeout(() => {
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
            }, appStore.rowAnimationsMs);
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
            set({ resetOnLoad: true });
          }

          let newLetters: Letters = {
            notMatched: [],
            inWord: [],
            matched: [],
          };

          // check each letter in guess and put into right bucket for keyboard colors
          for (let index = 0; index < guess.length; index++) {
            const result = get().checkLetter(index, guess[index]);

            switch (result) {
              case MatchType.InWord:
                newLetters.inWord.push(guess[index]);

                break;

              case MatchType.Match:
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
      },

      checkLetter: (index: number, letter: string | null) => {
        const word = get()?.word;

        if (word && letter) {
          if (index < word.length && word[index] === letter) {
            return MatchType.Match;
          } else if (word.indexOf(letter) > -1) {
            return MatchType.InWord;
          }
        }

        return MatchType.NotFound;
      },

      letters: {
        notMatched: [],
        inWord: [],
        matched: [],
      },

      hasMatched: false,
      tileCount: 5,
      tryCount: 1,

      resetGame: () => {
        console.log("herererere");
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

export default store;
