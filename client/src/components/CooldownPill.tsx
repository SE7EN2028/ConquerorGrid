import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { useGameStore } from "../store/gameStore";

export function CooldownPill() {
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
    }, 100);
    return () => clearInterval(id);
  }, [until]);

  const remaining = Math.max(0, until - now);
  const cooling = remaining > 0;

  return (
    <span
      className={[
        "flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium tnum",
        cooling
          ? "border-danger/40 bg-danger/10 text-danger"
          : "border-live/25 bg-live/10 text-live",
      ].join(" ")}
    >
      <Clock size={14} />
      {cooling ? `${(remaining / 1000).toFixed(1)}s` : "Ready"}
    </span>
  );
}
