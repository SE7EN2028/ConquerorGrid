import { create } from "zustand";
import { api, getToken, setToken, clearToken } from "../lib/api";
import type {
  ActivityItem,
  Cell,
  Grid,
  LeaderboardEntry,
  Stats,
  User,
} from "../lib/types";

type Status = "idle" | "joining" | "ready";

interface GameState {
  status: Status;
  error: string | null;
  user: User | null;

  cols: number;
  rows: number;
  cells: Record<number, Cell>;

  stats: Stats | null;
  leaderboard: LeaderboardEntry[];
  online: number;
  activity: ActivityItem[];
  cooldownUntil: number;

  join: (username: string) => Promise<void>;
  restore: () => Promise<void>;
  bootstrap: () => Promise<void>;

  setGrid: (grid: Grid) => void;
  applyCellUpdate: (cell: Cell) => void;
  setStats: (stats: Stats) => void;
  setLeaderboard: (board: LeaderboardEntry[]) => void;
  setOnline: (online: number) => void;
  pushActivity: (item: Omit<ActivityItem, "id">) => void;
  startCooldown: (ms: number) => void;
}

let activityId = 0;

export const useGameStore = create<GameState>((set, get) => ({
  status: "idle",
  error: null,
  user: null,

  cols: 0,
  rows: 0,
  cells: {},

  stats: null,
  leaderboard: [],
  online: 0,
  activity: [],
  cooldownUntil: 0,

  join: async (username) => {
    set({ status: "joining", error: null });
    try {
      const { user, token } = await api.join(username);
      setToken(token);
      set({ user });
      await get().bootstrap();
    } catch (err) {
      set({ status: "idle", error: (err as Error).message });
    }
  },

  restore: async () => {
    if (!getToken()) return;
    try {
      const { user } = await api.me();
      set({ user });
      await get().bootstrap();
    } catch {
      clearToken();
    }
  },

  bootstrap: async () => {
    const [grid, stats, leaderboard] = await Promise.all([
      api.grid(),
      api.stats(),
      api.leaderboard(),
    ]);
    get().setGrid(grid);
    set({ stats, leaderboard, status: "ready" });
  },

  setGrid: (grid) => {
    const cells: Record<number, Cell> = {};
    for (const cell of grid.cells) cells[cell.id] = cell;
    set({ cols: grid.cols, rows: grid.rows, cells });
  },

  applyCellUpdate: (cell) => {
    const current = get().cells[cell.id];
    if (current && current.version >= cell.version) return;
    set((state) => ({ cells: { ...state.cells, [cell.id]: cell } }));
  },

  setStats: (stats) => set({ stats }),
  setLeaderboard: (leaderboard) => set({ leaderboard }),
  setOnline: (online) => set({ online }),

  pushActivity: (item) =>
    set((state) => ({
      activity: [{ ...item, id: activityId++ }, ...state.activity].slice(0, 40),
    })),

  startCooldown: (ms) => set({ cooldownUntil: Date.now() + ms }),
}));
