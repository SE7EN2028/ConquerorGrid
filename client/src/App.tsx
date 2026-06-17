import { useEffect } from "react";
import { useGameStore } from "./store/gameStore";
import { useGameSocket } from "./hooks/useGameSocket";
import { JoinModal } from "./components/JoinModal";
import { Dashboard } from "./components/Dashboard";
import { Toast } from "./components/Toast";

export default function App() {
  const status = useGameStore((s) => s.status);
  const restore = useGameStore((s) => s.restore);

  useGameSocket();

  useEffect(() => {
    restore();
  }, [restore]);

  return (
    <div className="min-h-screen text-text">
      {status === "ready" ? <Dashboard /> : <JoinModal />}
      <Toast />
    </div>
  );
}
