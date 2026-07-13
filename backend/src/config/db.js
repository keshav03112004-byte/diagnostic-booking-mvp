const mongoose = require('mongoose');

let memoryServer = null;
let dbMode = 'unknown';

const startMemoryServer = async () => {
  const { MongoMemoryServer } = require('mongodb-memory-server');

  memoryServer = await MongoMemoryServer.create({
    instance: {
      dbName: 'diagnostic_booking',
      launchTimeout: 120000,
    },
    binary: {
      version: '7.0.14',
    },
  });

  return memoryServer.getUri();
};

const connectDB = async () => {
  const configuredUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/diagnostic_booking';
  const useMemory = configuredUri === 'memory';

  mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err.message);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('MongoDB disconnected — API database calls will fail until restart');
  });

  if (useMemory) {
    console.log('Using in-memory MongoDB (MONGODB_URI=memory)');
    const uri = await startMemoryServer();
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    dbMode = 'memory';
    console.log('MongoDB connected (in-memory)');
    return;
  }

  try {
    await mongoose.connect(configuredUri, { serverSelectionTimeoutMS: 5000 });
    dbMode = 'local';
    console.log('MongoDB connected (local)');
    return;
  } catch (err) {
    console.log(`Local MongoDB unavailable (${err.message})`);
    console.log('Falling back to in-memory database — data resets on restart.');
    console.log('For persistent data: run MongoDB locally, use Docker, or set MONGODB_URI=memory');

    await mongoose.disconnect().catch(() => {});

    const uri = await startMemoryServer();
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    dbMode = 'memory';
    console.log('MongoDB connected (in-memory)');
  }
};

const getDbStatus = async () => {
  const state = mongoose.connection.readyState;
  if (state !== 1) {
    return { ok: false, mode: dbMode, state };
  }

  try {
    await mongoose.connection.db.admin().ping();
    return { ok: true, mode: dbMode };
  } catch {
    return { ok: false, mode: dbMode, state };
  }
};

const stopMemoryServer = async () => {
  if (memoryServer) {
    await memoryServer.stop();
    memoryServer = null;
  }
};

module.exports = connectDB;
module.exports.getDbStatus = getDbStatus;
module.exports.stopMemoryServer = stopMemoryServer;
