import { motion, AnimatePresence } from "framer-motion";
import { Radio, LogIn, Flag, Swords, type LucideIcon } from "lucide-react";
import { useGameStore } from "../store/gameStore";
import type { ActivityItem } from "../lib/types";

const ICON: Record<ActivityItem["type"], { icon: LucideIcon; color: string }> = {
  join: { icon: LogIn, color: "#34d399" },
  claim: { icon: Flag, color: "#6366f1" },
  capture: { icon: Swords, color: "#fb7185" },
};

function describe(item: ActivityItem) {
  if (item.type === "join") return <>joined the game</>;
  if (item.type === "capture" && item.from)
    return (
      <>
        took <span className="tnum text-text">#{item.cell}</span> from {item.from}
      </>
    );
  return (
    <>
      claimed <span className="tnum text-text">#{item.cell}</span>
    </>
  );
}

export function ActivityFeed() {
  const activity = useGameStore((s) => s.activity);

  return (
    <section className="panel flex min-h-0 flex-1 flex-col">
      <header className="flex items-center justify-between border-b border-border/70 px-4 py-3">
        <span className="label flex items-center gap-2">
          <Radio size={14} className="text-accent" /> Live activity
        </span>
      </header>

      <div className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto p-3">
        {activity.length === 0 ? (
          <p className="px-1 text-sm text-muted">Waiting for the first move…</p>
        ) : (
          <AnimatePresence initial={false}>
            {activity.slice(0, 30).map((item) => {
              const { icon: Icon, color } = ICON[item.type];
              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2.5 rounded-md px-1.5 py-1.5 text-sm"
                >
                  <span
                    className="grid h-6 w-6 shrink-0 place-items-center rounded-md"
                    style={{ color, background: `${color}1a` }}
                  >
                    <Icon size={13} />
                  </span>
                  <span className="truncate">
                    <span className="font-medium" style={{ color: item.user.color }}>
                      {item.user.name}
                    </span>{" "}
                    <span className="text-muted">{describe(item)}</span>
                  </span>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>
    </section>
  );
}
