// 📦 services/sendTelegram.js
const axios = require('axios');
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const USER_ID = process.env.USER_ID;

module.exports = async function sendTelegram(message) {
  try {
    await axios.post(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
      chat_id: USER_ID,
      text: message,
      parse_mode: 'Markdown'
    });
    console.log('[📤] Signal sent to Telegram');
  } catch (err) {
    console.error('[❌] Telegram send error:', err.message);
  }
};
