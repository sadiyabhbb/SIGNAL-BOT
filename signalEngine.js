// 📦 signalEngine.js
const { BollingerBands } = require('technicalindicators');

function ema(data, period) {
  const k = 2 / (period + 1);
  const out = [];
  data.forEach((v, i) => {
    if (i === 0) out.push(v);
    else out.push(v * k + out[i - 1] * (1 - k));
  });
  return out;
}

function rsi(data, period = 14) {
  let gains = 0, losses = 0;
  for (let i = 1; i <= period; i++) {
    const d = data[i] - data[i - 1];
    if (d > 0) gains += d; else losses -= d;
  }
  let avGain = gains / period, avLoss = losses / period;
  for (let i = period + 1; i < data.length; i++) {
    const d = data[i] - data[i - 1];
    if (d > 0) avGain = (avGain * (period - 1) + d) / period;
    else avLoss = (avLoss * (period - 1) - d) / period;
  }
  const rs = avGain / (avLoss || 1);
  return 100 - 100 / (1 + rs);
}

module.exports = function generateSignal(prices) {
  if (!prices || prices.length < 25) return 'WAIT';
  const ema5 = ema(prices, 5);
  const ema10 = ema(prices, 10);
  const lastEm5 = ema5[ema5.length - 1];
  const lastEm10 = ema10[ema10.length - 1];
  const lastRsi = rsi(prices);
  const bb = BollingerBands.calculate({ period: 20, stdDev: 2, values: prices });
  const lastBB = bb[bb.length - 1];

  const lastPrice = prices[prices.length - 1];

  if (lastEm5 > lastEm10 && lastRsi < 70 && lastPrice < lastBB.upper) return 'UP';
  if (lastEm5 < lastEm10 && lastRsi > 30 && lastPrice > lastBB.lower) return 'DOWN';
  return 'WAIT';
};
