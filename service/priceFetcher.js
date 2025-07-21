const axios = require('axios');
const API_KEY = process.env.TWELVEDATA_API_KEY;

async function fetchPrice() {
  try {
    const response = await axios.get('https://api.twelvedata.com/time_series', {
      params: {
        symbol: 'EUR/JPY',
        interval: '1min',
        outputsize: 5,
        apikey: API_KEY,
      },
    });

    const data = response.data;

    // 🛡️ Validate response
    if (!data || !data.values || !Array.isArray(data.values)) {
      console.error('[❌] Invalid API response:', data);
      return null;
    }

    // 🔄 Convert close prices to float
    const prices = data.values.map((point) => parseFloat(point.close));
    return prices.reverse(); // latest price at end

  } catch (error) {
    console.error('[❌] Price fetch error:', error.message);
    return null;
  }
}

module.exports = fetchPrice;
