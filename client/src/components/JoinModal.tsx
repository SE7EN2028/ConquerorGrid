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
    <div className="fixed inset-0 z-50 grid place-items-center bg-bg/90 px-4 backdrop-blur-sm">
      <motion.form
        onSubmit={submit}
        initial={{ opacity: 0, y: 16, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
        className="panel w-full max-w-sm p-8"
      >
        <div className="mb-6 flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-accent/15 text-accent">
            <Swords size={22} />
          </div>
          <div>
            <h1 className="text-lg font-bold leading-tight">ConquerorGrid</h1>
            <p className="text-sm text-muted">Claim cells. Take the map.</p>
          </div>
        </div>

        <label className="mb-2 block text-sm font-medium text-muted">Pick a name</label>
        <input
          autoFocus
          value={name}
          maxLength={24}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. nightowl"
          className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2.5 text-text outline-none transition focus:border-accent"
        />

        {error && <p className="mt-2 text-sm text-danger">{error}</p>}

        <button
          type="submit"
          disabled={busy || !name.trim()}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-accent py-2.5 font-semibold text-white transition hover:bg-accent-soft disabled:cursor-not-allowed disabled:opacity-50"
        >
          {busy ? <Loader2 size={18} className="animate-spin" /> : null}
          {busy ? "Joining" : "Enter the grid"}
        </button>
      </motion.form>
    </div>
  );
}
