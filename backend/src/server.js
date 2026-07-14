require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const express = require('express');
const cors = require('cors');
const path = require('path');
const { createServer: createViteServer } = require('vite');

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

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;
  const HOST = process.env.HOST || '0.0.0.0';
  const apiOnly = process.env.API_ONLY === '1' || process.env.API_ONLY === 'true';
  const clientOrigins = [
    process.env.CLIENT_URL,
    'http://localhost:3000',
    'http://localhost:5173',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5173',
  ].filter(Boolean);

  process.on('unhandledRejection', (err) => {
    console.error('Unhandled rejection:', err.message);
  });

  process.on('uncaughtException', (err) => {
    console.error('Uncaught exception:', err.message);
  });

  if (!process.env.JWT_SECRET) {
    console.warn('JWT_SECRET is not set — using a development fallback. Set it in backend/.env');
    process.env.JWT_SECRET = 'dev_jwt_secret_change_me';
  }

  try {
    await connectDB();
    await seedDatabase();
    await seedAdminAndCms();
  } catch (err) {
    console.error('Failed to start database:', err.message);
    process.exit(1);
  }

  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || clientOrigins.includes(origin)) {
          return callback(null, true);
        }
        return callback(null, true);
      },
      credentials: true,
    })
  );
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

  if (!apiOnly && process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else if (process.env.NODE_ENV === 'production') {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.use((err, _req, res, _next) => {
    console.error('API error:', err.message);
    res.status(500).json({ message: 'Internal server error' });
  });

  app.listen(PORT, HOST, () => {
    console.log(`API ready at http://${HOST}:${PORT}/api/health`);
    if (!apiOnly && process.env.NODE_ENV !== 'production') {
      console.log(`App ready at http://localhost:${PORT}`);
    }
  });

  const shutdown = async () => {
    await stopMemoryServer().catch(() => {});
    process.exit(0);
  };
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

startServer();
