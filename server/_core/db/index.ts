import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './schema';

// Create the connection
const connection = await mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'aetherial',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
});

// Create the database instance
export const db = drizzle(connection, { schema, mode: 'default' });

export async function testConnection() {
  try {
    await connection.ping();
    console.log('✅ Database connection established successfully');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
}

// Test the connection when this module is imported
await testConnection();

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('Closing database connection...');
  await connection.end();
  console.log('Database connection closed');
  process.exit(0);
});

export default db;
