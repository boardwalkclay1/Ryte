// server/index.js
import express from "express";
import bodyParser from "body-parser";
import { WebSocketServer } from "ws";
import { PERFECT_SETUP, GOLDEN_RULES } from "./rules/config.js";
import { evaluatePerfectSetup } from "./rules/evaluator.js";

const app = express();
app.use(bodyParser.json());

const PORT = 4000;

// WebSocket server for pushing alerts to clients
const wss = new WebSocketServer({ port: 4001 });
const clients = new Set();

wss.on("connection", (ws) => {
  clients.add(ws);
  ws.on("close", () => clients.delete(ws));
});

function broadcast(event) {
  const payload = JSON.stringify(event);
  for (const ws of clients) {
    ws.send(payload);
  }
}

// Finnhub webhook endpoint
app.post("/finnhub-webhook", (req, res) => {
  const data = req.body; // depends on your Finnhub payload structure

  // Example: { symbol, price, volume, vwap, candle, time, ... }
  const result = evaluatePerfectSetup(data, PERFECT_SETUP, GOLDEN_RULES);

  if (result.isPerfectSetup) {
    broadcast({
      type: "PERFECT_SETUP_ALERT",
      symbol: data.symbol,
      time: data.time,
      details: result.details,
    });
  }

  res.status(200).json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`Signaling server listening on port ${PORT}`);
});
