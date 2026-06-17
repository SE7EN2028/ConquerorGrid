import { motion, AnimatePresence } from "framer-motion";
import { Trophy } from "lucide-react";
import { useGameStore } from "../store/gameStore";

export function Leaderboard() {
  const board = useGameStore((s) => s.leaderboard);
  const meId = useGameStore((s) => s.user?.id);

  return (
    <section className="panel p-4">
      <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-muted">
        <Trophy size={15} /> Leaderboard
      </h2>

      {board.length === 0 ? (
        <p className="text-sm text-muted">No ground taken yet. Make the first move.</p>
      ) : (
        <div className="flex flex-col gap-1">
          <AnimatePresence initial={false}>
            {board.map((entry) => (
              <motion.div
                key={entry.id}
                layout
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
                className={[
                  "relative overflow-hidden rounded-lg px-3 py-2",
                  entry.id === meId ? "bg-accent/10" : "bg-surface-2",
                ].join(" ")}
              >
                <div
                  className="absolute inset-y-0 left-0 opacity-15"
                  style={{ width: `${entry.percent}%`, backgroundColor: entry.color }}
                />
                <div className="relative flex items-center gap-2.5">
                  <span className="w-5 text-sm font-bold text-muted">{entry.rank}</span>
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="flex-1 truncate text-sm font-medium">
                    {entry.username}
                  </span>
                  <span className="text-sm font-semibold">{entry.cells}</span>
                  <span className="w-12 text-right text-xs text-muted">
                    {entry.percent}%
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </section>
  );
}
