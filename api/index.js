const app = require('../backend/server');
const connectDB = require('../backend/config/db');
const autoSeed = require('../backend/seed/seedRunner');

let isConnected = false;

module.exports = async (req, res) => {
  if (!isConnected) {
    try {
      await connectDB();
      await autoSeed();
      isConnected = true;
    } catch (err) {
      console.error('Vercel serverless DB connect error:', err);
    }
  }
  return app(req, res);
};
