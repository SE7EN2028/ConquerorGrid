import { asyncHandler } from "../lib/asyncHandler.js";
import { getGrid } from "../services/gridService.js";

export const get = asyncHandler(async (req, res) => {
  res.json(await getGrid());
});
