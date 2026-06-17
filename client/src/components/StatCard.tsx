import type { LucideIcon } from "lucide-react";
import { CountUp } from "./ui/CountUp";

interface Props {
  icon: LucideIcon;
  label: string;
  value: number | string;
  accent?: string;
}

export function StatCard({ icon: Icon, label, value, accent = "#6366f1" }: Props) {
  return (
    <div className="panel group relative overflow-hidden px-4 py-3.5">
      <div
        className="absolute inset-x-0 top-0 h-px opacity-60"
        style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
      />
      <div className="flex items-center gap-3">
        <div
          className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border"
          style={{ color: accent, borderColor: `${accent}40`, background: `${accent}14` }}
        >
          <Icon size={18} />
        </div>
        <div className="min-w-0">
          <div className="label">{label}</div>
          <div className="font-display text-2xl leading-tight tnum">
            {typeof value === "number" ? <CountUp value={value} /> : value}
          </div>
        </div>
      </div>
    </div>
  );
}
