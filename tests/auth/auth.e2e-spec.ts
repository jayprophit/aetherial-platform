import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../server/app.module';
import { DataSource, Repository } from 'typeorm';
import { User } from '../../server/users/entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { hash } from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let userRepository: Repository<User>;
  let jwtService: JwtService;
  let configService: ConfigService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    dataSource = moduleFixture.get<DataSource>(DataSource);
    userRepository = moduleFixture.get<Repository<User>>(getRepositoryToken(User));
    jwtService = moduleFixture.get<JwtService>(JwtService);
    configService = moduleFixture.get<ConfigService>(ConfigService);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    // Clear the database before each test
    await dataSource.synchronize(true);
  });

  describe('POST /auth/register', () => {
    it('should register a new user', async () => {
      const userData = {
        email: 'test@example.com',
        username: 'testuser',
        displayName: 'Test User',
        password: 'Test@1234',
        confirmPassword: 'Test@1234',
      };

      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data).toHaveProperty('tokens');
      expect(response.body.data.user.email).toBe(userData.email);
      expect(response.body.data.user.username).toBe(userData.username);
      expect(response.body.data.tokens).toHaveProperty('accessToken');
      expect(response.body.data.tokens).toHaveProperty('refreshToken');

      // Verify user is saved in the database
      const user = await userRepository.findOne({ where: { email: userData.email } });
      expect(user).toBeDefined();
      expect(user.email).toBe(userData.email);
      expect(user.username).toBe(userData.username);
      expect(user.password).not.toBe(userData.password); // Password should be hashed
    });

    it('should return 400 if email is already registered', async () => {
      const existingUser = {
        email: 'existing@example.com',
        username: 'existinguser',
        displayName: 'Existing User',
        password: 'Test@1234',
      };

      await userRepository.save({
        ...existingUser,
        password: await hash(existingUser.password, 10),
        isVerified: true,
      });

      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          ...existingUser,
          confirmPassword: existingUser.password,
        })
        .expect(400);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('already exists');
    });

    it('should return 400 if passwords do not match', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'test@example.com',
          username: 'testuser',
          displayName: 'Test User',
          password: 'Test@1234',
          confirmPassword: 'Different@1234',
        })
        .expect(400);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('Passwords do not match');
    });
  });

  describe('POST /auth/login', () => {
    const testUser = {
      id: uuidv4(),
      email: 'login@example.com',
      username: 'loginuser',
      displayName: 'Login User',
      password: 'Test@1234',
    };

    beforeEach(async () => {
      await userRepository.save({
        ...testUser,
        password: await hash(testUser.password, 10),
        isVerified: true,
      });
    });

    it('should log in with valid credentials', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        })
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data).toHaveProperty('tokens');
      expect(response.body.data.user.email).toBe(testUser.email);
      expect(response.body.data.tokens).toHaveProperty('accessToken');
      expect(response.body.data.tokens).toHaveProperty('refreshToken');
    });

    it('should return 401 with invalid credentials', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword',
        })
        .expect(401);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('Invalid credentials');
    });
  });

  describe('POST /auth/refresh', () => {
    let refreshToken: string;
    let testUser: User;

    beforeEach(async () => {
      testUser = await userRepository.save({
        email: 'refresh@example.com',
        username: 'refreshuser',
        displayName: 'Refresh User',
        password: await hash('Test@1234', 10),
        isVerified: true,
        refreshToken: 'valid-refresh-token',
      });

      refreshToken = jwtService.sign(
        { sub: testUser.id, email: testUser.email },
        {
          secret: configService.get('JWT_REFRESH_SECRET'),
          expiresIn: configService.get('JWT_REFRESH_EXPIRES_IN'),
        },
      );
    });

    it('should refresh access token with valid refresh token', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/refresh')
        .send({
          refreshToken,
        })
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('accessToken');
      expect(response.body.data).toHaveProperty('refreshToken');
    });

    it('should return 401 with invalid refresh token', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/refresh')
        .send({
          refreshToken: 'invalid-token',
        })
        .expect(401);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('Unauthorized');
    });
  });

  describe('POST /auth/logout', () => {
    let accessToken: string;
    let testUser: User;

    beforeEach(async () => {
      testUser = await userRepository.save({
        email: 'logout@example.com',
        username: 'logoutuser',
        displayName: 'Logout User',
        password: await hash('Test@1234', 10),
        isVerified: true,
        refreshToken: 'valid-refresh-token',
      });

      accessToken = jwtService.sign(
        { sub: testUser.id, email: testUser.email },
        {
          secret: configService.get('JWT_SECRET'),
          expiresIn: configService.get('JWT_EXPIRES_IN'),
        },
      );
    });

    it('should log out the user and clear refresh token', async () => {
      await request(app.getHttpServer())
        .post('/auth/logout')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      // Verify refresh token is cleared
      const updatedUser = await userRepository.findOne({ where: { id: testUser.id } });
      expect(updatedUser.refreshToken).toBeNull();
    });

    it('should return 401 without valid access token', async () => {
      await request(app.getHttpServer())
        .post('/auth/logout')
        .expect(401);
    });
  });
});
