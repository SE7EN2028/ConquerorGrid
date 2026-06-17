import { useCallback, useMemo, useState } from "react";
import { useGameStore } from "../store/gameStore";
import { claimCell } from "../lib/claim";
import { CellTile } from "./CellTile";
import type { Cell } from "../lib/types";

const COOLDOWN_MS = 3000;

export function Grid() {
  const cols = useGameStore((s) => s.cols);
  const rows = useGameStore((s) => s.rows);
  const cells = useGameStore((s) => s.cells);
  const userId = useGameStore((s) => s.user?.id);
  const applyCellUpdate = useGameStore((s) => s.applyCellUpdate);
  const startCooldown = useGameStore((s) => s.startCooldown);

  const [hovered, setHovered] = useState<Cell | null>(null);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });

  const onClaim = useCallback(
    async (index: number) => {
      if (Date.now() < useGameStore.getState().cooldownUntil) return;
      const res = await claimCell(index);
      if (res.ok && res.cell) {
        applyCellUpdate(res.cell);
        startCooldown(COOLDOWN_MS);
      }
    },
    [applyCellUpdate, startCooldown]
  );

  const ids = useMemo(
    () => Array.from({ length: cols * rows }, (_, i) => i),
    [cols, rows]
  );

  return (
    <div
      className="relative"
      onMouseMove={(e) => setPointer({ x: e.clientX, y: e.clientY })}
    >
      <div
        className="grid gap-[3px]"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      >
        {ids.map((id) => {
          const cell = cells[id];
          if (!cell) return null;
          return (
            <CellTile
              key={id}
              cell={cell}
              mine={cell.owner?.id === userId}
              onClaim={onClaim}
              onHover={setHovered}
            />
          );
        })}
      </div>

      {hovered && <CellTooltip cell={hovered} x={pointer.x} y={pointer.y} />}
    </div>
  );
}

function CellTooltip({ cell, x, y }: { cell: Cell; x: number; y: number }) {
  return (
    <div
      className="pointer-events-none fixed z-40 rounded-lg border border-border bg-surface px-3 py-2 text-xs shadow-xl"
      style={{ left: x + 14, top: y + 14 }}
    >
      <div className="font-semibold text-text">Cell #{cell.id}</div>
      {cell.owner ? (
        <div className="mt-1 flex items-center gap-1.5 text-muted">
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: cell.owner.color }}
          />
          {cell.owner.name}
        </div>
      ) : (
        <div className="mt-1 text-muted">Unclaimed</div>
      )}
    </div>
  );
}
