# ConquerorGrid

A live multiplayer territory game where every click matters. Capture blocks, expand your control, and compete against other players on a shared world that updates instantly. Fast, interactive, and designed for real-time competition.

## Features

- Shared grid (720 cells by default, configurable) that updates live over WebSockets
- Click to claim, capture neighbours and grow your territory
- Server-authoritative claims — atomic, race-proof, with a 3s cooldown
- Live leaderboard, stats and an activity feed
- Pan, zoom and a minimap for navigating bigger boards
- Guest accounts with auto-assigned colours — no signup

## Stack

**Server** — Node, Express, Socket.io, Mongoose / MongoDB
**Client** — React, Vite, TypeScript, Tailwind, Zustand, Framer Motion

## Structure

```
server/   REST + WebSocket API and game logic
client/   Vite React dashboard
docs/     architecture, API, setup, deployment
```

## Quick start

```bash
npm install
cp server/.env.example server/.env   # then add your MONGODB_URI
npm run seed                          # build the grid
npm run dev                           # server + client together
```

Client runs on http://localhost:5173, API on http://localhost:4000.

## Docs

- [Setup](docs/SETUP.md)
- [API reference](docs/API.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Deployment](docs/DEPLOYMENT.md)
