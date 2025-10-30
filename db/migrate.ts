import { Pool } from 'pg';
import { promises as fs } from 'fs';
import path from 'path';
import { config } from 'dotenv';

// Load environment variables
config({ path: path.resolve(process.cwd(), '.env') });

// Database connection configuration
const dbConfig = {
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'aetherial',
  password: process.env.DB_PASSWORD || 'postgres',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  ssl: process.env.NODE_ENV === 'production' 
    ? { rejectUnauthorized: false } 
    : false,
};

// Create a new pool of connections
const pool = new Pool(dbConfig);

// Function to read SQL files
async function readSqlFile(filePath: string): Promise<string> {
  try {
    return await fs.readFile(filePath, 'utf8');
  } catch (error) {
    console.error(`Error reading SQL file: ${filePath}`, error);
    process.exit(1);
  }
}

// Function to run migrations
async function runMigrations() {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // Create migrations table if it doesn't exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        executed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);
    
    // Get all migration files
    const migrationsDir = path.join(__dirname, 'migrations');
    const files = (await fs.readdir(migrationsDir))
      .filter(file => file.endsWith('.sql'))
      .sort();
    
    console.log(`Found ${files.length} migration(s) to run`);
    
    // Run each migration
    for (const file of files) {
      // Check if migration has already been run
      const result = await client.query(
        'SELECT id FROM migrations WHERE name = $1',
        [file]
      );
      
      if (result.rows.length === 0) {
        console.log(`Running migration: ${file}`);
        
        // Read and execute the migration file
        const migrationSql = await readSqlFile(path.join(migrationsDir, file));
        await client.query(migrationSql);
        
        // Record the migration
        await client.query(
          'INSERT INTO migrations (name) VALUES ($1)',
          [file]
        );
        
        console.log(`✅ Successfully applied migration: ${file}`);
      } else {
        console.log(`✓ Migration already applied: ${file}`);
      }
    }
    
    await client.query('COMMIT');
    console.log('🎉 All migrations completed successfully!');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

// Run the migrations
runMigrations().catch(console.error);
