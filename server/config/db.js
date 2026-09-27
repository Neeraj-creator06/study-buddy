const mongoose = require('mongoose');

let mongod = null;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ai_studybuddy';

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 4000,
    });
    console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host}`);
  } catch (initialErr) {
    console.warn(`[MongoDB] Could not connect to primary URI (${uri}): ${initialErr.message}`);
    console.log('[MongoDB] Attempting in-memory MongoDB fallback for instant zero-config evaluation...');

    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongod = await MongoMemoryServer.create();
      const memUri = mongod.getUri();
      const conn = await mongoose.connect(memUri);
      console.log(`[MongoDB] In-Memory MongoDB running at: ${conn.connection.host} (Database: ${conn.connection.name})`);
    } catch (fallbackErr) {
      console.error('[MongoDB] Fatal: Could not establish MongoDB connection.', fallbackErr.message);
      console.info('Please set a valid MONGODB_URI in server/.env (e.g., MongoDB Atlas connection string).');
    }
  }

  mongoose.connection.on('disconnected', () => {
    console.warn('[MongoDB] Connection disconnected.');
  });

  mongoose.connection.on('error', (err) => {
    console.error('[MongoDB] Runtime error:', err.message);
  });
};

const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
    if (mongod) {
      await mongod.stop();
    }
    console.log('[MongoDB] Connection closed gracefully.');
  } catch (err) {
    console.error('[MongoDB] Error during disconnect:', err.message);
  }
};

module.exports = { connectDB, disconnectDB };
