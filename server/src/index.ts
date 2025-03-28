import dotenvFlow from 'dotenv-flow';
import 'reflect-metadata';
import { app } from './app';
import { initializeDataSource } from './db';
import { createDatabaseIfNotExists } from './utils/createDatabase';
import logger from './utils/logger';

dotenvFlow.config();
const PORT = process.env.PORT || 8888;

const startServer = async () => {
  try {
    await createDatabaseIfNotExists(process.env.DB_NAME || 'test_db');

    initializeDataSource()
      .then(async () => {
        logger.info('📦 Database connected successfully');

        app.listen(PORT, () => {
          logger.info(`🖧  Server is running on port ${PORT}`);

          const localURL = `http://localhost:${PORT}`;

          console.log(
            '\x1b[36m%s\x1b[0m',
            '   Express.js 🚀 Server running successfully'
          );
          console.log(`   - Local:        ${localURL}`);
          console.log('   ');
        });
      })
      .catch((error) => {
        logger.error('❌ Error connecting to database', {
          error: error.message,
        });
        process.exit(1);
      });
  } catch (error) {
    console.error('❌ Error starting server:', error);
    process.exit(1);
  }
};

startServer();
