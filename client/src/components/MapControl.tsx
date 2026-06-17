import { useGameStore } from "../store/gameStore";
import { Bar } from "./ui/Bar";

export function MapControl() {
  const stats = useGameStore((s) => s.stats);
  const myCells = useGameStore((s) => {
    const id = s.user?.id;
    if (!id) return 0;
    let count = 0;
    for (const key in s.cells) if (s.cells[key].owner?.id === id) count++;
    return count;
  });

  const total = stats?.totalCells ?? 0;
  const claimed = stats?.claimed ?? 0;
  const claimedPct = total ? (claimed / total) * 100 : 0;
  const myPct = total ? (myCells / total) * 100 : 0;

  return (
    <div className="panel px-4 py-3.5">
      <div className="mb-2.5 flex items-center justify-between">
        <span className="label">Map control</span>
        <span className="text-sm text-muted">
          <span className="font-display text-accent tnum">{claimedPct.toFixed(1)}%</span> taken
        </span>
      </div>

      <Bar percent={claimedPct} color="#6366f1" className="h-2.5" glow />

      <div className="mt-2.5 flex items-center justify-between text-xs text-muted">
        <span>
          You hold <span className="font-display text-gold tnum">{myPct.toFixed(1)}%</span>
        </span>
        <span className="tnum">
          {claimed.toLocaleString()} / {total.toLocaleString()}
        </span>
      </div>
    </div>
  );
}
