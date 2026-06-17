import { nanoid } from "nanoid";
import { User } from "../models/User.js";
import { pickColor } from "../lib/colors.js";

export async function createGuest(username) {
  const name = (username || "").trim().slice(0, 24) || "guest";
  const taken = await User.distinct("color");
  const user = await User.create({
    username: name,
    color: pickColor(taken),
    token: nanoid(32),
  });
  return { user: user.toClient(), token: user.token };
}

export function getUserByToken(token) {
  if (!token) return Promise.resolve(null);
  return User.findOne({ token }).select("+token");
}
