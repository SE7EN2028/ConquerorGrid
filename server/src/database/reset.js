import mongoose from "mongoose";
import { config } from "../config.js";
import { connectDb } from "./connect.js";
import { Cell } from "../models/Cell.js";
import { User } from "../models/User.js";
import { Stats } from "../models/Stats.js";

// Full wipe: removes every guest account and rebuilds a blank grid. Use to
// start a fresh round. (`seed` only rebuilds the grid; this also clears users.)
async function reset() {
  await connectDb(config.mongoUri);

  const { cols, rows } = config.grid;
  const cells = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      cells.push({ index: row * cols + col, col, row });
    }
  }

  const users = await User.countDocuments();
  await User.deleteMany({});
  await Cell.deleteMany({});
  await Cell.insertMany(cells);
  await Stats.updateOne({ key: "global" }, { $set: { totalClaims: 0 } }, { upsert: true });

  console.log(`reset: cleared ${users} users, rebuilt ${cells.length} cells (${cols} x ${rows})`);
  await mongoose.disconnect();
}

reset().catch((err) => {
  console.error(err);
  process.exit(1);
});
