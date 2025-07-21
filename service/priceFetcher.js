// service/priceFetcher.js
const axios = require('axios');
const API_KEY = process.env.TWELVEDATA_API_KEY;

async function fetchPrice() {
  try {
    const response = await axios.get('https://api.twelvedata.com/time_series', {
      params: {
        symbol: 'EURJPY',      // এখানে স্ল্যাশ নেই, একসাথে লিখতে হবে
        interval: '1min',
        outputsize: 30,        // তোমার বাকি কোড অনুযায়ী ৩০ দরকার
        apikey: API_KEY,
      },
    });

    const data = response.data;
    console.log('[DEBUG] API response:', data);

    if (!data || !data.values || !Array.isArray(data.values)) {
      console.error('[❌] Invalid API response structure.');
      return null;
    }

    // Close price গুলো নিয়ে array বানাও
    const prices = data.values.map(point => parseFloat(point.close));
    return prices.reverse();

  } catch (error) {
    console.error('[❌] Price fetch error:', error.message);
    return null;
  }
}

module.exports = fetchPrice;
