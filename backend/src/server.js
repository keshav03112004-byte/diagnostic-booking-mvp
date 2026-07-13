require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const { getDbStatus, stopMemoryServer } = require('./config/db');
const seedDatabase = require('./utils/seedDatabase');
const seedAdminAndCms = require('./utils/seedAdminAndCms');

const authRoutes = require('./routes/authRoutes');
const testRoutes = require('./routes/testRoutes');
const packageRoutes = require('./routes/packageRoutes');
const diseaseRoutes = require('./routes/diseaseRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const inquiryRoutes = require('./routes/inquiryRoutes');
const cmsRoutes = require('./routes/cmsRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '127.0.0.1';

process.on('unhandledRejection', (err) => {
  console.error('Unhandled rejection:', err.message);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err.message);
});

const start = async () => {
  try {
    await connectDB();
    await seedDatabase();
    await seedAdminAndCms();
  } catch (err) {
    console.error('Failed to start database:', err.message);
    console.error('Try: set MONGODB_URI=memory in backend/.env, or start MongoDB on port 27017.');
    process.exit(1);
  }

  app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
  app.use(express.json());
  app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

  app.get('/api/health', async (_req, res) => {
    const db = await getDbStatus();
    const status = db.ok ? 'ok' : 'degraded';
    res.status(db.ok ? 200 : 503).json({
      status,
      message: db.ok ? 'Diagnostic Booking API is running' : 'API up but database unavailable',
      db,
    });
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/tests', testRoutes);
  app.use('/api/packages', packageRoutes);
  app.use('/api/diseases', diseaseRoutes);
  app.use('/api/bookings', bookingRoutes);
  app.use('/api/inquiries', inquiryRoutes);
  app.use('/api/cms', cmsRoutes);
  app.use('/api/admin', adminRoutes);

  app.use((err, _req, res, _next) => {
    console.error('API error:', err.message);

    if (err.name === 'MongoServerSelectionError' || err.name === 'MongoNetworkError') {
      return res.status(503).json({
        message: 'Database unavailable. Restart the backend (npm run dev in backend/).',
      });
    }

    res.status(500).json({ message: 'Internal server error' });
  });

  const server = app.listen(PORT, HOST, () => {
    console.log(`Server running on http://${HOST}:${PORT}`);
    console.log(`Health:   http://${HOST}:${PORT}/api/health`);
    console.log(`Tests:    http://${HOST}:${PORT}/api/tests`);
    console.log(`Packages: http://${HOST}:${PORT}/api/packages`);
    console.log(`Admin:    http://${HOST}:${PORT}/api/admin`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`Port ${PORT} is already in use.`);
      console.error('Stop the other process, or set PORT to a different value in backend/.env');
      process.exit(1);
    }
    console.error('Server error:', err.message);
    process.exit(1);
  });

  const shutdown = async () => {
    console.log('\nShutting down...');
    server.close();
    await stopMemoryServer().catch(() => {});
    process.exit(0);
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
};

start();
