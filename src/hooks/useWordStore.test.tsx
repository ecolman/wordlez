import { act } from "@testing-library/react";

import {
  vanillaStore as vanillaWordStore,
  Difficulty,
} from "@/hooks/useWordStore";

describe("WordStore", () => {
  it("generates a word with the correct length", () => {
    const store = vanillaWordStore.getState();

    let word = store.generateWord(4);
    expect(word.length).toEqual(4);

    word = store.generateWord(5);
    expect(word.length).toEqual(5);

    word = store.generateWord(6);
    expect(word.length).toEqual(6);
  });

  it("checks if word exists: true", () => {
    const store = vanillaWordStore.getState();

    const exists = store.checkWordExists("exist");
    expect(exists).toBeTruthy;
  });

  it("checks if word exists: false", () => {
    const store = vanillaWordStore.getState();

    const exists = store.checkWordExists("abcdef");
    expect(exists).toBeFalsy;
  });
});
