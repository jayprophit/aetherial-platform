# AETHERIAL Platform - Deployment Guide

> **Complete deployment instructions for the AETHERIAL unified platform**

## 🌐 Live Demo

**URL:** https://3000-ihmvhaeiufkzlikcc9xwu-f2ec0030.manusvm.computer

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Local Development Setup](#local-development-setup)
3. [Environment Configuration](#environment-configuration)
4. [Database Setup](#database-setup)
5. [Building for Production](#building-for-production)
6. [Deployment Options](#deployment-options)
7. [Post-Deployment](#post-deployment)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before deploying AETHERIAL, ensure you have the following installed:

### Required Software

- **Node.js** 22.x or higher
- **pnpm** 10.x or higher
- **MySQL** 8.0 or higher (or PostgreSQL 14+)
- **Git** for version control

### Optional Services

- **S3-compatible storage** (AWS S3, MinIO, etc.) for file uploads
- **Redis** for caching (optional, improves performance)
- **Docker** for containerized deployment

---

## Local Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/jayprophit/aetherial-platform.git
cd aetherial-platform
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` with your configuration (see [Environment Configuration](#environment-configuration)).

### 4. Set Up Database

```bash
# Run database migrations
pnpm db:push
```

### 5. Start Development Server

```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

---

## Environment Configuration

### Required Variables

```env
# Application
VITE_APP_ID=aetherial_platform
VITE_APP_TITLE="AETHERIAL Platform"
VITE_APP_LOGO="/images/logo.png"

# OAuth (if using external authentication)
VITE_OAUTH_PORTAL_URL=https://vida.butterfly-effect.dev
OAUTH_SERVER_URL=https://vidabiz.butterfly-effect.dev

# Database
DATABASE_URL=mysql://user:password@localhost:3306/aetherial

# Security
JWT_SECRET=your-super-secret-jwt-key-change-this

# Server
PORT=3000
```

### Optional Variables

```env
# AI Services
OPENAI_API_KEY=your-openai-api-key
ANTHROPIC_API_KEY=your-anthropic-api-key

# S3 Storage
S3_BUCKET=your-bucket-name
S3_REGION=us-east-1
S3_ACCESS_KEY=your-access-key
S3_SECRET_KEY=your-secret-key

# Analytics
VITE_ANALYTICS_ENDPOINT=https://analytics.example.com
VITE_ANALYTICS_WEBSITE_ID=your-website-id
```

---

## Database Setup

### MySQL Configuration

1. **Create Database:**

```sql
CREATE DATABASE aetherial CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. **Create User:**

```sql
CREATE USER 'aetherial_user'@'localhost' IDENTIFIED BY 'secure_password';
GRANT ALL PRIVILEGES ON aetherial.* TO 'aetherial_user'@'localhost';
FLUSH PRIVILEGES;
```

3. **Update DATABASE_URL:**

```env
DATABASE_URL=mysql://aetherial_user:secure_password@localhost:3306/aetherial
```

### PostgreSQL Configuration (Alternative)

1. **Create Database:**

```sql
CREATE DATABASE aetherial;
```

2. **Update DATABASE_URL:**

```env
DATABASE_URL=postgresql://user:password@localhost:5432/aetherial
```

### Run Migrations

```bash
pnpm db:push
```

---

## Building for Production

### 1. Build the Application

```bash
pnpm build
```

This creates:
- `dist/public/` - Frontend static files
- `dist/index.js` - Backend server bundle

### 2. Test Production Build

```bash
pnpm start
```

---

## Deployment Options

### Option 1: Traditional VPS/Server

#### Using PM2 (Recommended)

1. **Install PM2:**

```bash
npm install -g pm2
```

2. **Start Application:**

```bash
pm2 start dist/index.js --name aetherial
```

3. **Configure Auto-Restart:**

```bash
pm2 startup
pm2 save
```

4. **Monitor:**

```bash
pm2 monit
```

#### Using systemd

1. **Create Service File:**

```bash
sudo nano /etc/systemd/system/aetherial.service
```

2. **Add Configuration:**

```ini
[Unit]
Description=AETHERIAL Platform
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/aetherial-platform
ExecStart=/usr/bin/node dist/index.js
Restart=on-failure
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

3. **Enable and Start:**

```bash
sudo systemctl enable aetherial
sudo systemctl start aetherial
```

### Option 2: Docker Deployment

1. **Build Docker Image:**

```bash
docker build -t aetherial-platform .
```

2. **Run Container:**

```bash
docker run -d \
  --name aetherial \
  -p 3000:3000 \
  --env-file .env \
  aetherial-platform
```

3. **Using Docker Compose:**

```bash
docker-compose up -d
```

### Option 3: Cloud Platforms

#### Vercel (Frontend Only)

```bash
vercel deploy
```

#### Heroku

```bash
heroku create aetherial-platform
git push heroku main
```

#### DigitalOcean App Platform

1. Connect GitHub repository
2. Configure build settings:
   - Build Command: `pnpm build`
   - Run Command: `pnpm start`
3. Add environment variables
4. Deploy

#### AWS (EC2 + RDS)

1. Launch EC2 instance
2. Set up RDS MySQL database
3. Configure security groups
4. Deploy using PM2 or Docker

---

## Post-Deployment

### 1. Configure Reverse Proxy (Nginx)

```nginx
server {
    listen 80;
    server_name aetherial.example.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 2. Enable SSL (Let's Encrypt)

```bash
sudo certbot --nginx -d aetherial.example.com
```

### 3. Set Up Monitoring

- **Application Monitoring:** PM2, New Relic, or DataDog
- **Server Monitoring:** Prometheus + Grafana
- **Error Tracking:** Sentry
- **Uptime Monitoring:** UptimeRobot or Pingdom

### 4. Configure Backups

```bash
# Database backup script
#!/bin/bash
mysqldump -u aetherial_user -p aetherial > backup_$(date +%Y%m%d).sql
```

### 5. Performance Optimization

- Enable gzip compression
- Configure CDN (Cloudflare, AWS CloudFront)
- Set up Redis caching
- Optimize database indexes

---

## Troubleshooting

### Common Issues

#### Port Already in Use

```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>
```

#### Database Connection Failed

- Verify DATABASE_URL is correct
- Check database server is running
- Ensure user has proper permissions

#### Build Failures

```bash
# Clear cache and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
pnpm build
```

#### Memory Issues

Increase Node.js memory limit:

```bash
NODE_OPTIONS="--max-old-space-size=4096" pnpm build
```

### Logs

#### Development Logs

```bash
pnpm dev
```

#### Production Logs (PM2)

```bash
pm2 logs aetherial
```

#### Docker Logs

```bash
docker logs aetherial
```

---

## Performance Benchmarks

### Expected Performance

- **Page Load Time:** < 2 seconds
- **Time to Interactive:** < 3 seconds
- **API Response Time:** < 200ms
- **Concurrent Users:** 1000+ (with proper scaling)

### Optimization Tips

1. **Enable HTTP/2**
2. **Use CDN for static assets**
3. **Implement lazy loading**
4. **Optimize images** (WebP format)
5. **Enable browser caching**
6. **Minify CSS/JS**
7. **Use database connection pooling**

---

## Security Checklist

- [ ] Change default JWT_SECRET
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS properly
- [ ] Set up rate limiting
- [ ] Enable SQL injection protection
- [ ] Implement XSS protection
- [ ] Configure CSP headers
- [ ] Regular security updates
- [ ] Database backups
- [ ] Monitor error logs

---

## Scaling Strategies

### Horizontal Scaling

1. **Load Balancer** (Nginx, HAProxy)
2. **Multiple Application Instances**
3. **Shared Database** (RDS, managed MySQL)
4. **Shared File Storage** (S3)
5. **Redis for Session Storage**

### Vertical Scaling

1. **Upgrade server resources** (CPU, RAM)
2. **Optimize database queries**
3. **Implement caching**
4. **Use CDN**

---

## Support & Resources

- **GitHub Repository:** https://github.com/jayprophit/aetherial-platform
- **Documentation:** [docs/](./docs/)
- **Issues:** https://github.com/jayprophit/aetherial-platform/issues

---

## License

This project is proprietary and confidential.

---

**Last Updated:** October 27, 2025

**Built with ❤️ and ethereal energy** ✨

