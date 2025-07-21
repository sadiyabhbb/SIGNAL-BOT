// 📦 services/priceFetcher.js
const axios = require('axios');

const API_KEY = process.env.TWELVEDATA_API_KEY || 'YOUR_DEMO_KEY_HERE';

module.exports = async function fetchPrices(pair = 'EUR/JPY') {
  try {
    const sym = pair.replace('/', '');
    const url = `https://api.twelvedata.com/time_series?symbol=${sym}&interval=1min&outputsize=30&apikey=${API_KEY}`;
    const res = await axios.get(url);
    const data = res.data.values;
    const closes = data.map(d => parseFloat(d.close)).reverse();
    return closes;
  } catch (err) {
    console.error('[❌] Price fetch error:', err.message);
    return null;
  }
};
