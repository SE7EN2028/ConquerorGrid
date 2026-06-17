import mongoose from "mongoose";
import { config } from "../config.js";
import { connectDb } from "./connect.js";
import { Cell } from "../models/Cell.js";
import { Stats } from "../models/Stats.js";

async function seed() {
  await connectDb(config.mongoUri);

  const { cols, rows } = config.grid;
  const cells = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      cells.push({ index: row * cols + col, col, row });
    }
  }

  await Cell.deleteMany({});
  await Cell.insertMany(cells);
  await Stats.updateOne({ key: "global" }, { $set: { totalClaims: 0 } }, { upsert: true });

  console.log(`seeded ${cells.length} cells (${cols} x ${rows})`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
