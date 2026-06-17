import { useEffect } from "react";
import { useGameStore } from "./store/gameStore";
import { useGameSocket } from "./hooks/useGameSocket";
import { JoinModal } from "./components/JoinModal";
import { Grid } from "./components/Grid";

export default function App() {
  const status = useGameStore((s) => s.status);
  const restore = useGameStore((s) => s.restore);

  useGameSocket();

  useEffect(() => {
    restore();
  }, [restore]);

  return (
    <div className="min-h-screen bg-bg text-text">
      {status !== "ready" && <JoinModal />}
      {status === "ready" && (
        <div className="mx-auto max-w-5xl p-6">
          <Grid />
        </div>
      )}
    </div>
  );
}
