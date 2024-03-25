import { Fragment, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { X } from "lucide-react";
import clsx from "clsx";

import useAppStore from "@/hooks/useAppStore";
import useGameStore from "@/hooks/useGameStore";

export default function InfoModal() {
  const cancelButtonRef = useRef(null);
  const { showInfoModal, setShowInfoModal } = useAppStore();
  const { maxGuesses, tileCount } = useGameStore();

  return (
    <Transition.Root show={showInfoModal} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={setShowInfoModal}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-30 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-body-bg text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="bg-body-bg px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                  <div className="flex flex-col items-start dark:text-white">
                    <div className="flex w-full justify-end mb-2">
                      <X
                        className="cursor-pointer text-black dark:text-white"
                        size={30}
                        onClick={() => setShowInfoModal(false)}
                      />
                    </div>
                    <div className="text-3xl font-bold tracking-tight">
                      How to Play
                    </div>
                    <div className="text-xl font-medium">
                      Guess the Wordlez in {maxGuesses} tries.
                    </div>
                    <div className="my-4">
                      <ul className="list-disc ml-5">
                        <li>
                          Each guess must be a valid {tileCount}-letter word.
                        </li>
                        <li>
                          The color of the tiles will change to show how close
                          your guess was to the word.
                        </li>
                      </ul>
                    </div>

                    <div className="font-bold">Examples</div>

                    <div
                      className={clsx("grid gap-1.5 mt-2", {
                        [`grid-cols-${tileCount}`]: true,
                      })}
                    >
                      <div className="h-[32px] w-[32px] flex border-2 bg-match border-tile-used-border text-tile-used-text">
                        <div className="m-auto font-bold text-2xl -mt-[1px]">
                          R
                        </div>
                      </div>
                      <div className="h-[32px] w-[32px] flex border-2 text-tile-text bg-tile-bg border-tile-filled-border">
                        <div className="m-auto font-bold text-2xl -mt-[1px]">
                          O
                        </div>
                      </div>
                      <div className="h-[32px] w-[32px] flex border-2 text-tile-text bg-tile-bg border-tile-filled-border">
                        <div className="m-auto font-bold text-2xl -mt-[1px]">
                          U
                        </div>
                      </div>
                      <div className="h-[32px] w-[32px] flex border-2 text-tile-text bg-tile-bg border-tile-filled-border">
                        <div className="m-auto font-bold text-2xl -mt-[1px]">
                          T
                        </div>
                      </div>
                      <div className="h-[32px] w-[32px] flex border-2 text-tile-text bg-tile-bg border-tile-filled-border">
                        <div className="m-auto font-bold text-2xl -mt-[1px]">
                          E
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 mb-5">
                      <span className="font-bold">R</span> is in the word and in
                      the correct spot.
                    </div>

                    <div
                      className={clsx("grid gap-1.5 mt-2", {
                        [`grid-cols-${tileCount}`]: true,
                      })}
                    >
                      <div className="h-[32px] w-[32px] flex border-2 text-tile-text bg-tile-bg border-tile-filled-border">
                        <div className="m-auto font-bold text-2xl -mt-[1px]">
                          P
                        </div>
                      </div>
                      <div className="h-[32px] w-[32px] flex border-2 bg-in-word border-tile-used-border text-tile-used-text">
                        <div className="m-auto font-bold text-2xl -mt-[1px]">
                          A
                        </div>
                      </div>
                      <div className="h-[32px] w-[32px] flex border-2 text-tile-text bg-tile-bg border-tile-filled-border">
                        <div className="m-auto font-bold text-2xl -mt-[1px]">
                          I
                        </div>
                      </div>
                      <div className="h-[32px] w-[32px] flex border-2 text-tile-text bg-tile-bg border-tile-filled-border">
                        <div className="m-auto font-bold text-2xl -mt-[1px]">
                          N
                        </div>
                      </div>
                      <div className="h-[32px] w-[32px] flex border-2 text-tile-text bg-tile-bg border-tile-filled-border">
                        <div className="m-auto font-bold text-2xl -mt-[1px]">
                          T
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 mb-5">
                      <span className="font-bold">A</span> is in the word but in
                      the wrong spot.
                    </div>

                    <div
                      className={clsx("grid gap-1.5 mt-2", {
                        [`grid-cols-${tileCount}`]: true,
                      })}
                    >
                      <div className="h-[32px] w-[32px] flex border-2 text-tile-text bg-tile-bg border-tile-filled-border">
                        <div className="m-auto font-bold text-2xl -mt-[1px]">
                          R
                        </div>
                      </div>
                      <div className="h-[32px] w-[32px] flex border-2 text-tile-text bg-tile-bg border-tile-filled-border">
                        <div className="m-auto font-bold text-2xl -mt-[1px]">
                          A
                        </div>
                      </div>
                      <div className="h-[32px] w-[32px] flex border-2 text-tile-text bg-tile-bg border-tile-filled-border">
                        <div className="m-auto font-bold text-2xl -mt-[1px]">
                          D
                        </div>
                      </div>
                      <div className="h-[32px] w-[32px] flex border-2 bg-no-match border-tile-used-border text-tile-used-text">
                        <div className="m-auto font-bold text-2xl -mt-[1px]">
                          I
                        </div>
                      </div>
                      <div className="h-[32px] w-[32px] flex border-2 text-tile-text bg-tile-bg border-tile-filled-border">
                        <div className="m-auto font-bold text-2xl -mt-[1px]">
                          O
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 mb-5">
                      <span className="font-bold">I</span> is not in the word in
                      any spot.
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
