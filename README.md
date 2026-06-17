# ConquerorGrid

A real-time multiplayer territory game. Everyone shares one grid, click a cell to claim it,
and watch the map change live as other players fight for ground.

Think Reddit Place meets a strategy dashboard.

## Stack

**Server** — Node, Express, Socket.io, Mongoose / MongoDB
**Client** — React, Vite, TypeScript, Tailwind, Zustand, Framer Motion

## How it works

The server is the single source of truth. Claims go through one atomic database update,
so two people clicking the same cell at the same moment can never both win. Every committed
claim is broadcast to all connected clients over a WebSocket, so the board stays in sync
without any refreshes.

## Layout

```
server/   Express + Socket.io API and game logic
client/   Vite React dashboard
```

## Running locally

```bash
npm install
npm run seed      # build the grid (needs MONGODB_URI)
npm run dev       # server + client together
```

Set `MONGODB_URI` in `server/.env` first. See `server/.env.example`.

More detail in `docs/` (API, setup, deployment) once those land.
