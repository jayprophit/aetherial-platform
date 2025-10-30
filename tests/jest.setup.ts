import { Test } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables from .env.test
dotenv.config({ path: path.resolve(__dirname, '../.env.test') });

// Global test module setup
export const createTestModule = async () => {
  return await Test.createTestingModule({
    imports: [
      // Configuration
      ConfigModule.forRoot({
        isGlobal: true,
        envFilePath: '.env.test',
      }),
      
      // Database
      TypeOrmModule.forRootAsync({
        useFactory: () => ({
          type: 'postgres',
          host: process.env.DB_HOST || 'localhost',
          port: parseInt(process.env.DB_PORT, 10) || 5432,
          username: process.env.DB_USERNAME || 'postgres',
          password: process.env.DB_PASSWORD || 'postgres',
          database: process.env.DB_DATABASE || 'aetherial_test',
          entities: [path.join(__dirname, '../**/*.entity{.ts,.js}')],
          synchronize: true, // Only for testing
          dropSchema: true, // Clean database for each test run
        }),
      }),
      
      // Authentication
      JwtModule.registerAsync({
        useFactory: () => ({
          secret: process.env.JWT_SECRET || 'test-secret',
          signOptions: { 
            expiresIn: process.env.JWT_EXPIRES_IN || '1h' 
          },
        }),
      }),
      
      PassportModule.register({ defaultStrategy: 'jwt' }),
    ],
  }).compile();
};

// Global test hooks
beforeAll(async () => {
  // Any global setup before all tests
});

afterAll(async () => {
  // Any cleanup after all tests
  const moduleRef = await createTestModule();
  const dataSource = moduleRef.get<DataSource>(DataSource);
  await dataSource.destroy();
});

// Global test timeout
jest.setTimeout(30000);
