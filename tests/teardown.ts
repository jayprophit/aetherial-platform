import { db } from '../server/_core/db';

// Global test teardown
export default async function teardown() {
  try {
    // Close all database connections
    await db.end();
    
    // Any additional cleanup can go here
    console.log('Test teardown complete');
  } catch (error) {
    console.error('Error during test teardown:', error);
    process.exit(1);
  }
}
