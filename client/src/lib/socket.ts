import { io, type Socket } from "socket.io-client";
import { getToken } from "./api";

const URL = import.meta.env.VITE_SERVER_URL || "http://localhost:4000";

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    socket = io(URL, { auth: { token: getToken() }, autoConnect: false });
  }
  return socket;
}

export function connectSocket(): Socket {
  const s = getSocket();
  s.auth = { token: getToken() };
  if (!s.connected) s.connect();
  return s;
}
