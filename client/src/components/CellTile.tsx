import { memo } from "react";
import type { Cell } from "../lib/types";

interface Props {
  cell: Cell;
  mine: boolean;
  onClaim: (index: number) => void;
  onHover: (cell: Cell | null) => void;
}

function CellTileBase({ cell, mine, onClaim, onHover }: Props) {
  const owned = cell.owner !== null;

  return (
    <button
      onClick={() => onClaim(cell.id)}
      onMouseEnter={() => onHover(cell)}
      onMouseLeave={() => onHover(null)}
      style={owned ? { backgroundColor: cell.owner!.color } : undefined}
      className={[
        "aspect-square rounded-[3px] transition-colors duration-150",
        owned ? "hover:brightness-110" : "bg-surface-2 hover:bg-border",
        mine ? "ring-1 ring-white/70" : "",
      ].join(" ")}
    />
  );
}

export const CellTile = memo(CellTileBase);
