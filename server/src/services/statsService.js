import { Cell } from "../models/Cell.js";
import { Stats } from "../models/Stats.js";
import { totalCells } from "../config.js";

export async function getStats() {
  const [claimed, stats] = await Promise.all([
    Cell.countDocuments({ ownerId: { $ne: null } }),
    Stats.getGlobal(),
  ]);
  return {
    totalCells,
    claimed,
    remaining: totalCells - claimed,
    totalClaims: stats.totalClaims,
  };
}

export async function getLeaderboard(limit = 10) {
  const top = await Cell.aggregate([
    { $match: { ownerId: { $ne: null } } },
    {
      $group: {
        _id: "$ownerId",
        cells: { $sum: 1 },
        username: { $first: "$ownerName" },
        color: { $first: "$ownerColor" },
      },
    },
    { $sort: { cells: -1 } },
    { $limit: limit },
  ]);

  return top.map((entry, i) => ({
    rank: i + 1,
    id: entry._id,
    username: entry.username,
    color: entry.color,
    cells: entry.cells,
    percent: Number(((entry.cells / totalCells) * 100).toFixed(1)),
  }));
}
