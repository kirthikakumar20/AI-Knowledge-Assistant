const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/AIKnowledgeAssistant';
  
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[MongoDB Connected] Host: ${conn.connection.host}, DB: ${conn.connection.name}`);
    return conn;
  } catch (err) {
    console.error(`[MongoDB Connection Error] ${err.message}`);
    // Don't crash process in cloud/preview environment, allow API to report health
    return null;
  }
};

module.exports = connectDB;
