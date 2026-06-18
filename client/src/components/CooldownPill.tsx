import { Clock } from "lucide-react";
import { useCooldown } from "../hooks/useCooldown";

export function CooldownPill() {
  const { remaining, cooling } = useCooldown();

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
