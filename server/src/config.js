function num(value, fallback) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

export const config = {
  port: num(process.env.PORT, 4000),
  clientOrigin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
  mongoUri: process.env.MONGODB_URI || "",
  grid: {
    cols: num(process.env.GRID_COLS, 30),
    rows: num(process.env.GRID_ROWS, 24),
  },
  cooldownMs: num(process.env.CLAIM_COOLDOWN, 3) * 1000,
};

export const totalCells = config.grid.cols * config.grid.rows;
