import { useEffect } from "react";
import { connectSocket } from "../lib/socket";
import { useGameStore } from "../store/gameStore";
import type { Activity, Cell, LeaderboardEntry, Stats } from "../lib/types";

export function useGameSocket() {
  const ready = useGameStore((s) => s.status === "ready");

  useEffect(() => {
    if (!ready) return;
    const socket = connectSocket();
    const store = useGameStore.getState();

    const onCell = (cell: Cell) => store.applyCellUpdate(cell);
    const onStats = (stats: Stats) => store.setStats(stats);
    const onBoard = (board: LeaderboardEntry[]) => store.setLeaderboard(board);
    const onPresence = ({ online }: { online: number }) => store.setOnline(online);
    const onActivity = (item: Activity) => store.pushActivity(item);

    socket.on("cell:update", onCell);
    socket.on("stats", onStats);
    socket.on("leaderboard", onBoard);
    socket.on("presence", onPresence);
    socket.on("activity", onActivity);

    return () => {
      socket.off("cell:update", onCell);
      socket.off("stats", onStats);
      socket.off("leaderboard", onBoard);
      socket.off("presence", onPresence);
      socket.off("activity", onActivity);
      socket.disconnect();
    };
  }, [ready]);
}
