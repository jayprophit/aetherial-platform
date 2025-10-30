import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../server/app.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { DataSource } from 'typeorm';
import * as request from 'supertest';
import { User } from '../server/users/entities/user.entity';
import { Role } from '../server/roles/entities/role.entity';
import { Permission } from '../server/permissions/entities/permission.entity';
import { UserRole } from '../server/user-roles/entities/user-role.entity';
import { RolePermission } from '../server/role-permissions/entities/role-permission.entity';
import { Repository } from 'typeorm';

export class TestApp {
  private app: INestApplication;
  private moduleFixture: TestingModule;
  private dataSource: DataSource;

  userRepository: Repository<User>;
  roleRepository: Repository<Role>;
  permissionRepository: Repository<Permission>;
  userRoleRepository: Repository<UserRole>;
  rolePermissionRepository: Repository<RolePermission>;

  async init() {
    this.moduleFixture = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env.test',
        }),
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          useFactory: (configService: ConfigService) => ({
            type: 'postgres',
            host: configService.get('DB_HOST', 'localhost'),
            port: configService.get('DB_PORT', 5432),
            username: configService.get('DB_USERNAME', 'postgres'),
            password: configService.get('DB_PASSWORD', 'postgres'),
            database: configService.get('DB_DATABASE', 'aetherial_test'),
            entities: [__dirname + '/../**/*.entity{.ts,.js}'],
            synchronize: true,
            dropSchema: true, // Clear database for each test run
          }),
          inject: [ConfigService],
        }),
        JwtModule.registerAsync({
          imports: [ConfigModule],
          useFactory: (configService: ConfigService) => ({
            secret: configService.get('JWT_SECRET', 'test-secret'),
            signOptions: { expiresIn: '1h' },
          }),
          inject: [ConfigService],
        }),
        AppModule,
      ],
    }).compile();

    this.app = this.moduleFixture.createNestApplication();
    this.dataSource = this.moduleFixture.get<DataSource>(DataSource);

    // Initialize repositories
    this.userRepository = this.dataSource.getRepository(User);
    this.roleRepository = this.dataSource.getRepository(Role);
    this.permissionRepository = this.dataSource.getRepository(Permission);
    this.userRoleRepository = this.dataSource.getRepository(UserRole);
    this.rolePermissionRepository = this.dataSource.getRepository(RolePermission);

    await this.app.init();
  }

  async close() {
    await this.app.close();
    await this.dataSource.destroy();
  }

  getHttpServer() {
    return this.app.getHttpServer();
  }

  // Helper methods for test data setup
  async createTestUser(overrides: Partial<User> = {}) {
    const defaultUser = {
      email: 'test@example.com',
      username: 'testuser',
      password: 'hashedpassword', // In a real test, you'd hash this
      isActive: true,
      isVerified: true,
      ...overrides,
    };
    
    return this.userRepository.save(this.userRepository.create(defaultUser));
  }

  async createTestRole(name: string, permissions: string[] = []) {
    const role = await this.roleRepository.save(
      this.roleRepository.create({ name, description: `${name} role` })
    );

    for (const permissionName of permissions) {
      let permission = await this.permissionRepository.findOne({ where: { name: permissionName } });
      
      if (!permission) {
        permission = await this.permissionRepository.save(
          this.permissionRepository.create({
            name: permissionName,
            description: `${permissionName} permission`,
          })
        );
      }

      await this.rolePermissionRepository.save(
        this.rolePermissionRepository.create({
          roleId: role.id,
          permissionId: permission.id,
        })
      );
    }

    return role;
  }

  async assignRoleToUser(userId: string, roleName: string) {
    const role = await this.roleRepository.findOne({ where: { name: roleName } });
    if (!role) {
      throw new Error(`Role ${roleName} not found`);
    }
    
    return this.userRoleRepository.save(
      this.userRoleRepository.create({
        userId,
        roleId: role.id,
      })
    );
  }

  // HTTP request helpers
  async login(credentials: { email: string; password: string }) {
    const response = await request(this.getHttpServer())
      .post('/auth/login')
      .send(credentials);
    
    return response.body.data.accessToken;
  }

  async getAuthenticatedRequest(token: string) {
    return request(this.getHttpServer())
      .get('')
      .set('Authorization', `Bearer ${token}`);
  }
}

export const setupTestApp = async () => {
  const testApp = new TestApp();
  await testApp.init();
  return testApp;
};
