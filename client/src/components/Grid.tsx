import { useCallback, useMemo, useState } from "react";
import { Crosshair, Flag, Lock, Swords } from "lucide-react";
import { useGameStore } from "../store/gameStore";
import { claimCell } from "../lib/claim";
import { blip } from "../lib/sound";
import { CellTile } from "./CellTile";
import { PanZoom } from "./PanZoom";
import { Minimap } from "./Minimap";
import { CooldownCursor } from "./CooldownCursor";
import type { Cell } from "../lib/types";

const COOLDOWN_MS = 3000;

function claimError(reason?: string) {
  switch (reason) {
    case "cooldown":
      return "Easy - wait for the cooldown";
    case "not adjacent":
      return "You can only expand next to your own cells";
    case "already yours":
      return "You already hold that one";
    case "join first":
      return "Join the game first";
    default:
      return "Couldn't claim that cell";
  }
}

export function Grid() {
  const cols = useGameStore((s) => s.cols);
  const rows = useGameStore((s) => s.rows);
  const cells = useGameStore((s) => s.cells);
  const userId = useGameStore((s) => s.user?.id);
  const applyCellUpdate = useGameStore((s) => s.applyCellUpdate);
  const startCooldown = useGameStore((s) => s.startCooldown);

  const [hovered, setHovered] = useState<{ cell: Cell; rect: DOMRect } | null>(null);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const [inside, setInside] = useState(false);

  const handleHover = useCallback((cell: Cell | null, rect?: DOMRect) => {
    setHovered(cell && rect ? { cell, rect } : null);
  }, []);

  // Frontier = cells you're allowed to take next: the unclaimed/enemy tiles
  // touching your own land. Mirrors the server's adjacency rule so the board
  // shows exactly where a claim will succeed.
  const { frontier, myCount } = useMemo(() => {
    const f = new Set<number>();
    if (!userId) return { frontier: f, myCount: 0 };

    const mineSet = new Set<number>();
    for (const key in cells) {
      if (cells[key].owner?.id === userId) mineSet.add(cells[key].id);
    }
    for (const idx of mineSet) {
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      if (col > 0 && !mineSet.has(idx - 1)) f.add(idx - 1);
      if (col < cols - 1 && !mineSet.has(idx + 1)) f.add(idx + 1);
      if (row > 0 && !mineSet.has(idx - cols)) f.add(idx - cols);
      if (row < rows - 1 && !mineSet.has(idx + cols)) f.add(idx + cols);
    }
    return { frontier: f, myCount: mineSet.size };
  }, [cells, userId, cols, rows]);

  const firstMove = myCount === 0;

  const onClaim = useCallback(
    async (index: number) => {
      const state = useGameStore.getState();
      if (Date.now() < state.cooldownUntil) return;

      const res = await claimCell(index);
      if (res.ok && res.cell) {
        applyCellUpdate(res.cell);
        startCooldown(COOLDOWN_MS);
        if (!state.muted) blip();
      } else {
        state.flash(claimError(res.reason));
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
      onMouseEnter={() => setInside(true)}
      onMouseLeave={() => setInside(false)}
    >
      <PanZoom>
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
                claimable={frontier.has(id)}
                onClaim={onClaim}
                onHover={handleHover}
              />
            );
          })}
        </div>
      </PanZoom>

      {firstMove && (
        <div className="pointer-events-none absolute left-1/2 top-3 z-10 -translate-x-1/2">
          <span className="flex items-center gap-2 rounded-full border border-accent/40 bg-bg/85 px-3.5 py-1.5 text-xs font-medium text-accent-soft backdrop-blur">
            <Crosshair size={13} /> Claim any cell to plant your flag
          </span>
        </div>
      )}

      <Minimap />

      {hovered && (
        <CellTooltip
          cell={hovered.cell}
          rect={hovered.rect}
          mine={hovered.cell.owner?.id === userId}
          claimable={frontier.has(hovered.cell.id)}
          firstMove={firstMove}
        />
      )}

      {inside && <CooldownCursor x={pointer.x} y={pointer.y} />}
    </div>
  );
}

interface TooltipProps {
  cell: Cell;
  rect: DOMRect;
  mine: boolean;
  claimable: boolean;
  firstMove: boolean;
}

const TIP_W = 176;
const TIP_H = 88;
const GAP = 10;

function action(p: TooltipProps) {
  if (p.mine) return { icon: Flag, label: "Your territory", color: "var(--color-live)" };
  if (p.cell.owner && p.claimable)
    return { icon: Swords, label: "Click to capture", color: "var(--color-danger)" };
  if (!p.cell.owner && (p.claimable || p.firstMove))
    return { icon: Crosshair, label: "Click to claim", color: "var(--color-accent-soft)" };
  return { icon: Lock, label: "Not next to your land", color: "var(--color-muted)" };
}

// Pin the inspector beside the hovered cell, flipping/clamping so it stays
// on screen near the cell instead of drifting off with the raw pointer.
function place(rect: DOMRect) {
  let left = rect.right + GAP;
  if (left + TIP_W > window.innerWidth) left = rect.left - TIP_W - GAP;
  left = Math.max(GAP, left);

  let top = rect.top;
  top = Math.min(top, window.innerHeight - TIP_H - GAP);
  top = Math.max(GAP, top);
  return { left, top };
}

function CellTooltip(props: TooltipProps) {
  const { cell, rect } = props;
  const { icon: Icon, label, color } = action(props);

  return (
    <div
      className="pointer-events-none fixed z-40 rounded-lg border border-border bg-surface px-3 py-2 text-xs shadow-xl"
      style={{ ...place(rect), width: TIP_W }}
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
      <div className="mt-1.5 flex items-center gap-1.5 font-medium" style={{ color }}>
        <Icon size={12} /> {label}
      </div>
    </div>
  );
}
