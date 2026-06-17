import { Swords, Volume2, VolumeX } from "lucide-react";
import { useGameStore } from "../store/gameStore";
import { CooldownPill } from "./CooldownPill";

export function Header() {
  const user = useGameStore((s) => s.user);
  const online = useGameStore((s) => s.online);
  const muted = useGameStore((s) => s.muted);
  const toggleMuted = useGameStore((s) => s.toggleMuted);

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-bg/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-5 py-3">
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-lg border border-accent/30 bg-accent/15 text-accent">
            <Swords size={18} />
          </div>
          <div className="leading-none">
            <span className="font-display text-lg tracking-wide glow">CONQUEROR</span>
            <span className="font-display text-lg tracking-wide text-accent glow">GRID</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <span className="flex items-center gap-2 rounded-full border border-live/25 bg-live/10 px-3 py-1.5 text-sm font-medium text-live">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-live opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-live" />
            </span>
            <span className="tnum">{online}</span>
            <span className="text-live/70">online</span>
          </span>

          <CooldownPill />

          <button
            onClick={toggleMuted}
            className="grid h-9 w-9 cursor-pointer place-items-center rounded-lg border border-border bg-surface-2 text-muted transition-colors hover:text-text"
            aria-label={muted ? "Unmute" : "Mute"}
          >
            {muted ? <VolumeX size={15} /> : <Volume2 size={15} />}
          </button>

          {user && (
            <span className="flex items-center gap-2 rounded-lg border border-border bg-surface-2 px-3 py-1.5 text-sm font-medium">
              <span
                className="h-3 w-3 rounded-sm ring-1 ring-white/20"
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
