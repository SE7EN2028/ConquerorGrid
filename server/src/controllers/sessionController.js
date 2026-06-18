import { asyncHandler } from "../lib/asyncHandler.js";
import { createGuest } from "../services/userService.js";
import { isNameOnline } from "../sockets/presence.js";

export const join = asyncHandler(async (req, res) => {
  const name = (req.body?.username || "").trim();
  if (name && isNameOnline(name)) {
    return res
      .status(409)
      .json({ error: "That name is taken right now — pick another." });
  }
  const { user, token } = await createGuest(req.body?.username);
  res.status(201).json({ user, token });
});

export const me = asyncHandler(async (req, res) => {
  if (!req.user) return res.status(401).json({ error: "join first" });
  res.json({ user: req.user.toClient() });
});
