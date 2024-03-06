import { clsx } from "clsx";

interface TileProps {
  className?: string;
  value: string | null;
}

export default function Tile({ className, value }: TileProps) {
  return (
    <div
      className={clsx(
        "w-[56px] h-[56px] short:w-[50px] short:h-[50px] tall:w-[62px] tall:h-[62px] flex border-2 text-tile-text",
        className,
        {
          "bg-tile-bg border-tile-border": !value,
        }
      )}
    >
      <div className="m-auto font-bold text-3xl short:text-2xl">{value}</div>
    </div>
  );
}
