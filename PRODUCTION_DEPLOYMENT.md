# Production Deployment Guide

## Overview

This guide provides comprehensive instructions for deploying the AETHERIAL platform to production environments. The platform is designed for cloud deployment with support for various hosting providers.

## Prerequisites

Before deploying to production, ensure you have the following:

**Infrastructure Requirements**
- Server with at least 2GB RAM and 2 CPU cores (minimum)
- MySQL 8.0+ database server
- Node.js 22.x runtime environment
- SSL certificate for HTTPS
- Domain name configured with DNS

**Required Services**
- Stripe account for payment processing
- OpenAI API key for AI features
- Email service (SMTP) for transactional emails
- Cloud storage for file uploads (optional but recommended)

## Environment Configuration

Create a production `.env` file with the following variables:

```env
# Database Configuration
DATABASE_URL=mysql://user:password@host:3306/aetherial_production

# Authentication
JWT_SECRET=your-super-secure-random-string-min-32-chars

# Stripe Payment Processing
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# OpenAI API
OPENAI_API_KEY=sk-your_openai_api_key

# Email Configuration
SMTP_HOST=smtp.your-email-provider.com
SMTP_PORT=587
SMTP_USER=your-email@domain.com
SMTP_PASSWORD=your-email-password
SMTP_FROM=noreply@aetherial.com

# Application Configuration
NODE_ENV=production
PORT=3000
FRONTEND_URL=https://yourdomain.com
API_URL=https://api.yourdomain.com

# Security
CORS_ORIGIN=https://yourdomain.com
COOKIE_SECURE=true
COOKIE_SAME_SITE=strict
```

## Quick Deployment Steps

### 1. Clone and Install

```bash
git clone https://github.com/jayprophit/aetherial-platform.git
cd aetherial-platform
pnpm install --prod
```

### 2. Configure Environment

```bash
cp .env.example .env
# Edit .env with your production values
```

### 3. Setup Database

```bash
# Create database
mysql -u root -p -e "CREATE DATABASE aetherial_production"

# Run migrations
pnpm drizzle-kit push:mysql
```

### 4. Build Application

```bash
pnpm build
```

### 5. Start Production Server

```bash
# Using PM2 (recommended)
pm2 start server/index.js --name aetherial
pm2 save
pm2 startup

# Or using Node directly
NODE_ENV=production node server/index.js
```

## Deployment Options

### Option 1: Traditional VPS (DigitalOcean, Linode, AWS EC2)

**Setup Script:**
```bash
#!/bin/bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 22.x
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2
sudo npm install -g pm2 pnpm

# Clone and setup
git clone https://github.com/jayprophit/aetherial-platform.git
cd aetherial-platform
pnpm install --prod
pnpm build

# Start application
pm2 start server/index.js --name aetherial
pm2 save
pm2 startup
```

**Nginx Configuration:**
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    location / {
        root /var/www/aetherial-platform/dist;
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /ws {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

### Option 2: Docker Deployment

**Dockerfile:**
```dockerfile
FROM node:22-alpine AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

FROM node:22-alpine
WORKDIR /app
RUN npm install -g pnpm
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server ./server
COPY --from=builder /app/package.json ./
RUN pnpm install --prod
EXPOSE 3000
CMD ["node", "server/index.js"]
```

**Deploy:**
```bash
docker build -t aetherial-platform .
docker run -d -p 3000:3000 --env-file .env aetherial-platform
```

### Option 3: Cloud Platforms

**Vercel (Frontend):**
```bash
vercel --prod
```

**Railway (Full Stack):**
```bash
railway up
```

**Render:**
- Build Command: `pnpm build`
- Start Command: `pnpm start`

## Post-Deployment

### SSL Certificate (Let's Encrypt)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

### Monitoring

```bash
# PM2 monitoring
pm2 monit

# Logs
pm2 logs aetherial
```

### Backups

```bash
# Database backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mysqldump -u aetherial -p aetherial_production > /backups/aetherial_$DATE.sql
find /backups -name "aetherial_*.sql" -mtime +7 -delete
```

Add to crontab:
```bash
0 2 * * * /path/to/backup.sh
```

## Security Checklist

- [ ] Change all default passwords
- [ ] Enable HTTPS/SSL
- [ ] Configure firewall (UFW)
- [ ] Set up Fail2Ban
- [ ] Enable rate limiting
- [ ] Configure CORS properly
- [ ] Use environment variables for secrets
- [ ] Regular security updates
- [ ] Database backups configured
- [ ] Monitoring and alerts set up

## Performance Optimization

### Enable Caching

```bash
# Install Redis
sudo apt install redis-server
sudo systemctl enable redis-server
```

### Database Optimization

```sql
CREATE INDEX idx_posts_user ON posts(userId);
CREATE INDEX idx_posts_created ON posts(createdAt);
CREATE INDEX idx_products_seller ON products(sellerId);
```

### CDN Setup

Configure CloudFlare or AWS CloudFront for static assets.

## Troubleshooting

**Application Won't Start:**
- Check environment variables
- Verify database connection
- Review logs: `pm2 logs aetherial`

**Database Connection Errors:**
- Verify DATABASE_URL
- Check MySQL is running
- Test connection: `mysql -u aetherial -p`

**High Memory Usage:**
- Increase server RAM
- Optimize database queries
- Enable caching

## Support

- Documentation: https://docs.aetherial.com
- Support: support@aetherial.com
- GitHub: https://github.com/jayprophit/aetherial-platform

## Deployment Checklist

- [ ] Environment variables configured
- [ ] Database created and migrated
- [ ] SSL certificate installed
- [ ] Application built and deployed
- [ ] Reverse proxy configured
- [ ] Process manager set up
- [ ] Monitoring tools installed
- [ ] Backup system configured
- [ ] Firewall rules applied
- [ ] Performance optimization done
- [ ] Load testing completed

**Your AETHERIAL platform is now production-ready!** 🎉

