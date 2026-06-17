import { asyncHandler } from "../lib/asyncHandler.js";
import { createGuest } from "../services/userService.js";

export const join = asyncHandler(async (req, res) => {
  const { user, token } = await createGuest(req.body?.username);
  res.status(201).json({ user, token });
});

export const me = asyncHandler(async (req, res) => {
  if (!req.user) return res.status(401).json({ error: "join first" });
  res.json({ user: req.user.toClient() });
});
