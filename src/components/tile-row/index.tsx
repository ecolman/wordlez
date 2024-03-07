import { useEffect, useMemo, useState } from "react";
import clsx from "clsx";

import Tile from "@/components/tile";
import useAppStore from "@/hooks/useAppStore";
import useGameStore, { MatchType } from "@/hooks/useGameStore";

interface TileRowProps {
  index: number;
}

export default function TileRow({ index: rowIndex }: TileRowProps) {
  const { revealRowIndex, shakeRowIndex } = useAppStore();
  const { guess, hasMatched, pastGuesses, tileCount, tryCount, word } =
    useGameStore();

  const [tileValues, setTileValues] = useState<string[]>([]);

  const checkLetter = (index: number, letter: string | null): MatchType => {
    if (word && letter) {
      if (index <= word.length && word[index] === letter) {
        return MatchType.Match;
      } else if (word.indexOf(letter) > -1) {
        return MatchType.InWord;
      }
    }

    return MatchType.NotFound;
  };

  const getTileClasses = (index: number) => {
    const tileValue = tileValues?.[index] ?? null;
    const matchType = checkLetter(index, tileValue);

    return {
      "animate-pop border-tile-filled-border": isActive && tileValue,
      "bg-in-word": isUsed && matchType === MatchType.InWord,
      "bg-match": isUsed && matchType === MatchType.Match,
      "bg-no-match": isUsed && matchType === MatchType.NotFound,
      "border-tile-used-border text-tile-used-text": isUsed,
      [`animate-forward-flip animation-delay-${index * 400}`]: revealRow,
    };
  };

  const isUsed: boolean = useMemo(() => {
    return rowIndex < tryCount || (rowIndex === tryCount && hasMatched);
  }, [hasMatched, tryCount, rowIndex]);

  const isActive: boolean = useMemo(() => {
    return rowIndex === tryCount && !hasMatched;
  }, [hasMatched, tryCount, rowIndex]);

  const revealRow: boolean = useMemo(() => {
    return rowIndex === revealRowIndex;
  }, [revealRowIndex, rowIndex]);

  // updates values of tiles if active row
  useEffect(() => {
    if (isActive && guess.length >= 0) {
      const setTileVals = async () => {
        await setTileValues([]);
        await setTileValues(guess.split(""));
      };

      setTileVals();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive, tryCount, guess, rowIndex, setTileValues]);

  // clear or set tile values from past guess if row is used
  useEffect(() => {
    const setTileVals = async () => {
      if (pastGuesses.length === 0) {
        await setTileValues([]);
      } else if (rowIndex <= pastGuesses.length) {
        await setTileValues(pastGuesses[rowIndex - 1].split("") ?? null);
      }
    };

    setTileVals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pastGuesses, rowIndex, tryCount]);

  return (
    <div
      className={clsx("grid gap-1.5", {
        [`grid-cols-${tileCount}`]: true,
        "animate-h-shake": shakeRowIndex === rowIndex,
      })}
    >
      {Array.from({ length: tileCount }, (item, index) => (
        <Tile
          value={tileValues?.[index] ?? null}
          className={clsx(getTileClasses(index))}
          key={`row-${rowIndex}-tile-${index}`}
        />
      ))}
    </div>
  );
}
