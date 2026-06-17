import { Users, Flag, Square, Crown } from "lucide-react";
import { useGameStore } from "../store/gameStore";
import { StatCard } from "./StatCard";

export function StatsBar() {
  const online = useGameStore((s) => s.online);
  const stats = useGameStore((s) => s.stats);
  const myCells = useGameStore((s) => {
    const id = s.user?.id;
    if (!id) return 0;
    let count = 0;
    for (const key in s.cells) if (s.cells[key].owner?.id === id) count++;
    return count;
  });

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <StatCard icon={Users} label="Online" value={online} accent="#22c55e" />
      <StatCard icon={Flag} label="Claimed" value={stats?.claimed ?? 0} accent="#6366f1" />
      <StatCard icon={Square} label="Remaining" value={stats?.remaining ?? 0} accent="#7c7c92" />
      <StatCard icon={Crown} label="Your cells" value={myCells} accent="#f5b301" />
    </div>
  );
}
