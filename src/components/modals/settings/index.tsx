import { Fragment, useRef } from "react";
import { Dialog, Switch, Transition } from "@headlessui/react";
import { X } from "lucide-react";
import clsx from "clsx";

import useAppStore from "@/hooks/useAppStore";
import useGameStore from "@/hooks/useGameStore";

export default function SettingsModal() {
  const cancelButtonRef = useRef(null);
  const {
    showSettingsModal,
    setShowSettingsModal,
    darkTheme,
    setDarkTheme,
    highContractMode,
    setHighContractMode,
    onscreenKeyboardOnly,
    setOnscreenKeyboardOnly,
  } = useAppStore();
  const { hardMode, setHardMode } = useGameStore();

  return (
    <Transition.Root show={showSettingsModal} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={setShowSettingsModal}
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
                    <div className="flex w-full justify-between mb-6">
                      <div>&nbsp;</div>
                      <div className="font-bold uppercase">settings</div>
                      <X
                        className="cursor-pointer text-black dark:text-white"
                        size={30}
                        onClick={() => setShowSettingsModal(false)}
                      />
                    </div>

                    <div className="flex w-full justify-between items-center pb-4 border-b border-gray-500">
                      <div>
                        <div className="text-lg">Hard Mode</div>
                        <div className="text-xs">
                          Any revealed hints must be used in subsequent guesses
                        </div>
                      </div>
                      <div>
                        <Switch
                          checked={hardMode}
                          onChange={setHardMode}
                          className={`${
                            hardMode ? "bg-match" : "bg-no-match"
                          } relative inline-flex h-6 w-11 items-center rounded-full`}
                        >
                          <span className="sr-only">Hard Mode</span>
                          <span
                            className={`${
                              hardMode ? "translate-x-6" : "translate-x-1"
                            } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                          />
                        </Switch>
                      </div>
                    </div>

                    <div className="flex w-full justify-between items-center py-4 border-b border-gray-500">
                      <div>
                        <div className="text-lg">Dark Theme</div>
                      </div>
                      <div>
                        <Switch
                          checked={darkTheme}
                          onChange={setDarkTheme}
                          className={`${
                            darkTheme ? "bg-match" : "bg-no-match"
                          } relative inline-flex h-6 w-11 items-center rounded-full`}
                        >
                          <span className="sr-only">Dark Theme</span>
                          <span
                            className={`${
                              darkTheme ? "translate-x-6" : "translate-x-1"
                            } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                          />
                        </Switch>
                      </div>
                    </div>

                    <div className="flex w-full justify-between items-center py-4 border-b border-gray-500">
                      <div>
                        <div className="text-lg">High Contract Mode</div>
                        <div className="text-xs">
                          Contrast and colorblindness improvements
                        </div>
                      </div>
                      <div>
                        <Switch
                          checked={highContractMode}
                          onChange={setHighContractMode}
                          className={`${
                            highContractMode ? "bg-match" : "bg-no-match"
                          } relative inline-flex h-6 w-11 items-center rounded-full`}
                        >
                          <span className="sr-only">Dark Theme</span>
                          <span
                            className={`${
                              highContractMode
                                ? "translate-x-6"
                                : "translate-x-1"
                            } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                          />
                        </Switch>
                      </div>
                    </div>

                    <div className="flex w-full justify-between items-center py-4">
                      <div>
                        <div className="text-lg">
                          Onscreen Keyboard Input Only
                        </div>
                        <div className="text-xs">
                          Ignore key input except from the onscreen keyboard.
                          Most helpful for users using speech recognition or
                          other assistive devices.
                        </div>
                      </div>
                      <div>
                        <Switch
                          checked={onscreenKeyboardOnly}
                          onChange={setOnscreenKeyboardOnly}
                          className={`${
                            onscreenKeyboardOnly ? "bg-match" : "bg-no-match"
                          } relative inline-flex h-6 w-11 items-center rounded-full`}
                        >
                          <span className="sr-only">Dark Theme</span>
                          <span
                            className={`${
                              onscreenKeyboardOnly
                                ? "translate-x-6"
                                : "translate-x-1"
                            } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                          />
                        </Switch>
                      </div>
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
