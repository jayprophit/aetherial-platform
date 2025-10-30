import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { migrate } from 'drizzle-orm/mysql2/migrator';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function runMigrations() {
  try {
    console.log('🚀 Starting database migration...');
    
    // Create a connection without specifying the database first
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      port: parseInt(process.env.DB_PORT || '3306', 10),
      multipleStatements: true,
    });

    // Create the database if it doesn't exist
    const dbName = process.env.DB_NAME || 'aetherial';
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
    await connection.query(`USE \`${dbName}\`;`);
    
    console.log(`✅ Database ${dbName} is ready`);

    // Create Drizzle instance for migrations
    const db = drizzle(connection);
    
    // Run migrations
    const migrationsFolder = path.join(process.cwd(), 'drizzle', 'migrations');
    await migrate(db, { migrationsFolder });
    
    console.log('✅ Database migrations completed successfully');
    
    // Close the connection
    await connection.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Database migration failed:', error);
    process.exit(1);
  }
}

// Run the migrations
runMigrations();
