# API reference

The server exposes a small REST API for the initial snapshot and a Socket.io
channel for everything live. The REST base path is `/api`.

## Auth

Joining returns a `token`. Send it on later REST calls as a header:

```
Authorization: Bearer <token>
```

For sockets, pass it in the connection auth:

```js
io(URL, { auth: { token } });
```

The server resolves the token to a user on its side — the client never sends an
owner id, so ownership can't be spoofed.

## REST

### `POST /api/session`

Create a guest. Body: `{ "username": "nightowl" }`.

```json
{
  "user": { "id": "65...", "username": "nightowl", "color": "#6366f1", "claims": 0 },
  "token": "v0Hk..."
}
```

### `GET /api/session/me`

Returns the user for the current token. `401` if the token is missing/invalid.

### `GET /api/grid`

The full board.

```json
{
  "cols": 30,
  "rows": 24,
  "cells": [
    { "id": 0, "col": 0, "row": 0, "owner": null, "claimedAt": null, "version": 0 }
  ]
}
```

### `GET /api/stats`

```json
{ "totalCells": 720, "claimed": 42, "remaining": 678, "totalClaims": 51 }
```

### `GET /api/leaderboard?limit=10`

Top players by **cells currently held** (territory, not lifetime claims).

```json
[
  { "rank": 1, "id": "65...", "username": "nightowl", "color": "#6366f1", "cells": 18, "percent": 2.5 }
]
```

## WebSocket events

### Client → server

| Event        | Payload          | Ack                                                        |
| ------------ | ---------------- | ---------------------------------------------------------- |
| `cell:claim` | `{ index }`      | `{ ok, cell }` on success, else `{ ok: false, reason }`    |

Reasons: `cooldown` (with `retryIn` ms), `not adjacent`, `already yours`,
`invalid cell`, `join first`.

### Server → client

| Event         | Payload                                  | When                          |
| ------------- | ---------------------------------------- | ----------------------------- |
| `cell:update` | a cell object                            | any committed claim           |
| `stats`       | the stats object                         | after claims (coalesced)      |
| `leaderboard` | leaderboard array                        | after claims (coalesced)      |
| `presence`    | `{ online }`                             | connect / disconnect          |
| `activity`    | `{ type, user, cell?, from? }`           | joins and claims              |

`activity.type` is `join`, `claim`, or `capture` (when a cell was taken from
someone, `from` is their name).
