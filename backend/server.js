const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const autoSeed = require('./seed/seedRunner');
const apiRoutes = require('./routes/api');

dotenv.config();

const app = express();

// Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Mount API routes
app.use('/api', apiRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    project: 'AI Knowledge Assistant – Reducing Unsupported Responses in Generative AI',
    status: 'Backend API Running',
    docs: '/api/health',
  });
});

const PORT = process.env.PORT || 5000;

// Initialize DB and server
const startServer = async () => {
  try {
    await connectDB();
    await autoSeed();
    
    if (process.env.NODE_ENV !== 'test' && !process.env.VERCEL) {
      app.listen(PORT, () => {
        console.log(`====================================================`);
        console.log(`AI Knowledge Assistant Backend Server running on port ${PORT}`);
        console.log(`Health check: http://localhost:${PORT}/api/health`);
        console.log(`====================================================`);
      });
    }
  } catch (error) {
    console.error('Failed to start server:', error);
  }
};

startServer();

module.exports = app;
