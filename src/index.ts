import "dotenv/config";

import express from "express";
import http from "node:http";
import fs from "node:fs/promises";
import path from "path";
import morgan from "morgan";
import { WebSocket, WebSocketServer } from "ws";
import { redisPublish, redisSubscribe } from "./config/redis.js";
import { bidSchema, type ClientMessage, type ServerMessage } from "../shared/contracts.js";

const port = Number(process.env.PORT ?? 4000);
const REDIS_CHANNEL = process.env.REDIS_CHANNEL ?? "ws-Live-Auction";
const HIGHEST_BID_KEY = "auction:highest-bid";

const compareAndSetHighestBid = `
  local currentBid = redis.call("GET", KEYS[1])

  if not currentBid or tonumber(ARGV[1]) > tonumber(currentBid) then
    redis.call("SET", KEYS[1], ARGV[1])
    return 1
  end
  return 0
`;
const app = express();
app.use(express.json());
app.use(morgan("dev"));

const sendMessage = (socket: WebSocket, message: ServerMessage) => {
  socket.send(JSON.stringify(message));
};

app.get("/health", (_request, response) => {
  response.json({ status: "ok" });
});

// app.get("/", async (_request, response, next) => {
//   try {
//     const htmlFile = await fs.readFile(
//       path.resolve("./template/index.html"),
//       "utf-8",
//     );

//     response.type("html").send(htmlFile);
//   } catch (error) {
//     next(error);
//   }
// });

const server = http.createServer(app);
const webSocketServer = new WebSocketServer({ server });

redisSubscribe.subscribe(REDIS_CHANNEL);
redisSubscribe.on("message", (channel, message) => {
  if (channel == REDIS_CHANNEL) {
    webSocketServer.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message.toString());
      }
    });
  }
});

webSocketServer.on("connection", (socket) => {
  sendMessage(socket, { type: "CONNECTED" });

  socket.on("message", async (message) => {
    try {
      const request = JSON.parse(message.toString()) as ClientMessage;

      if (request.type !== "PLACE_BID") {
        return;
      }

      const validationResult = bidSchema.safeParse(request.payload);
      const userId = request.payload?.userId;

      if (!validationResult.success || typeof userId !== "string" || !userId) {
        sendMessage(socket, {
          type: "ERROR",
          message: validationResult.success
            ? "A valid user ID is required"
            : validationResult.error.issues[0].message,
        });
        return;
      }

      const { amount } = validationResult.data;
      const isHighestBid = await redisPublish.eval(
        compareAndSetHighestBid,
        1,
        HIGHEST_BID_KEY,
        amount.toString(),
      );

      if (isHighestBid === 1) {
        await redisPublish.publish(
          REDIS_CHANNEL,
          JSON.stringify({
            type: "NEW_BID",
            payload: {
              userId,
              amount,
              timestamp: Date.now(),
            },
          }),
        );
      } else {
        sendMessage(socket, {
          type: "BID_REJECTED",
          message: "Your bid must be higher than the current highest bid",
        });
      }
    } catch {
      sendMessage(socket, { type: "ERROR", message: "Invalid bid message" });
    }
  });
});

server.listen(port, () => {
  console.log(`Auction engine listening on port ${port}`);
});
