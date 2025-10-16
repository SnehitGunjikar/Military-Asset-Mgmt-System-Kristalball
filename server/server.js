const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const path = require('path');

// Load all env vars
dotenv.config();

const app = express();

// Middleware
const allowedOrigins = (process.env.CORS_ORIGIN || '*')
  .split(',')
  .map((s) => s.trim());
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};
app.use(cors(corsOptions));
app.use(express.json());


const PORT = process.env.PORT || 5000;
async function start() {
  await connectDB();

  // Routes
  app.use('/api/auth', require('./routes/authRoutes'));
  app.use('/api/bases', require('./routes/baseRoutes'));
  app.use('/api/assets', require('./routes/assetRoutes'));
  app.use('/api/purchases', require('./routes/purchaseRoutes'));
  app.use('/api/transfers', require('./routes/transferRoutes'));
  app.use('/api/assignments', require('./routes/assignmentRoutes'));
  app.use('/api/expenditures', require('./routes/expenditureRoutes'));
  app.use('/api/dashboard', require('./routes/dashboardRoutes'));

  // Health check
  app.get('/health', (req, res) => res.json({ status: 'ok' }));

  // Optionally serve built client in production
  if (process.env.SERVE_CLIENT === 'true') {
    const distPath = path.join(__dirname, '..', 'client', 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
start();

