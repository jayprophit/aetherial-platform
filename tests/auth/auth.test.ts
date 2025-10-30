import request from 'supertest';
import { app } from '../../server/app';
import { db } from '../../server/_core/db';
import { users } from '../../server/_core/db/schema';
import { eq } from 'drizzle-orm';
import { hash } from 'bcryptjs';

const TEST_USER = {
  email: 'test@example.com',
  username: 'testuser',
  password: 'Test@1234',
  displayName: 'Test User',
};

describe('Authentication API', () => {
  // Clean up test data before and after tests
  beforeAll(async () => {
    // Ensure test user doesn't exist
    await db.delete(users).where(eq(users.email, TEST_USER.email));
  });

  afterAll(async () => {
    // Clean up after all tests
    await db.delete(users).where(eq(users.email, TEST_USER.email));
  });

  describe('POST /auth/register', () => {
    it('should register a new user', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send({
          email: TEST_USER.email,
          username: TEST_USER.username,
          password: TEST_USER.password,
          displayName: TEST_USER.displayName,
        })
        .expect(201);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.email).toBe(TEST_USER.email);
      expect(response.body.data.username).toBe(TEST_USER.username);
      expect(response.body.data).not.toHaveProperty('password');
    });

    it('should not register with duplicate email', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send({
          email: TEST_USER.email,
          username: 'anotheruser',
          password: 'Another@1234',
        })
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body.message).toContain('already exists');
    });
  });

  describe('POST /auth/login', () => {
    it('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          emailOrUsername: TEST_USER.email,
          password: TEST_USER.password,
        })
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('accessToken');
      expect(response.body.data.user.email).toBe(TEST_USER.email);
    });

    it('should not login with invalid password', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          emailOrUsername: TEST_USER.email,
          password: 'wrongpassword',
        })
        .expect(401);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body.message).toContain('Invalid credentials');
    });
  });

  describe('GET /auth/me', () => {
    let authToken: string;

    beforeAll(async () => {
      // Login to get token
      const response = await request(app)
        .post('/auth/login')
        .send({
          emailOrUsername: TEST_USER.email,
          password: TEST_USER.password,
        });
      
      authToken = response.body.data.accessToken;
    });

    it('should get current user with valid token', async () => {
      const response = await request(app)
        .get('/auth/me')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data.email).toBe(TEST_USER.email);
    });

    it('should not allow access without token', async () => {
      const response = await request(app)
        .get('/auth/me')
        .expect(401);

      expect(response.body).toHaveProperty('success', false);
    });
  });

  describe('POST /auth/refresh-token', () => {
    let refreshToken: string;

    beforeAll(async () => {
      // Login with remember me to get refresh token
      const response = await request(app)
        .post('/auth/login')
        .send({
          emailOrUsername: TEST_USER.email,
          password: TEST_USER.password,
          rememberMe: true,
        });
      
      refreshToken = response.headers['set-cookie']
        .find((cookie: string) => cookie.startsWith('refreshToken='))
        ?.split(';')[0]
        .split('=')[1];
    });

    it('should refresh access token with valid refresh token', async () => {
      const response = await request(app)
        .post('/auth/refresh-token')
        .set('Cookie', [`refreshToken=${refreshToken}`])
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('accessToken');
    });
  });

  describe('POST /auth/logout', () => {
    let authToken: string;

    beforeAll(async () => {
      // Login to get token
      const response = await request(app)
        .post('/auth/login')
        .send({
          emailOrUsername: TEST_USER.email,
          password: TEST_USER.password,
        });
      
      authToken = response.body.data.accessToken;
    });

    it('should logout and invalidate token', async () => {
      await request(app)
        .post('/auth/logout')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // Verify token is invalidated
      await request(app)
        .get('/auth/me')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(401);
    });
  });
});
