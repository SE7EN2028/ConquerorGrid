import { useEffect } from "react";
import { useGameStore } from "./store/gameStore";
import { useGameSocket } from "./hooks/useGameSocket";
import { JoinModal } from "./components/JoinModal";
import { Header } from "./components/Header";
import { StatsBar } from "./components/StatsBar";
import { Grid } from "./components/Grid";
import { Leaderboard } from "./components/Leaderboard";
import { ActivityFeed } from "./components/ActivityFeed";
import { Toast } from "./components/Toast";

export default function App() {
  const status = useGameStore((s) => s.status);
  const restore = useGameStore((s) => s.restore);

  useGameSocket();

  useEffect(() => {
    restore();
  }, [restore]);

  if (status !== "ready") {
    return (
      <div className="min-h-screen bg-bg text-text">
        <JoinModal />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg text-text">
      <Header />
      <div className="mx-auto grid max-w-[1400px] gap-5 p-5 lg:grid-cols-[1fr_340px]">
        <div className="flex flex-col gap-5">
          <StatsBar />
          <div className="panel overflow-auto p-4">
            <Grid />
          </div>
        </div>
        <aside className="flex max-h-[calc(100vh-7rem)] flex-col gap-5 lg:sticky lg:top-5">
          <Leaderboard />
          <ActivityFeed />
        </aside>
      </div>
      <Toast />
    </div>
  );
}
