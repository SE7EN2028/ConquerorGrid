import type { Grid, LeaderboardEntry, Stats, User } from "./types";

const TOKEN_KEY = "cg_token";

// In dev Vite proxies /api to the server. In production point straight at it.
const BASE = import.meta.env.VITE_SERVER_URL
  ? `${import.meta.env.VITE_SERVER_URL}/api`
  : "/api";

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token: string) => localStorage.setItem(TOKEN_KEY, token);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || res.statusText);
  }
  return res.json();
}

export const api = {
  join: (username: string) =>
    request<{ user: User; token: string }>("/session", {
      method: "POST",
      body: JSON.stringify({ username }),
    }),
  me: () => request<{ user: User }>("/session/me"),
  grid: () => request<Grid>("/grid"),
  stats: () => request<Stats>("/stats"),
  leaderboard: () => request<LeaderboardEntry[]>("/leaderboard"),
};
