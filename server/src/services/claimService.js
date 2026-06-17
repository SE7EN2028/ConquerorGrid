import { Cell } from "../models/Cell.js";
import { User } from "../models/User.js";
import { Stats } from "../models/Stats.js";
import { totalCells } from "../config.js";

// A claim is a single atomic findOneAndUpdate. Mongo serializes concurrent
// writes to the same document, so two players clicking the same cell can never
// leave it in a split state - the database decides the order and there is
// always exactly one owner. The guard also stops a player reclaiming a cell
// they already hold.
export async function claimCell(user, index) {
  if (!Number.isInteger(index) || index < 0 || index >= totalCells) {
    return { ok: false, reason: "invalid cell" };
  }

  const now = new Date();
  const before = await Cell.findOneAndUpdate(
    { index, ownerId: { $ne: user.id } },
    {
      $set: {
        ownerId: user.id,
        ownerName: user.username,
        ownerColor: user.color,
        claimedAt: now,
      },
      $inc: { version: 1 },
    },
    { new: false }
  );

  if (!before) return { ok: false, reason: "already yours" };

  await Promise.all([
    User.updateOne({ _id: user.id }, { $inc: { claims: 1 } }),
    Stats.updateOne({ key: "global" }, { $inc: { totalClaims: 1 } }, { upsert: true }),
  ]);

  return {
    ok: true,
    cell: {
      id: index,
      col: before.col,
      row: before.row,
      owner: { id: user.id, name: user.username, color: user.color },
      claimedAt: now,
      version: before.version + 1,
    },
    previousOwner: before.ownerId
      ? { id: before.ownerId, name: before.ownerName }
      : null,
  };
}
