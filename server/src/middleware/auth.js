import { getUserByToken } from "../services/userService.js";

function readToken(req) {
  const header = req.get("authorization") || "";
  if (header.startsWith("Bearer ")) return header.slice(7);
  return req.get("x-session-token") || null;
}

export async function attachUser(req, res, next) {
  try {
    req.user = await getUserByToken(readToken(req));
    next();
  } catch (err) {
    next(err);
  }
}

export function requireUser(req, res, next) {
  if (!req.user) return res.status(401).json({ error: "join first" });
  next();
}
