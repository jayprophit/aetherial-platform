import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../server/app.module';
import { DataSource } from 'typeorm';
import * as request from 'supertest';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../server/users/entities/user.entity';

export class TestAppManager {
  private app: INestApplication;
  private moduleFixture: TestingModule;
  private dataSource: DataSource;
  private jwtService: JwtService;

  async initialize() {
    this.moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    this.app = this.moduleFixture.createNestApplication();
    this.dataSource = this.moduleFixture.get<DataSource>(DataSource);
    this.jwtService = this.moduleFixture.get<JwtService>(JwtService);

    await this.app.init();
    return this;
  }

  async close() {
    await this.app.close();
    await this.dataSource.destroy();
  }

  getHttpServer() {
    return this.app.getHttpServer();
  }

  getRepository<T>(entity: new () => T) {
    return this.dataSource.getRepository(entity);
  }

  // User management
  async createTestUser(userData: Partial<User> = {}) {
    const userRepository = this.getRepository(User);
    const defaultUser = {
      email: `test-${Date.now()}@example.com`,
      username: `testuser-${Date.now()}`,
      password: 'Test@1234',
      isVerified: true,
      ...userData,
    };

    return userRepository.save(userRepository.create(defaultUser));
  }

  // Authentication helpers
  async getAuthToken(user: Partial<User> = {}) {
    const testUser = await this.createTestUser(user);
    const payload = { 
      sub: testUser.id, 
      email: testUser.email 
    };
    
    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, { 
        expiresIn: '7d',
        secret: process.env.JWT_REFRESH_SECRET,
      }),
      user: testUser,
    };
  }

  // Request helpers
  getRequest() {
    return request(this.getHttpServer());
  }

  getAuthenticatedRequest(token: string) {
    return this.getRequest()
      .set('Authorization', `Bearer ${token}`);
  }

  // Database utilities
  async clearDatabase() {
    const entities = this.dataSource.entityMetadatas;
    for (const entity of entities) {
      const repository = this.dataSource.getRepository(entity.name);
      await repository.query(`DELETE FROM \"${entity.tableName}\" CASCADE;`);
    }
  }

  // Test lifecycle
  async before() {
    await this.initialize();
  }

  async after() {
    await this.close();
  }
}

export const createTestApp = async () => {
  const testApp = new TestAppManager();
  await testApp.initialize();
  return testApp;
};
