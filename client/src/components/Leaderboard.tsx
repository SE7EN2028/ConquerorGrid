import { motion, AnimatePresence } from "framer-motion";
import { Trophy } from "lucide-react";
import { useGameStore } from "../store/gameStore";
import { Panel } from "./ui/Panel";

const MEDAL = ["#fbbf24", "#cbd5e1", "#d4884f"]; // gold, silver, bronze

export function Leaderboard() {
  const board = useGameStore((s) => s.leaderboard);
  const meId = useGameStore((s) => s.user?.id);

  return (
    <Panel title="Leaderboard" icon={Trophy} bodyClassName="flex flex-col gap-1.5">
      {board.length === 0 ? (
        <p className="text-sm text-muted">No ground taken yet. Make the first move.</p>
      ) : (
        <AnimatePresence initial={false}>
          {board.map((entry) => {
            const me = entry.id === meId;
            const medal = MEDAL[entry.rank - 1];
            return (
              <motion.div
                key={entry.id}
                layout
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
                className={[
                  "relative overflow-hidden rounded-lg px-2.5 py-2",
                  me ? "bg-accent/10 ring-1 ring-accent/30" : "bg-surface-2",
                ].join(" ")}
              >
                <div
                  className="absolute inset-y-0 left-0 opacity-20"
                  style={{ width: `${entry.percent}%`, backgroundColor: entry.color }}
                />
                <div className="relative flex items-center gap-2.5">
                  <span
                    className="grid h-6 w-6 shrink-0 place-items-center rounded-md font-display text-xs tnum"
                    style={{
                      color: medal ?? "#868ca3",
                      background: medal ? `${medal}1a` : "transparent",
                    }}
                  >
                    {entry.rank}
                  </span>
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-sm ring-1 ring-white/15"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="flex-1 truncate text-sm font-medium">
                    {entry.username}
                    {me && <span className="ml-1 text-xs text-accent">you</span>}
                  </span>
                  <span className="font-display text-sm tnum">{entry.cells}</span>
                  <span className="w-11 text-right text-xs text-muted tnum">{entry.percent}%</span>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      )}
    </Panel>
  );
}
