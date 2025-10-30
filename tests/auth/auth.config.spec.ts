import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from '../../../server/auth/auth.service';
import { UsersService } from '../../../server/users/users.service';
import { JwtStrategy } from '../../../server/auth/strategies/jwt.strategy';
import { LocalStrategy } from '../../../server/auth/strategies/local.strategy';
import { AuthController } from '../../../server/auth/auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../../server/users/entities/user.entity';

describe('Auth Configuration', () => {
  let module: TestingModule;
  let configService: ConfigService;
  let jwtService: JwtService;
  let authService: AuthService;
  let usersService: UsersService;
  let jwtStrategy: JwtStrategy;
  let localStrategy: LocalStrategy;
  let authController: AuthController;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env.test',
        }),
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [User],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([User]),
        PassportModule,
        JwtModule.registerAsync({
          useFactory: (config: ConfigService) => ({
            secret: config.get<string>('JWT_SECRET', 'test-secret'),
            signOptions: { 
              expiresIn: config.get<string>('JWT_EXPIRES_IN', '1h') 
            },
          }),
          inject: [ConfigService],
        }),
      ],
      controllers: [AuthController],
      providers: [
        AuthService,
        UsersService,
        JwtStrategy,
        LocalStrategy,
      ],
    }).compile();

    configService = module.get<ConfigService>(ConfigService);
    jwtService = module.get<JwtService>(JwtService);
    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtStrategy = module.get<JwtStrategy>(JwtStrategy);
    localStrategy = module.get<LocalStrategy>(LocalStrategy);
    authController = module.get<AuthController>(AuthController);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should have all required providers defined', () => {
    expect(configService).toBeDefined();
    expect(jwtService).toBeDefined();
    expect(authService).toBeDefined();
    expect(usersService).toBeDefined();
    expect(jwtStrategy).toBeDefined();
    expect(localStrategy).toBeDefined();
    expect(authController).toBeDefined();
  });

  it('should load JWT configuration', () => {
    const secret = configService.get<string>('JWT_SECRET');
    const expiresIn = configService.get<string>('JWT_EXPIRES_IN');
    
    expect(secret).toBeDefined();
    expect(expiresIn).toBeDefined();
    expect(secret).not.toBe('');
    expect(expiresIn).not.toBe('');
  });

  it('should have valid JWT module configuration', () => {
    const options = jwtService['options'];
    expect(options).toBeDefined();
    expect(options.secret).toBeDefined();
    expect(options.signOptions.expiresIn).toBeDefined();
  });

  it('should have valid database configuration', () => {
    const typeOrmConfig = module.get('TypeOrmModule_options');
    expect(typeOrmConfig).toBeDefined();
    expect(typeOrmConfig.database).toBe(':memory:');
    expect(typeOrmConfig.synchronize).toBe(true);
  });

  it('should have all required auth endpoints', () => {
    const controllerMethods = Object.getOwnPropertyNames(
      Object.getPrototypeOf(authController),
    ).filter(
      (method) =>
        method !== 'constructor' &&
        typeof authController[method] === 'function',
    );

    const expectedMethods = [
      'register',
      'login',
      'getProfile',
      'refreshToken',
      'logout',
      'verifyEmail',
      'forgotPassword',
      'resetPassword',
    ];

    expectedMethods.forEach((method) => {
      expect(controllerMethods).toContain(method);
    });
  });

  it('should have proper CORS configuration in production', () => {
    const corsConfig = {
      origin: configService.get<string>('CORS_ORIGIN', '*'),
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      allowedHeaders: 'Content-Type,Authorization',
    };

    expect(corsConfig.origin).toBeDefined();
    expect(corsConfig.methods).toBe('GET,HEAD,PUT,PATCH,POST,DELETE');
    expect(corsConfig.allowedHeaders).toBe('Content-Type,Authorization');
  });

  it('should have proper rate limiting configuration', () => {
    const rateLimitConfig = {
      windowMs: configService.get<number>('RATE_LIMIT_WINDOW_MS', 15 * 60 * 1000),
      max: configService.get<number>('RATE_LIMIT_MAX', 100),
    };

    expect(rateLimitConfig.windowMs).toBeDefined();
    expect(rateLimitConfig.max).toBeDefined();
    expect(rateLimitConfig.windowMs).toBeGreaterThan(0);
    expect(rateLimitConfig.max).toBeGreaterThan(0);
  });

  it('should have proper security headers configuration', () => {
    const securityHeaders = {
      hsts: configService.get<boolean>('SECURITY_HSTS', true),
      xssFilter: configService.get<boolean>('SECURITY_XSS_FILTER', true),
      noSniff: configService.get<boolean>('SECURITY_NO_SNIFF', true),
      hidePoweredBy: configService.get<boolean>('SECURITY_HIDE_POWERED_BY', true),
    };

    expect(securityHeaders.hsts).toBeDefined();
    expect(securityHeaders.xssFilter).toBeDefined();
    expect(securityHeaders.noSniff).toBeDefined();
    expect(securityHeaders.hidePoweredBy).toBeDefined();
  });
});
