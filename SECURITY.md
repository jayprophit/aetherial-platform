# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Security Features

### Authentication & Authorization
- JWT-based authentication with 7-day token expiration
- Bcrypt password hashing with 10 salt rounds
- Role-based access control (User, Business, Admin, Owner)
- API key authentication for IoT devices
- Session management with secure token storage

### Data Protection
- Password hashing before storage
- Secure API key generation for devices
- Environment variable protection for secrets
- HTTPS enforcement in production
- CORS configuration for API security

### API Security
- Authentication middleware for protected routes
- Admin-only route protection
- Owner-only route protection
- Input validation on all endpoints
- Rate limiting (recommended for production)
- SQL injection protection via Drizzle ORM

### Blockchain Security
- Digital signature verification for transactions
- Secure wallet key generation
- Transaction validation before mining
- Blockchain integrity validation
- Smart contract execution validation

### IoT Security
- Device authentication via API keys
- Device ownership validation
- Secure sensor data transmission
- User-based device access control
- Automation rule validation

### Known Vulnerabilities

#### Moderate Severity (2 remaining)
- **esbuild**: Versions <=0.24.2 have a vulnerability
  - Status: Indirect dependency via drizzle-kit and vitest
  - Impact: Development dependencies only
  - Mitigation: Does not affect production runtime
  - Resolution: Waiting for upstream package updates

### Security Best Practices

#### For Deployment
1. Set strong `JWT_SECRET` environment variable
2. Use HTTPS in production
3. Enable rate limiting
4. Configure CORS properly
5. Set secure cookie flags
6. Use environment variables for all secrets
7. Enable database connection pooling
8. Implement request logging
9. Set up monitoring and alerts
10. Regular dependency updates

#### For Development
1. Never commit `.env` files
2. Use strong passwords in development
3. Validate all user inputs
4. Sanitize database queries
5. Keep dependencies updated
6. Run security audits regularly
7. Review code for security issues
8. Use TypeScript for type safety

### Security Checklist

- [x] Password hashing implemented
- [x] JWT authentication implemented
- [x] Role-based access control
- [x] API authentication middleware
- [x] Environment variable protection
- [x] SQL injection protection
- [x] Input validation
- [x] Secure session management
- [x] Blockchain transaction validation
- [x] IoT device authentication
- [ ] Rate limiting (recommended)
- [ ] HTTPS enforcement (production)
- [ ] Security headers (production)
- [ ] Audit logging (recommended)
- [ ] Intrusion detection (recommended)

## Reporting a Vulnerability

If you discover a security vulnerability, please email security@aetherial.com with:

1. Description of the vulnerability
2. Steps to reproduce
3. Potential impact
4. Suggested fix (if any)

We will respond within 48 hours and provide updates every 7 days until resolved.

## Security Updates

Security updates are released as soon as fixes are available. Subscribe to repository notifications to stay informed.

## Compliance

### Data Protection
- User data encryption
- Secure password storage
- Data access controls
- Audit trails

### Privacy
- User consent management
- Data retention policies
- Right to deletion
- Data export capabilities

## Security Contacts

- Security Team: security@aetherial.com
- Bug Bounty: bounty@aetherial.com
- General: support@aetherial.com

