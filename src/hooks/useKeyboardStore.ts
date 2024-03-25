import { useStore } from "zustand";
import { createStore } from "zustand/vanilla";
import {
  KeyboardButtonTheme,
  KeyboardLayoutObject,
} from "react-simple-keyboard";

import { vanillaStore as vanillaAppStore } from "@/hooks/useAppStore";
import { vanillaStore as vanillaGameStore } from "@/hooks/useGameStore";

interface KeyboardState {
  keyboardLayout: KeyboardLayoutObject;

  onKeyboardKeyPress: (button: string) => void;

  highlightedButtons: KeyboardButtonTheme[];
  setHighlightedButtons: (letters: Letters) => void;
}

const useKeyboardStore = createStore<KeyboardState>()((set, get) => ({
  keyboardLayout: {
    default: [
      "Q W E R T Y U I O P",
      "A S D F G H J K L",
      "{enter} Z X C V B N M {bksp}",
    ],
  } as KeyboardLayoutObject,

  onKeyboardKeyPress: (button: string) => {
    const apptore = vanillaAppStore.getState();
    const gameStore = vanillaGameStore.getState();

    // only allow keyboard input if not in process of revealing a row
    if (apptore.revealRowIndex === -1) {
      switch (button) {
        case "{bksp}":
          gameStore.deleteFromGuess();
          break;

        case "{enter}":
          gameStore.checkGuess();
          break;

        default:
          gameStore.addToGuess(button);
      }
    }
  },

  highlightedButtons: [] as KeyboardButtonTheme[],
  setHighlightedButtons: (letters: Letters) => {
    const highlightedButtons: KeyboardButtonTheme[] = [];

    if (letters.inWord.length > 0) {
      highlightedButtons.push({
        class: "!bg-in-word",
        buttons: letters.inWord.join(" "),
      } as KeyboardButtonTheme);
    }

    if (letters.matched.length > 0) {
      highlightedButtons.push({
        class: "!bg-match",
        buttons: letters.matched.join(" "),
      } as KeyboardButtonTheme);
    }

    if (letters.notMatched.length > 0) {
      highlightedButtons.push({
        class: "!bg-no-match",
        buttons: letters.notMatched.join(" "),
      } as KeyboardButtonTheme);
    }

    set({ highlightedButtons });
  },
}));

export const vanillaStore = useKeyboardStore;

const store = (selector: any = undefined) =>
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useStore(vanillaStore, selector) as KeyboardState;

export default store;
