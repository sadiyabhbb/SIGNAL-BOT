// 📦 signalEngine.js
module.exports = function generateSignal(prices) {
  // Ensure enough data
  if (prices.length < 20) return 'WAIT';

  const close = prices;

  // EMA Calculation (fast = 5, slow = 10)
  const ema = (data, period) => {
    const k = 2 / (period + 1);
    return data.reduce((acc, val, i) => {
      if (i === 0) return [val];
      acc.push(val * k + acc[i - 1] * (1 - k));
      return acc;
    }, []);
  };

  const fastEMA = ema(close, 5);
  const slowEMA = ema(close, 10);

  // RSI Calculation (period = 14)
  const calcRSI = (data, period = 14) => {
    let gains = 0, losses = 0;
    for (let i = 1; i <= period; i++) {
      const diff = data[i] - data[i - 1];
      if (diff >= 0) gains += diff;
      else losses -= diff;
    }

    let avgGain = gains / period;
    let avgLoss = losses / period;

    for (let i = period + 1; i < data.length; i++) {
      const diff = data[i] - data[i - 1];
      if (diff >= 0) {
        avgGain = (avgGain * (period - 1) + diff) / period;
        avgLoss = (avgLoss * (period - 1)) / period;
      } else {
        avgGain = (avgGain * (period - 1)) / period;
        avgLoss = (avgLoss * (period - 1) - diff) / period;
      }
    }

    const rs = avgGain / (avgLoss || 1);
    return 100 - 100 / (1 + rs);
  };

  const rsi = calcRSI(close);

  const latestFast = fastEMA[fastEMA.length - 1];
  const latestSlow = slowEMA[slowEMA.length - 1];

  // Signal logic
  if (latestFast > latestSlow && rsi < 70) return 'UP';
  if (latestFast < latestSlow && rsi > 30) return 'DOWN';
  return 'WAIT';
};
