import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { useGameStore } from "../store/gameStore";

export function Toast() {
  const notice = useGameStore((s) => s.notice);

  return (
    <AnimatePresence>
      {notice && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm shadow-xl"
        >
          <AlertCircle size={15} className="text-danger" />
          {notice}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
