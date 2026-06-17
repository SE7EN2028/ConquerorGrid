import { asyncHandler } from "../lib/asyncHandler.js";
import { getStats, getLeaderboard } from "../services/statsService.js";

export const stats = asyncHandler(async (req, res) => {
  res.json(await getStats());
});

export const leaderboard = asyncHandler(async (req, res) => {
  const limit = Number(req.query.limit) || 10;
  res.json(await getLeaderboard(limit));
});
