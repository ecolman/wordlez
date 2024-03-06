"use client";

import { useEffect, useMemo, useState } from "react";
import Keyboard, {
  KeyboardButtonTheme,
  KeyboardLayoutObject,
} from "react-simple-keyboard";
import { Toaster } from "react-hot-toast";

import useAppStore from "@/hooks/useAppStore";
import useGameStore from "@/hooks/useGameStore";
import TileRow from "@/components/tile-row";

export default function Home() {
  const [keyboardLayout, setKeyboardLayout] = useState({
    default: [
      "Q W E R T Y U I O P",
      "A S D F G H J K L",
      "{enter} Z X C V B N M {bksp}",
    ],
  } as KeyboardLayoutObject);
  const { appLoaded, revealRowIndex, setAppLoaded } = useAppStore();
  const {
    addToGuess,
    deleteFromGuess,
    checkGuess,
    maxGuesses,
    letters,
    word,
    generateWord,
    resetGame,
    resetOnLoad,
  } = useGameStore();

  const onKeyboardKeyPress = (button: string) => {
    // only allow keyboard input if not in process of revealing a row
    if (revealRowIndex === -1) {
      switch (button) {
        case "{bksp}":
          deleteFromGuess();
          break;

        case "{enter}":
          checkGuess();
          break;

        default:
          addToGuess(button);
      }
    }
  };

  // highlight buttons on keyboard
  const buttonHighlights = useMemo(() => {
    const buttonHighlights: KeyboardButtonTheme[] = [];

    if (letters.inWord.length > 0) {
      buttonHighlights.push({
        class: "!bg-in-word",
        buttons: letters.inWord.join(" "),
      } as KeyboardButtonTheme);
    }

    if (letters.matched.length > 0) {
      buttonHighlights.push({
        class: "!bg-match",
        buttons: letters.matched.join(" "),
      } as KeyboardButtonTheme);
    }

    if (letters.notMatched.length > 0) {
      buttonHighlights.push({
        class: "!bg-no-match",
        buttons: letters.notMatched.join(" "),
      } as KeyboardButtonTheme);
    }

    return buttonHighlights;
  }, [letters]);

  // generate new word if app is loaded and none exists
  useEffect(() => {
    if (appLoaded && !word) {
      generateWord();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appLoaded, word]);

  // only want this to run once, check if game should be reset on initial load
  useEffect(() => {
    if (appLoaded && resetOnLoad) {
      resetGame();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appLoaded]);

  // attach to window keyboard event and pass to onKeyboardKeyPress function
  useEffect(() => {
    function handleKeyDown(event: any) {
      const keyCode = event?.keyCode;

      switch (keyCode) {
        case 8:
          onKeyboardKeyPress("{bksp}");
          break;

        case 13:
          onKeyboardKeyPress("{enter}");
          break;

        default:
          if (keyCode >= 65 && keyCode <= 90) {
            onKeyboardKeyPress(event.key.toUpperCase());
          }

          break;
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
    // revealRowIndex isn't used here, but it needed in a hooks' dependencies to trigger a rerender
    // of the component and then onKeyboardKeyPress, which depends on that value has the latest
    // not sure why, but a useCallback with the onKeyboardKeyPress function depending on revealRowIndex didn't work
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [revealRowIndex]);

  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-start">
        <div className="flex flex-col pt-6 pb-4">
          {/* <div className="text-8xl pb-3">Wordlez</div> */}

          {appLoaded && (
            <div className={`grid grid-rows-${maxGuesses} gap-1.5`}>
              {Array.from({ length: maxGuesses }, (item, index) => (
                <TileRow index={index + 1} key={`row-${index}`} />
              ))}
            </div>
          )}
        </div>

        <Keyboard
          layout={keyboardLayout}
          onKeyPress={onKeyboardKeyPress}
          onRender={() => setAppLoaded(true)}
          theme={"hg-theme-default hg-layout-default keyboard-theme"}
          display={{
            "{bksp}": "⌫",
            "{enter}": "ENTER",
          }}
          buttonTheme={buttonHighlights}
        />
      </main>

      <Toaster
        position="top-center"
        toastOptions={{
          duration: 2000,
          className: "toaster",
        }}
      />
    </>
  );
}
