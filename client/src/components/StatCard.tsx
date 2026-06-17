import type { LucideIcon } from "lucide-react";

interface Props {
  icon: LucideIcon;
  label: string;
  value: number | string;
  accent?: string;
}

export function StatCard({ icon: Icon, label, value, accent }: Props) {
  return (
    <div className="panel flex items-center gap-3 px-4 py-3">
      <div
        className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-surface-2"
        style={accent ? { color: accent } : undefined}
      >
        <Icon size={18} />
      </div>
      <div className="min-w-0">
        <div className="text-xs text-muted">{label}</div>
        <div className="text-lg font-bold leading-tight">{value}</div>
      </div>
    </div>
  );
}
