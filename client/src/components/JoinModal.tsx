import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Swords, Loader2 } from "lucide-react";
import { useGameStore } from "../store/gameStore";

export function JoinModal() {
  const join = useGameStore((s) => s.join);
  const status = useGameStore((s) => s.status);
  const error = useGameStore((s) => s.error);
  const [name, setName] = useState("");

  const busy = status === "joining";

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (trimmed && !busy) join(trimmed);
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center px-4">
      <div className="absolute inset-0 grid-frame opacity-40" />
      <motion.form
        onSubmit={submit}
        initial={{ opacity: 0, y: 18, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
        className="panel relative w-full max-w-sm overflow-hidden p-8"
      >
        <div
          className="absolute inset-x-0 top-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent, #6366f1, transparent)" }}
        />

        <div className="mb-7 flex flex-col items-center text-center">
          <div className="mb-4 grid h-14 w-14 place-items-center rounded-2xl border border-accent/30 bg-accent/15 text-accent">
            <Swords size={26} />
          </div>
          <h1 className="font-display text-2xl tracking-wide">
            CONQUEROR<span className="text-accent glow">GRID</span>
          </h1>
          <p className="mt-1.5 text-sm text-muted">Claim cells. Hold the line. Take the map.</p>
        </div>

        <label htmlFor="username" className="label mb-2 block">
          Your callsign
        </label>
        <input
          id="username"
          autoFocus
          value={name}
          maxLength={24}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. nightowl"
          className="w-full rounded-lg border border-border bg-surface-2 px-3.5 py-3 text-text outline-none transition-colors focus:border-accent"
        />

        {error && <p className="mt-2 text-sm text-danger">{error}</p>}

        <button
          type="submit"
          disabled={busy || !name.trim()}
          className="mt-5 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-accent py-3 font-display text-sm tracking-wide text-white transition-colors hover:bg-accent-soft disabled:cursor-not-allowed disabled:opacity-50"
        >
          {busy && <Loader2 size={16} className="animate-spin" />}
          {busy ? "DEPLOYING" : "ENTER THE GRID"}
        </button>
      </motion.form>
    </div>
  );
}
