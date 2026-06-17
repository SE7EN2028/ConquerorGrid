import http from "http";
import { config } from "./config.js";
import { connectDb } from "./database/connect.js";
import { createApp } from "./app.js";
import { attachSockets } from "./sockets/index.js";

async function start() {
  await connectDb(config.mongoUri);

  const app = createApp();
  const server = http.createServer(app);
  attachSockets(server);

  server.listen(config.port, () => console.log(`server on :${config.port}`));
}

start().catch((err) => {
  console.error(err);
  process.exit(1);
});
