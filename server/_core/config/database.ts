import { Config } from './index';

export const databaseConfig = {
  development: {
    client: 'pg',
    connection: {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'aetherial_dev',
    },
    migrations: {
      directory: './drizzle/migrations',
      tableName: 'knex_migrations',
    },
    seeds: {
      directory: './drizzle/seeds',
    },
    pool: {
      min: 2,
      max: 10,
    },
  },
  test: {
    client: 'pg',
    connection: {
      host: process.env.TEST_DB_HOST || 'localhost',
      port: parseInt(process.env.TEST_DB_PORT || '5433', 10),
      user: process.env.TEST_DB_USER || 'postgres',
      password: process.env.TEST_DB_PASSWORD || 'postgres',
      database: process.env.TEST_DB_NAME || 'aetherial_test',
    },
    migrations: {
      directory: './drizzle/migrations',
    },
    seeds: {
      directory: './drizzle/seeds',
    },
  },
  production: {
    client: 'pg',
    connection: {
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432', 10),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: './drizzle/migrations',
      tableName: 'knex_migrations',
    },
  },
} as const;

export type DatabaseConfig = typeof databaseConfig;
export type Environment = keyof DatabaseConfig;
