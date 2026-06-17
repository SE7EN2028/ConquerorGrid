import { memo, useEffect, useRef, useState } from "react";
import type { Cell } from "../lib/types";

interface Props {
  cell: Cell;
  mine: boolean;
  onClaim: (index: number) => void;
  onHover: (cell: Cell | null) => void;
}

function CellTileBase({ cell, mine, onClaim, onHover }: Props) {
  const owned = cell.owner !== null;
  const [pop, setPop] = useState(false);
  const lastVersion = useRef(cell.version);

  useEffect(() => {
    if (cell.version === lastVersion.current) return;
    lastVersion.current = cell.version;
    setPop(true);
    const t = setTimeout(() => setPop(false), 350);
    return () => clearTimeout(t);
  }, [cell.version]);

  return (
    <button
      onClick={() => onClaim(cell.id)}
      onMouseEnter={() => onHover(cell)}
      onMouseLeave={() => onHover(null)}
      style={owned ? { backgroundColor: cell.owner!.color } : undefined}
      className={[
        "relative aspect-square cursor-pointer rounded-[4px] transition duration-150 hover:z-10 hover:scale-[1.18]",
        owned ? "hover:brightness-125" : "bg-surface-2 hover:bg-border",
        mine ? "ring-1 ring-white/80" : "ring-1 ring-transparent hover:ring-white/30",
        pop ? "cell-pop" : "",
      ].join(" ")}
    />
  );
}

export const CellTile = memo(CellTileBase);
