export interface User {
  id: string;
  username: string;
  color: string;
  claims: number;
}

export interface CellOwner {
  id: string;
  name: string;
  color: string;
}

export interface Cell {
  id: number;
  col: number;
  row: number;
  owner: CellOwner | null;
  claimedAt: string | null;
  version: number;
}

export interface Grid {
  cols: number;
  rows: number;
  cells: Cell[];
}

export interface Stats {
  totalCells: number;
  claimed: number;
  remaining: number;
  totalClaims: number;
}

export interface LeaderboardEntry {
  rank: number;
  id: string;
  username: string;
  color: string;
  cells: number;
  percent: number;
}

export type Activity =
  | { type: "join"; user: { name: string; color: string } }
  | { type: "claim"; user: { name: string; color: string }; cell: number; from: null }
  | { type: "capture"; user: { name: string; color: string }; cell: number; from: string | null };

export type ActivityItem = Activity & { id: number };

export interface ClaimResult {
  ok: boolean;
  cell?: Cell;
  reason?: string;
  retryIn?: number;
}
