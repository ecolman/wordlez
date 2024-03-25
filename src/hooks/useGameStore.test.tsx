import {
  vanillaStore as vanillaGameStore,
  WordMatchType,
} from "@/hooks/useGameStore";

beforeEach(() => {
  let store = vanillaGameStore.getState();
  store.resetGame();
});

describe("GameStore", () => {
  it("tests a match: true", async () => {
    const store = vanillaGameStore.getState();
    const result = await store.testMatch(store?.word || "");

    expect(result).toEqual(WordMatchType.Match);
  });

  it("tests a match: false", async () => {
    const store = vanillaGameStore.getState();
    const result = await store.testMatch("ABCDE");

    expect(result).toEqual(WordMatchType.NoMatch);
  });

  it("tests a match: not a word", async () => {
    const store = vanillaGameStore.getState();
    const result = await store.testMatch("ABCDE");

    expect(result).toEqual(WordMatchType.NoMatch);
  });

  // it("every time increment is called, value increases by one", () => {
  //   const {result} = renderHook(() => useIncrementingStore());
  //   expect(result.current.value).toEqual(0);

  //   act(() => result.current.increment());
  //   expect(result.current.value).toEqual(1);
  //   act(() => result.current.increment());
  //   expect(result.current.value).toEqual(2);
  // });
});
