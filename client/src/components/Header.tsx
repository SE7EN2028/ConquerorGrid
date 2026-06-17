import { Swords, Volume2, VolumeX } from "lucide-react";
import { useGameStore } from "../store/gameStore";
import { CooldownPill } from "./CooldownPill";

export function Header() {
  const user = useGameStore((s) => s.user);
  const online = useGameStore((s) => s.online);
  const muted = useGameStore((s) => s.muted);
  const toggleMuted = useGameStore((s) => s.toggleMuted);

  return (
    <header className="border-b border-border bg-surface/60 backdrop-blur">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-5 py-3">
        <div className="flex items-center gap-2.5">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-accent/15 text-accent">
            <Swords size={18} />
          </div>
          <span className="font-bold tracking-tight">ConquerorGrid</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-sm text-muted">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
            </span>
            {online} online
          </span>

          <CooldownPill />

          <button
            onClick={toggleMuted}
            className="grid h-7 w-7 place-items-center rounded-full border border-border bg-surface-2 text-muted transition hover:text-text"
            title={muted ? "Unmute" : "Mute"}
          >
            {muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
          </button>

          {user && (
            <span className="flex items-center gap-2 rounded-full border border-border bg-surface-2 px-3 py-1 text-sm">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: user.color }}
              />
              {user.username}
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
