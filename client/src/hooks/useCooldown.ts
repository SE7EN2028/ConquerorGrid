import { useEffect, useState } from "react";
import { useGameStore } from "../store/gameStore";

const DEFAULT_MS = 3000;

// Shared cooldown clock. Ticks only while a cooldown is active and stops itself
// the moment it expires, so it is cheap to use in several components at once.
export function useCooldown(totalMs = DEFAULT_MS) {
  const until = useGameStore((s) => s.cooldownUntil);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (until <= Date.now()) {
      setNow(Date.now());
      return;
    }
    const id = setInterval(() => {
      const t = Date.now();
      setNow(t);
      if (t >= until) clearInterval(id);
    }, 80);
    return () => clearInterval(id);
  }, [until]);

  const remaining = Math.max(0, until - now);
  return {
    remaining,
    cooling: remaining > 0,
    progress: totalMs > 0 ? Math.min(1, 1 - remaining / totalMs) : 1,
  };
}
