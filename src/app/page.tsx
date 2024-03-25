"use client";

import { useEffect } from "react";
import Keyboard from "react-simple-keyboard";
import { Toaster } from "react-hot-toast";

import TileRow from "@/components/tile-row";
import Header from "@/components/header";
import useAppStore from "@/hooks/useAppStore";
import useGameStore from "@/hooks/useGameStore";
import useKeyboardStore from "@/hooks/useKeyboardStore";

export default function Home() {
  const { appLoaded, onscreenKeyboardOnly, revealRowIndex, setAppLoaded } =
    useAppStore();
  const { maxGuesses, letters, word, generateWord, resetGame, resetOnLoad } =
    useGameStore();
  const {
    keyboardLayout,
    highlightedButtons,
    onKeyboardKeyPress,
    setHighlightedButtons,
  } = useKeyboardStore();

  // highlight buttons on keyboard
  useEffect(() => {
    setHighlightedButtons(letters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

      if (!onscreenKeyboardOnly) {
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
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onscreenKeyboardOnly]);

  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-start">
        <Header />

        <div className="flex flex-col pt-6 pb-4">
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
          buttonTheme={highlightedButtons}
        />

        {appLoaded && (
          <>
            <div className="text-black dark:text-white pb-1 text-sm flex justify-between">
              Made&nbsp;with&nbsp;<div className="text-red-600">&#9829;</div>
              &nbsp;by&nbsp;
              <a
                className="underline hover:text-gray-400 dark:hover:text-gray-200"
                href="mailto:ecolman@gmail.com"
              >
                Eric Colman
              </a>
            </div>
          </>
        )}
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
