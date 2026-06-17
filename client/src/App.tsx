import { useEffect } from "react";
import { useGameStore } from "./store/gameStore";
import { JoinModal } from "./components/JoinModal";

export default function App() {
  const status = useGameStore((s) => s.status);
  const restore = useGameStore((s) => s.restore);

  useEffect(() => {
    restore();
  }, [restore]);

  return (
    <div className="min-h-screen bg-bg text-text">
      {status !== "ready" && <JoinModal />}
      <main className="p-6">
        {status === "ready" && (
          <p className="text-muted">Connected. The board lands in the next chunk.</p>
        )}
      </main>
    </div>
  );
}
