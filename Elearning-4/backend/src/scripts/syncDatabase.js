import { sequelize } from '../models/index.js';
import dotenv from 'dotenv';

dotenv.config();

const syncDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established.');

    // Sync all models
    await sequelize.sync({ force: false, alter: true });
    console.log('✅ All models were synchronized successfully.');

    process.exit(0);
  } catch (error) {
    console.error('❌ Unable to sync database:', error);
    process.exit(1);
  }
};

syncDatabase();