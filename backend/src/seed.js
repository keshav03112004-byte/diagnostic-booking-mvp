require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const seedDatabase = require('./utils/seedDatabase');

const run = async () => {
  await connectDB();
  await seedDatabase(true);
  await mongoose.disconnect();
  console.log('Done.');
};

run().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
