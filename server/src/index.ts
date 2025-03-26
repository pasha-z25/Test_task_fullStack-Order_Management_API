import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import 'express-async-errors';
import 'reflect-metadata';
import { initializeDataSource } from './db';
import { ordersRoutes, productsRoutes, usersRoutes } from './routes';
import { getRequestInfo } from './utils/helpers';
import logger from './utils/logger';

dotenv.config();

const corsOptions = {
  origin: ['http://localhost:3000', 'http://frontend_web:3000'],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

const PORT = process.env.PORT || 8888;
const app = express();

app.use(express.json());
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.get('/', function (_req, res) {
  res.send('Hello World');
});

app.use('/orders', ordersRoutes);
app.use('/users', usersRoutes);
app.use('/products', productsRoutes);

app.use((req: express.Request, res: express.Response) => {
  logger.warn('Route not found', { requestInfo: getRequestInfo(req) });
  res.status(404).json({ status: 'error', message: 'Route not found' });
});

app.use((err: any, req: express.Request, res: express.Response) => {
  logger.error('❌ Unhandled error', {
    error: err.message,
    requestInfo: getRequestInfo(req),
  });
  res.status(500).json({ status: 'error', message: 'Internal server error' });
});

initializeDataSource()
  .then(async () => {
    logger.info('📦 Database connected successfully');

    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);

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
    logger.error('❌ Error connecting to database', { error: error.message });
    process.exit(1);
  });
