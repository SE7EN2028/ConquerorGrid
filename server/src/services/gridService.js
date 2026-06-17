import { Cell } from "../models/Cell.js";
import { config } from "../config.js";

export async function getGrid() {
  const cells = await Cell.find().sort({ index: 1 });
  return {
    cols: config.grid.cols,
    rows: config.grid.rows,
    cells: cells.map((c) => c.toClient()),
  };
}
