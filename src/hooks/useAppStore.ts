import { useStore } from "zustand";
import { createStore } from "zustand/vanilla";
import toast from "react-hot-toast";

interface AppState {
  appLoaded: boolean;
  setAppLoaded: (appLoaded: boolean) => void;

  rowAnimationsMs: number;

  revealRowIndex: number;
  setRevealRowIndex: (revealRowIndex: number) => void;

  shakeRowIndex: number;
  setShakeRowIndex: (shakeRowIndex: number) => void;

  showToastMessage: (message: string | JSX.Element, options?: any) => void;
  clearToastMessages: () => void;
}

const useAppStore = createStore<AppState>()((set, get) => ({
  appLoaded: false,
  setAppLoaded: (appLoaded: boolean) => set({ appLoaded }),

  rowAnimationsMs: 2000,

  shakeRowIndex: -1,
  setShakeRowIndex: (shakeRowIndex: number) => {
    set({ shakeRowIndex });

    // reset shake after time
    setTimeout(() => {
      set({ shakeRowIndex: -1 });
    }, 800);
  },

  revealRowIndex: -1,
  setRevealRowIndex: (revealRowIndex: number) => {
    console.log("updating reveal", revealRowIndex);
    set({ revealRowIndex });

    // reset reveal after time
    setTimeout(() => {
      set({ revealRowIndex: -1 });
    }, get().rowAnimationsMs);
  },

  showToastMessage: (toastMessage: string | JSX.Element, options: any = {}) => {
    toast(toastMessage, options);
  },
  clearToastMessages: () => {
    toast.dismiss();
  },
}));

export const vanillaStore = useAppStore;

const store = (selector: any = undefined) =>
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useStore(vanillaStore, selector) as AppState;

export default store;
