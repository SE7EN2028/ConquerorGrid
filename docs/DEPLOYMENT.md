# Deployment

The server and client deploy separately: the server is a long-running Node
process (it holds WebSocket connections), the client is static files.

## One-click on Render (Blueprint)

`render.yaml` at the repo root defines both services. In Render, create a new
Blueprint from this repo (branch `main`) and apply it, then:

1. Set the three secrets it asks for:
   - **conquerorgrid-api** → `MONGODB_URI` (Atlas string), `CLIENT_ORIGIN` (the
     web service URL, e.g. `https://conquerorgrid-web.onrender.com`)
   - **conquerorgrid-web** → `VITE_SERVER_URL` (the API URL, e.g.
     `https://conquerorgrid-api.onrender.com`)
2. Seed the grid once — open a Shell on the API service and run:
   ```bash
   npm run seed:prod
   ```
3. `VITE_SERVER_URL` is baked in at build time, so redeploy the web service
   after you set it.

> Free instances sleep when idle, which drops open sockets. Use a paid plan to
> keep the board live.

The rest of this doc covers the equivalent manual setup on any host.

## Database

Use a hosted MongoDB — Atlas is the simplest. Create a cluster, add a database
user, and allow access from your host's IP (or `0.0.0.0/0` if the platform's IPs
aren't fixed). Keep the connection string for the server's env.

## Server (Render / Railway / Fly.io)

A plain Node web service. Settings:

- **Root directory:** `server`
- **Build:** `npm install`
- **Start:** `npm start`
- **Env:**

  ```
  PORT=4000
  MONGODB_URI=<your atlas string>
  CLIENT_ORIGIN=https://your-client-domain
  GRID_COLS=30
  GRID_ROWS=24
  CLAIM_COOLDOWN=3
  ENFORCE_ADJACENCY=true
  ```

Seed the grid once after the first deploy (a one-off job/shell on the platform):

```bash
npm run seed
```

Make sure the platform doesn't sleep the instance — sleeping drops every open
socket.

## Client (Vercel / Netlify)

A static Vite build.

- **Root directory:** `client`
- **Build:** `npm install && npm run build`
- **Output:** `dist`
- **Env:**

  ```
  VITE_SERVER_URL=https://your-server-domain
  ```

`VITE_SERVER_URL` is where the client opens the socket and sends REST calls in
production (the dev proxy only applies locally).

## Checklist

- [ ] `CLIENT_ORIGIN` on the server matches the deployed client URL (CORS)
- [ ] `VITE_SERVER_URL` on the client points at the deployed server
- [ ] Grid seeded once against the production database
- [ ] Server instance stays awake (no idle sleep)
