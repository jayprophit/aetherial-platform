import dotenv from 'dotenv';
import path from 'path';
import { db } from '../server/_core/db';

// Load environment variables from .env.test
const envPath = path.resolve(__dirname, '../.env.test');
dotenv.config({ path: envPath });

// Set test environment variables if not already set
process.env.NODE_ENV = 'test';
process.env.PORT = '0'; // Use random port for tests
process.env.JWT_SECRET = 'test-secret';

// Database configuration for tests
const TEST_DB_NAME = 'aetherial_test';

// Global test setup
beforeAll(async () => {
  // Ensure the test database exists
  await db.execute(sql`CREATE DATABASE IF NOT EXISTS ${sql.raw(TEST_DB_NAME)}`);
  
  // Run migrations on test database
  await migrate();
  
  // Run seed data
  await seed();
});

// Clean up after all tests
afterAll(async () => {
  // Close database connection
  await db.end();
});

// Reset database state between tests
afterEach(async () => {
  // Clean up test data
  await db.execute(sql`TRUNCATE TABLE sessions, refresh_tokens, user_roles CASCADE`);
  await db.execute(sql`DELETE FROM users WHERE email LIKE 'test%@example.com'`);
});

// Export test utilities
export const testRequest = request(app);

// Helper function to create a test user
export const createTestUser = async (userData: {
  email: string;
  username: string;
  password: string;
  isVerified?: boolean;
}) => {
  const hashedPassword = await hash(userData.password, 12);
  const [user] = await db
    .insert(users)
    .values({
      email: userData.email,
      username: userData.username,
      passwordHash: hashedPassword,
      isVerified: userData.isVerified ?? true,
      displayName: userData.username,
    })
    .returning();
  
  return user;
};

// Helper function to get auth token
export const getAuthToken = async (email: string, password: string) => {
  const response = await testRequest
    .post('/auth/login')
    .send({ emailOrUsername: email, password });
  
  return response.body.data.accessToken;
};
