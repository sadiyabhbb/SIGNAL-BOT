// 📦 auto-signal-bot/index.js
require('dotenv').config();
const express = require('express');
const fetchPrices = require('./services/priceFetcher');
const generateSignal = require('./signalEngine');
const sendTelegram = require('./services/sendTelegram');

const app = express();
const PORT = process.env.PORT || 3000;

const PAIR = 'EUR/JPY';
const INTERVAL_MS = 60000; // 1 minute

// Dummy route for Render health check
app.get('/', (req, res) => {
  res.send('🟢 Auto Signal Bot is running!');
});

// Start web server
app.listen(PORT, () => {
  console.log(`[🌐] Web service running on port ${PORT}`);
});

// Signal loop
async function mainLoop() {
  console.log(`\n[⏱️] Checking market at ${new Date().toLocaleTimeString()}`);
  const prices = await fetchPrices(PAIR);
  if (!prices || prices.length < 30) return console.log('[❌] Price fetch failed.');

  const signal = generateSignal(prices);
  console.log(`[📡] Signal for ${PAIR}: ${signal}`);

  if (signal !== 'WAIT') {
    const msg = `🟢 Signal: ${signal}\n📉 Pair: ${PAIR}\n⏱️ Timeframe: 1m\n🕒 Time: ${new Date().toLocaleTimeString()}`;
    await sendTelegram(msg);
  }
}

setInterval(mainLoop, INTERVAL_MS);
mainLoop();
