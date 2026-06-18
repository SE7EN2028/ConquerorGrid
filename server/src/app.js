import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import cors from "cors";
import { config } from "./config.js";
import { attachUser } from "./middleware/auth.js";
import { apiLimiter, joinLimiter } from "./middleware/rateLimit.js";
import * as session from "./controllers/sessionController.js";
import * as grid from "./controllers/gridController.js";
import * as stats from "./controllers/statsController.js";

export function createApp() {
  const app = express();

  app.use(cors({ origin: config.clientOrigin }));
  app.use(express.json());
  app.use("/api", apiLimiter);
  app.use(attachUser);

  app.get("/api/health", (req, res) => res.json({ ok: true }));
  app.post("/api/session", joinLimiter, session.join);
  app.get("/api/session/me", session.me);
  app.get("/api/grid", grid.get);
  app.get("/api/stats", stats.stats);
  app.get("/api/leaderboard", stats.leaderboard);

  const clientDist = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "../../client/dist"
  );
  app.use(express.static(clientDist));
  app.use((req, res, next) => {
    if (req.method === "GET" && !req.path.startsWith("/api")) {
      return res.sendFile(path.join(clientDist, "index.html"));
    }
    next();
  });

  app.use((req, res) => res.status(404).json({ error: "not found" }));
  app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: "server error" });
  });

  return app;
}
