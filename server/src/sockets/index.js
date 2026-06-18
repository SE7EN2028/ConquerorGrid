import { Server } from "socket.io";
import { config } from "../config.js";
import { getUserByToken } from "../services/userService.js";
import { getStats, getLeaderboard } from "../services/statsService.js";
import { claimCell } from "../services/claimService.js";
import { checkCooldown, markClaim } from "./cooldown.js";
import { addPresence, removePresence } from "./presence.js";

export function attachSockets(server) {
  const io = new Server(server, { cors: { origin: config.clientOrigin } });

  io.use(async (socket, next) => {
    const user = await getUserByToken(socket.handshake.auth?.token);
    if (user) socket.data.user = user.toClient();
    next();
  });

  io.on("connection", (socket) => {
    broadcastPresence(io);

    const user = socket.data.user;
    if (user) {
      addPresence(user.username);
      io.emit("activity", {
        type: "join",
        user: { name: user.username, color: user.color },
      });
    }

    socket.on("cell:claim", async ({ index } = {}, ack) => {
      const user = socket.data.user;
      if (!user) return ack?.({ ok: false, reason: "join first" });

      const cooldown = checkCooldown(user.id, config.cooldownMs);
      if (!cooldown.ok) {
        return ack?.({ ok: false, reason: "cooldown", retryIn: cooldown.retryIn });
      }

      const result = await claimCell(user, index);
      if (!result.ok) return ack?.(result);

      markClaim(user.id);
      ack?.({ ok: true, cell: result.cell });

      io.emit("cell:update", result.cell);
      io.emit("activity", {
        type: result.previousOwner ? "capture" : "claim",
        user: { name: user.username, color: user.color },
        cell: result.cell.id,
        from: result.previousOwner?.name || null,
      });
      scheduleSummary(io);
    });

    socket.on("disconnect", () => {
      if (user) removePresence(user.username);
      broadcastPresence(io);
    });
  });

  return io;
}

function broadcastPresence(io) {
  io.emit("presence", { online: io.engine.clientsCount });
}

// Stats and the leaderboard are derived (counts + aggregation), so we coalesce
// a burst of claims into one recompute instead of running it on every click.
let summaryQueued = false;
function scheduleSummary(io) {
  if (summaryQueued) return;
  summaryQueued = true;
  setTimeout(async () => {
    summaryQueued = false;
    const [stats, leaderboard] = await Promise.all([getStats(), getLeaderboard(10)]);
    io.emit("stats", stats);
    io.emit("leaderboard", leaderboard);
  }, 400);
}
