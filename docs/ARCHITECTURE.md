# Architecture

## Overview

```
        REST (snapshot)        WebSocket (live deltas)
client  ───────────────►  server  ◄────────────────►  all clients
                            │
                            ▼
                         MongoDB
```

A client loads once over REST (grid + stats + leaderboard), then everything
afterwards arrives as small WebSocket events. The server is the only writer to
the database and the only thing that decides who owns what.

## Why MongoDB

- **Per-document atomic updates.** A claim is a single `findOneAndUpdate` on one
  cell document. MongoDB applies that atomically, which is exactly the primitive
  we need — no explicit locks, no transactions to coordinate.
- **The data is naturally document shaped.** A cell with its owner denormalised
  onto it renders fast and reads in one query.
- **Easy hosting + aggregation.** Atlas has a free tier, and the leaderboard is a
  one-line aggregation grouped by owner.

## Concurrency

Two players clicking the same cell at the same instant is the core race. It's
handled in `claimService.js`:

```js
Cell.findOneAndUpdate(
  { index, ownerId: { $ne: user.id } },
  { $set: { ownerId, ownerName, ownerColor, claimedAt }, $inc: { version: 1 } },
  { new: false }
);
```

Because this is a single-document update, MongoDB serialises the two writes. One
runs first, the other second — the cell always ends with exactly one owner, never
a half-applied state. The guard (`ownerId != you`) also makes reclaiming your own
cell a no-op instead of a wasted write.

On top of that, every player has a **3 second cooldown** enforced on the server,
so the claim rate is bounded regardless of what the client does.

## Consistency

Each cell carries a `version` that increments on every claim. The client applies
an incoming `cell:update` only if its version is newer than what it already has:

```js
if (current && current.version >= cell.version) return;
```

That makes the client converge to the server's truth even if socket messages
arrive out of order or a player's own optimistic update races a broadcast.

## State synchronisation

1. On join the client pulls a full snapshot over REST.
2. It then listens for deltas: `cell:update`, `stats`, `leaderboard`,
   `presence`, `activity`.
3. Stats and the leaderboard are derived values, so the server **coalesces** a
   burst of claims into one recompute (~400ms) instead of recomputing per click.

The client keeps all of this in a single Zustand store; components subscribe to
just the slices they need.

## Scalability

**~1,000 users** — a single Node process is fine. Claims are capped by the
cooldown, and broadcasts are O(connections). Make sure the indexes exist
(`index` unique, `ownerId`).

**~10,000 users** — the bottleneck is fan-out, not the database. Run several
socket nodes behind a load balancer and add the
[Socket.io Redis adapter](https://socket.io/docs/v4/redis-adapter/) so a claim on
one node reaches clients on every node. Consider batching `cell:update` events
into small ticks (e.g. 20/s) so a busy board doesn't flood slow clients.

**Multiple WebSocket servers** — the socket layer is stateless (auth is a token
that resolves to a user, presence is just a count). With the Redis adapter and a
shared MongoDB, you can scale nodes horizontally; the only shared state lives in
Mongo and Redis. Use sticky sessions so a socket stays on one node.

## Security

- **Server owns identity.** Claims use the user resolved from the socket's token.
  The client never sends an owner id, so it can't claim as someone else.
- **Everything is validated server-side** — cell index range, the adjacency rule,
  and the cooldown. The client checks are only for UX.
- **Rate limiting** — `express-rate-limit` on the REST API, and the per-user
  cooldown throttles claims over the socket.
- **Token never leaks.** It's stored with `select: false` and is never part of
  any payload broadcast to other players.

## Folder map (server)

```
src/
  config.js            env + derived constants
  app.js               express app + routes
  index.js             http server + socket bootstrap
  controllers/         thin request handlers
  services/            game logic (claims, grid, stats, users)
  sockets/             socket.io wiring + cooldown tracking
  models/              mongoose schemas
  middleware/          auth + rate limiting
  database/            connection + seed
  lib/                 small shared helpers
```
