import { useCooldown } from "../hooks/useCooldown";

// Radial countdown that rides the cursor while the claim cooldown is active,
// so the lockout is visible right where the player is about to click.
export function CooldownCursor({ x, y }: { x: number; y: number }) {
  const { remaining, cooling, progress } = useCooldown();
  if (!cooling) return null;

  const deg = Math.round(progress * 360);

  return (
    <div
      className="pointer-events-none fixed z-40 -translate-x-1/2 -translate-y-1/2"
      style={{ left: x, top: y }}
    >
      <div
        className="grid h-11 w-11 place-items-center rounded-full shadow-lg"
        style={{
          background: `conic-gradient(var(--color-danger) ${deg}deg, rgba(255,255,255,0.1) ${deg}deg)`,
        }}
      >
        <span className="grid h-9 w-9 place-items-center rounded-full bg-bg/90 text-[11px] font-semibold tabular-nums text-danger">
          {(remaining / 1000).toFixed(1)}
        </span>
      </div>
    </div>
  );
}
