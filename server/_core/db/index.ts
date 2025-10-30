import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate as drizzleMigrate } from 'drizzle-orm/postgres-js/migrator';
import { Config } from '../config';
import * as schema from './schema';

// Create a single connection pool for the application
const connectionString = `postgres://${Config.database.connection.user}:${Config.database.connection.password}@${Config.database.connection.host}:${Config.database.connection.port}/${Config.database.connection.database}`;

// Create a postgres client
const client = postgres(connectionString, {
  max: Config.database.connection.pool?.max || 10,
  idle_timeout: 20,
  connection: {
    application_name: 'aetherial-platform',
  },
});

// Create the database instance with the schema
export const db = drizzle(client, { 
  schema, 
  logger: Config.isDevelopment 
});

// Helper function to execute transactions
export async function transaction<T>(
  callback: (tx: typeof db) => Promise<T>,
  maxRetries = 3
): Promise<T> {
  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await db.transaction(async (tx) => {
        try {
          return await callback(tx);
        } catch (error) {
          // If we get a serialization failure, we'll retry the transaction
          if (error instanceof Error && error.message.includes('could not serialize access')) {
            throw new RetryableError(error.message);
          }
          throw error;
        }
      });
    } catch (error) {
      lastError = error as Error;
      
      // Only retry on serialization failures
      if (!(error instanceof RetryableError) || attempt >= maxRetries) {
        break;
      }
      
      // Exponential backoff
      const delay = Math.min(100 * Math.pow(2, attempt), 1000);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError || new Error('Transaction failed');
}

// Helper function to close the database connection
export async function closeConnection(): Promise<void> {
  await client.end();
}

// Test the database connection
export async function testConnection(): Promise<boolean> {
  try {
    await client`SELECT 1`;
    console.log('✅ Database connection established successfully');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
}

// Run database migrations
export async function migrate() {
  try {
    console.log('Running database migrations...');
    
    // Ensure the migrations table exists
    await client`
      CREATE TABLE IF NOT EXISTS _migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        applied_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
      )
    `;
    
    // Run migrations using Drizzle's migrator
    await drizzleMigrate(db, { migrationsFolder: './drizzle' });
    
    console.log('✅ Database migrations completed successfully');
    return true;
  } catch (error) {
    console.error('❌ Database migration failed:', error);
    throw error;
  }
}

// Run database seeds
export async function seed() {
  console.log('Running database seeds...');
  
  try {
    // Check if seeds have already been run
    const result = await client`
      SELECT 1 FROM _migrations WHERE name = 'seeds_initial' LIMIT 1
    `;
    
    if (result.length === 0) {
      // Run your seed SQL files here
      // Example: await client.file('./drizzle/seeds/initial_seeds.sql');
      
      // Mark seeds as run
      await client`
        INSERT INTO _migrations (name) VALUES ('seeds_initial')
      `;
      
      console.log('✅ Database seeded successfully');
    } else {
      console.log('✅ Seeds already applied, skipping');
    }
    
    return true;
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    throw error;
  }
}

// Reset the database (use with caution!)
export async function reset() {
  if (Config.isProduction) {
    throw new Error('Cannot reset database in production');
  }
  
  const { host, port, user, password, database } = Config.database.connection;
  const connectionString = `postgres://${user}:${password}@${host}:${port}/postgres`;
  
  console.log('⚠️  Resetting database...');
  
  // Drop and recreate the database
  const client = postgres(connectionString);
  await client`DROP DATABASE IF EXISTS ${sql.raw(database)}`;
  await client`CREATE DATABASE ${sql.raw(database)}`;
  await client.end();
  
  console.log('✅ Database reset complete');
}

// Custom error class for retryable errors
class RetryableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RetryableError';
  }
}

// Re-export schema types for convenience
export * from './schema';

// Test the connection when this module is imported
if (process.env.NODE_ENV !== 'test') {
  testConnection().catch(console.error);
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('Closing database connection...');
  await closeConnection();
  console.log('Database connection closed');
  process.exit(0);
});

export default {
  db,
  transaction,
  closeConnection,
  testConnection,
  migrate,
  seed,
  reset,
};
