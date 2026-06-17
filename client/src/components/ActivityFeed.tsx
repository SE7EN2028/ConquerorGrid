import { motion, AnimatePresence } from "framer-motion";
import { Radio } from "lucide-react";
import { useGameStore } from "../store/gameStore";
import type { ActivityItem } from "../lib/types";

function describe(item: ActivityItem) {
  if (item.type === "join") return <>joined the game</>;
  if (item.type === "capture" && item.from)
    return (
      <>
        took #{item.cell} from <span className="text-muted">{item.from}</span>
      </>
    );
  return <>claimed #{item.cell}</>;
}

export function ActivityFeed() {
  const activity = useGameStore((s) => s.activity);

  return (
    <section className="panel flex min-h-0 flex-1 flex-col p-4">
      <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-muted">
        <Radio size={15} /> Activity
      </h2>

      {activity.length === 0 ? (
        <p className="text-sm text-muted">Waiting for the first move…</p>
      ) : (
        <div className="flex flex-col gap-1.5 overflow-y-auto pr-1">
          <AnimatePresence initial={false}>
            {activity.slice(0, 18).map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2 text-sm"
              >
                <span
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ backgroundColor: item.user.color }}
                />
                <span className="truncate">
                  <span className="font-medium">{item.user.name}</span>{" "}
                  <span className="text-muted">{describe(item)}</span>
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </section>
  );
}
