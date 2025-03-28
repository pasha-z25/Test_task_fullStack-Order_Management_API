import { AppDataSource } from '@/db';
import { createDatabaseIfNotExists } from '@/utils/createDatabase';
import dotenvFlow from 'dotenv-flow';

process.env.NODE_ENV = 'test';
dotenvFlow.config();

beforeAll(async () => {
  await createDatabaseIfNotExists(process.env.DB_NAME || 'mydb_test');
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
});

afterEach(async () => {
  const entities = AppDataSource.entityMetadatas;
  for (const entity of entities) {
    const repository = AppDataSource.getRepository(entity.name);
    await repository.query(`TRUNCATE TABLE "${entity.tableName}" CASCADE;`);
  }
});

afterAll(async () => {
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
  }
});
