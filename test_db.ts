import 'dotenv/config';
import { getDb } from './server/db';
import { users } from './db/schema';

async function testDbConnection() {
    console.log('Attempting to connect to the database...');
    const db = await getDb();
    if (db) {
        console.log('Database connection successful!');
        try {
            console.log('Attempting to query the users table...');
            const result = await db.select().from(users).limit(1);
            console.log('Successfully queried the users table:', result);
            process.exit(0);
        } catch (e) {
            console.error('Failed to query the database:', e);
            process.exit(1);
        }
    } else {
        console.error('Failed to get database connection. Make sure DATABASE_URL is set in your .env file.');
        process.exit(1);
    }
}

testDbConnection();

