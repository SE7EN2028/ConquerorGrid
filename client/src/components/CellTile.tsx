import { memo, useEffect, useRef, useState, type CSSProperties } from "react";
import type { Cell } from "../lib/types";

interface Props {
  cell: Cell;
  mine: boolean;
  claimable: boolean;
  onClaim: (index: number) => void;
  onHover: (cell: Cell | null, rect?: DOMRect) => void;
}

function CellTileBase({ cell, mine, claimable, onClaim, onHover }: Props) {
  const owned = cell.owner !== null;
  const [pop, setPop] = useState(false);
  const lastVersion = useRef(cell.version);

  useEffect(() => {
    if (cell.version === lastVersion.current) return;
    lastVersion.current = cell.version;
    setPop(true);
    const t = setTimeout(() => setPop(false), 420);
    return () => clearTimeout(t);
  }, [cell.version]);

  // claimable empty land = expand target; claimable enemy land = capture target
  const expand = claimable && !owned;
  const capture = claimable && owned && !mine;

  const style = owned
    ? ({ backgroundColor: cell.owner!.color, "--owner": cell.owner!.color } as CSSProperties)
    : undefined;

  return (
    <button
      onClick={() => onClaim(cell.id)}
      onMouseEnter={(e) => onHover(cell, e.currentTarget.getBoundingClientRect())}
      onMouseLeave={() => onHover(null)}
      style={style}
      className={[
        "cell aspect-square cursor-pointer rounded-[4px] transition-[background-color,box-shadow,filter] duration-150 hover:z-10",
        owned ? "cell-owned hover:brightness-110" : "bg-surface-2 hover:bg-border",
        mine ? "cell-mine" : "",
        expand ? "cell-frontier" : "",
        capture ? "cell-capture" : "",
        pop ? "cell-pop" : "",
      ].join(" ")}
    />
  );
}

export const CellTile = memo(CellTileBase);
