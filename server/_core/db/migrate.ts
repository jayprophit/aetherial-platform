import { execSync } from 'child_process';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { db } from './index';
import { sql } from 'drizzle-orm';
import { Config } from '../config';
import fs from 'fs-extra';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const MIGRATIONS_DIR = join(process.cwd(), 'drizzle', 'migrations');
const SEEDS_DIR = join(process.cwd(), 'drizzle', 'seeds');

// Ensure migrations table exists
async function ensureMigrationsTable() {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS _migrations (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      applied_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
      UNIQUE(name)
    )
  `);
}

// Get list of applied migrations
async function getAppliedMigrations() {
  await ensureMigrationsTable();
  const result = await db.execute<{ name: string }>(sql`
    SELECT name FROM _migrations ORDER BY applied_at ASC, name ASC
  `);
  return result.rows.map(row => row.name);
}

// Get list of migration files
function getMigrationFiles() {
  if (!fs.existsSync(MIGRATIONS_DIR)) {
    return [];
  }
  return fs.readdirSync(MIGRATIONS_DIR)
    .filter(file => file.endsWith('.sql'))
    .sort();
}

// Apply a single migration
async function applyMigration(migrationName: string) {
  const migrationPath = join(MIGRATIONS_DIR, migrationName);
  const migrationSQL = await fs.readFile(migrationPath, 'utf8');
  
  await db.transaction(async (tx) => {
    // Execute the migration
    await tx.execute(sql.raw(migrationSQL));
    
    // Record the migration
    await tx.execute(sql`
      INSERT INTO _migrations (name) VALUES (${migrationName})
    `);
  });
  
  console.log(`✅ Applied migration: ${migrationName}`);
}

// Run all pending migrations
async function migrate() {
  try {
    console.log('🔍 Checking for pending migrations...');
    
    const appliedMigrations = await getAppliedMigrations();
    const migrationFiles = getMigrationFiles();
    const pendingMigrations = migrationFiles.filter(file => !appliedMigrations.includes(file));
    
    if (pendingMigrations.length === 0) {
      console.log('✅ Database is up to date');
      return;
    }
    
    console.log(`🔄 Found ${pendingMigrations.length} pending migrations`);
    
    for (const migration of pendingMigrations) {
      console.log(`🔄 Applying migration: ${migration}`);
      await applyMigration(migration);
    }
    
    console.log('🎉 All migrations applied successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run seed files
async function seed() {
  if (!fs.existsSync(SEEDS_DIR)) {
    console.log('No seed directory found');
    return;
  }
  
  const seedFiles = fs.readdirSync(SEEDS_DIR)
    .filter(file => file.endsWith('.sql'))
    .sort();
    
  if (seedFiles.length === 0) {
    console.log('No seed files found');
    return;
  }
  
  console.log(`🌱 Running ${seedFiles.length} seed files...`);
  
  for (const seedFile of seedFiles) {
    const seedPath = join(SEEDS_DIR, seedFile);
    const seedSQL = await fs.readFile(seedPath, 'utf8');
    
    try {
      await db.execute(sql.raw(seedSQL));
      console.log(`✅ Applied seed: ${seedFile}`);
    } catch (error) {
      console.error(`❌ Error applying seed ${seedFile}:`, error);
      throw error;
    }
  }
  
  console.log('🌱 Database seeded successfully!');
}

// Create a new migration file
function createMigration(name: string) {
  const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);
  const fileName = `${timestamp}_${name.replace(/[^a-zA-Z0-9_]/g, '_')}.sql`;
  const filePath = join(MIGRATIONS_DIR, fileName);
  
  fs.ensureDirSync(MIGRATIONS_DIR);
  fs.writeFileSync(filePath, '-- Add your SQL migration here\n');
  
  console.log(`📝 Created new migration: ${filePath}`);
  return filePath;
}

// Reset the database (use with caution!)
async function reset() {
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

// CLI interface
async function run() {
  const command = process.argv[2];
  
  switch (command) {
    case 'migrate':
      await migrate();
      break;
      
    case 'seed':
      await seed();
      break;
      
    case 'reset':
      await reset();
      break;
      
    case 'create':
      const name = process.argv[3];
      if (!name) {
        console.error('Please provide a name for the migration');
        process.exit(1);
      }
      createMigration(name);
      break;
      
    case 'status':
      const applied = await getAppliedMigrations();
      const all = getMigrationFiles();
      
      console.log('\nApplied migrations:');
      applied.forEach(m => console.log(`✅ ${m}`));
      
      const pending = all.filter(m => !applied.includes(m));
      console.log('\nPending migrations:');
      console.log(pending.length ? pending.map(m => `⏳ ${m}`).join('\n') : 'No pending migrations');
      
      break;
      
    default:
      console.log(`
Usage: pnpm db <command>

Commands:
  migrate     Apply all pending migrations
  seed        Run seed files
  reset       Reset the database (development only)
  create <name>  Create a new migration file
  status      Show migration status
`);
  }
  
  await closeConnection();
  process.exit(0);
}

// Run the CLI if this file is executed directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  run().catch(console.error);
}

export const Migrator = {
  migrate,
  seed,
  reset,
  createMigration,
  run,
};
