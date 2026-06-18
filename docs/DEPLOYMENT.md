# Deployment

One service runs everything: the Express server serves the REST API, holds the
live Socket.IO connections, and serves the built client from the same origin.
No separate frontend host, no CORS wiring.

## Database

Use a hosted MongoDB — Atlas is simplest. Create a cluster, add a database user,
and allow access from your host's IP (or `0.0.0.0/0` if the platform's IPs
aren't fixed). Keep the connection string for the server's env.

## One-click on Render (Blueprint)

`render.yaml` at the repo root defines a single web service. In Render: **New →
Blueprint**, pick this repo (branch `main`), apply it, then set `MONGODB_URI`
when prompted. That's the only required secret.

> Free instances sleep when idle, which drops open sockets. Use a paid plan to
> keep the board live.

## Manual web service (any Node host)

Create one **Web Service** from the repo root:

- **Root directory:** *(repo root — leave blank)*
- **Build:** `npm install && npm run build`
- **Start:** `node server/src/index.js`
- **Env:**

  ```
  MONGODB_URI=<your atlas string>
  GRID_COLS=30
  GRID_ROWS=24
  CLAIM_COOLDOWN=3
  ENFORCE_ADJACENCY=true
  ```

`PORT` is injected by the platform (the server reads `process.env.PORT`).
`CLIENT_ORIGIN` is optional — same-origin serving reflects any origin; set it
only if you want to lock the API to a specific domain.

The build step compiles the client to `client/dist`; the server serves it
automatically. Any non-`/api` GET falls back to `index.html`.

## Seeding

The grid is created once per database. If the database is empty, open a Shell on
the service and run:

```bash
node server/src/database/seed.js
```

(An Atlas database that was already seeded locally needs nothing.)

## Checklist

- [ ] `MONGODB_URI` set and the cluster allows the host's IP
- [ ] Build ran `npm run build` (client compiled to `client/dist`)
- [ ] Grid seeded once against the production database
- [ ] Instance stays awake (no idle sleep) so sockets survive
