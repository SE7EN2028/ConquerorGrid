# Setup

## Requirements

- Node 18+ (developed on 22)
- A MongoDB database — the easiest option is a free MongoDB Atlas cluster

## 1. Get a MongoDB connection string

1. Create a free cluster at https://www.mongodb.com/atlas
2. Add a database user and allow your IP (or `0.0.0.0/0` for quick testing)
3. Copy the connection string, it looks like:

   ```
   mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/conquerorgrid
   ```

## 2. Configure the server

```bash
cp server/.env.example server/.env
```

Open `server/.env` and set `MONGODB_URI`. The rest have sensible defaults:

| Variable            | Default                  | What it does                                  |
| ------------------- | ------------------------ | --------------------------------------------- |
| `PORT`              | `4000`                   | API + WebSocket port                          |
| `CLIENT_ORIGIN`     | `http://localhost:5173`  | Allowed CORS origin                           |
| `MONGODB_URI`       | —                        | Mongo connection string (required)            |
| `GRID_COLS`         | `30`                     | Grid width in cells                           |
| `GRID_ROWS`         | `24`                     | Grid height in cells                          |
| `CLAIM_COOLDOWN`    | `3`                      | Seconds between claims per player             |
| `ENFORCE_ADJACENCY` | `true`                   | Require claims to touch your own land         |

## 3. Install and seed

```bash
npm install
npm run seed
```

`seed` wipes the cells collection and rebuilds the grid from `GRID_COLS`/`GRID_ROWS`.
Run it again any time you change the grid size.

## 4. Run

```bash
npm run dev
```

This starts the API (`:4000`) and the Vite dev server (`:5173`) together. The client
proxies `/api` to the server, so you only need to open http://localhost:5173.

To run them separately:

```bash
npm run dev:server
npm run dev:client
```
