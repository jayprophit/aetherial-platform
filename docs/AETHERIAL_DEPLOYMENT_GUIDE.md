# AETHERIAL Platform - Deployment Guide

**Version:** 1.0.0  
**Date:** October 28, 2025  
**Status:** Production Ready

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Local Development](#local-development)
4. [Production Deployment](#production-deployment)
5. [Docker Deployment](#docker-deployment)
6. [Cloud Deployment](#cloud-deployment)
7. [Monitoring & Maintenance](#monitoring--maintenance)
8. [Troubleshooting](#troubleshooting)

---

## 🔧 Prerequisites

### Required Software
- **Node.js:** v18.x or higher
- **npm/pnpm:** Latest version
- **PostgreSQL:** v15 or higher
- **Redis:** v7 or higher
- **Docker:** v24 or higher (for containerized deployment)
- **Git:** Latest version

### Required Accounts
- **GitHub:** For code repository
- **Cloud Provider:** AWS/GCP/Azure (for production hosting)
- **Domain Registrar:** For custom domain
- **SSL Certificate:** Let's Encrypt or commercial

---

## 🌍 Environment Setup

### 1. Clone Repository

```bash
git clone https://github.com/jayprophit/aetherial-platform.git
cd aetherial-platform
```

### 2. Install Dependencies

```bash
# Install root dependencies
npm install

# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../src
npm install
```

### 3. Environment Variables

Create `.env` files in both `client` and `src` directories:

#### Client `.env`
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_WS_URL=http://localhost:3001
NEXT_PUBLIC_BLOCKCHAIN_RPC=http://localhost:8545
NEXT_PUBLIC_ENVIRONMENT=development
```

#### Server `.env`
```env
NODE_ENV=development
PORT=3001

# Database
DATABASE_URL=postgresql://aetherial:password@localhost:5432/aetherial

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

# Blockchain
BLOCKCHAIN_RPC_URL=http://localhost:8545
PRIVATE_KEY=your-blockchain-private-key

# AI Services
OPENAI_API_KEY=your-openai-api-key
ANTHROPIC_API_KEY=your-anthropic-api-key

# AWS (for file storage)
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_S3_BUCKET=aetherial-uploads
AWS_REGION=us-east-1

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-email-password

# Payment
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret
```

### 4. Database Setup

```bash
# Create database
createdb aetherial

# Run migrations
cd src
npm run migrate

# Seed database (optional)
npm run seed
```

---

## 💻 Local Development

### Start Development Servers

```bash
# Terminal 1: Start backend
cd src
npm run dev

# Terminal 2: Start frontend
cd client
npm run dev

# Terminal 3: Start blockchain node (optional)
npx hardhat node
```

### Access Application
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3001/api
- **API Docs:** http://localhost:3001/api/docs

---

## 🚀 Production Deployment

### 1. Build for Production

```bash
# Build frontend
cd client
npm run build

# Build backend
cd ../src
npm run build
```

### 2. Environment Variables (Production)

Update `.env` files with production values:

```env
# Client
NEXT_PUBLIC_API_URL=https://api.aetherial.io
NEXT_PUBLIC_WS_URL=wss://api.aetherial.io
NEXT_PUBLIC_ENVIRONMENT=production

# Server
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@prod-db.example.com:5432/aetherial
REDIS_URL=redis://prod-redis.example.com:6379
```

### 3. Start Production Servers

```bash
# Start backend
cd src
npm run start

# Start frontend
cd client
npm run start
```

---

## 🐳 Docker Deployment

### 1. Build Docker Images

```bash
# Build all services
docker-compose -f docker-compose.prod.yml build
```

### 2. Start Services

```bash
# Start all containers
docker-compose -f docker-compose.prod.yml up -d

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Stop services
docker-compose -f docker-compose.prod.yml down
```

### 3. Docker Commands

```bash
# Restart specific service
docker-compose restart backend

# Execute command in container
docker-compose exec backend npm run migrate

# View container status
docker-compose ps

# Remove volumes (WARNING: deletes data)
docker-compose down -v
```

---

## ☁️ Cloud Deployment

### AWS Deployment

#### 1. Setup AWS Resources

```bash
# Install AWS CLI
aws configure

# Create ECR repositories
aws ecr create-repository --repository-name aetherial-frontend
aws ecr create-repository --repository-name aetherial-backend

# Create RDS PostgreSQL instance
aws rds create-db-instance \
  --db-instance-identifier aetherial-db \
  --db-instance-class db.t3.medium \
  --engine postgres \
  --master-username aetherial \
  --master-user-password YOUR_PASSWORD \
  --allocated-storage 20

# Create ElastiCache Redis
aws elasticache create-cache-cluster \
  --cache-cluster-id aetherial-redis \
  --cache-node-type cache.t3.micro \
  --engine redis \
  --num-cache-nodes 1
```

#### 2. Deploy to ECS/Fargate

```bash
# Build and push images
docker build -t aetherial-frontend ./client
docker tag aetherial-frontend:latest AWS_ACCOUNT.dkr.ecr.REGION.amazonaws.com/aetherial-frontend:latest
docker push AWS_ACCOUNT.dkr.ecr.REGION.amazonaws.com/aetherial-frontend:latest

# Create ECS cluster
aws ecs create-cluster --cluster-name aetherial-cluster

# Create task definitions and services
# (Use AWS Console or CloudFormation templates)
```

### Google Cloud Platform

```bash
# Install gcloud CLI
gcloud init

# Create GKE cluster
gcloud container clusters create aetherial-cluster \
  --num-nodes=3 \
  --machine-type=n1-standard-2

# Deploy to GKE
kubectl apply -f k8s/
```

### Vercel (Frontend Only)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd client
vercel --prod
```

---

## 📊 Monitoring & Maintenance

### Health Checks

```bash
# Backend health
curl https://api.aetherial.io/health

# Frontend health
curl https://aetherial.io/api/health
```

### Logging

```bash
# View application logs
docker-compose logs -f backend

# View database logs
docker-compose logs -f postgres

# Export logs
docker-compose logs > logs.txt
```

### Backup Database

```bash
# Backup
pg_dump -h localhost -U aetherial aetherial > backup.sql

# Restore
psql -h localhost -U aetherial aetherial < backup.sql

# Automated backup (cron job)
0 2 * * * pg_dump -h localhost -U aetherial aetherial > /backups/aetherial-$(date +\%Y\%m\%d).sql
```

### Performance Monitoring

Tools to use:
- **New Relic:** Application performance monitoring
- **Datadog:** Infrastructure monitoring
- **Sentry:** Error tracking
- **LogRocket:** Session replay
- **Google Analytics:** User analytics

### Security

```bash
# Update dependencies
npm audit fix

# Scan for vulnerabilities
npm audit

# Update Docker images
docker-compose pull
docker-compose up -d
```

---

## 🔧 Troubleshooting

### Common Issues

#### 1. Database Connection Failed

```bash
# Check PostgreSQL is running
docker-compose ps postgres

# Check connection string
echo $DATABASE_URL

# Test connection
psql $DATABASE_URL
```

#### 2. Redis Connection Failed

```bash
# Check Redis is running
docker-compose ps redis

# Test connection
redis-cli ping
```

#### 3. Frontend Build Errors

```bash
# Clear cache
rm -rf .next node_modules
npm install
npm run build
```

#### 4. API 500 Errors

```bash
# Check backend logs
docker-compose logs backend

# Check environment variables
docker-compose exec backend env
```

#### 5. WebSocket Connection Issues

```bash
# Check nginx configuration
docker-compose exec nginx cat /etc/nginx/nginx.conf

# Test WebSocket
wscat -c wss://api.aetherial.io
```

### Performance Issues

```bash
# Check resource usage
docker stats

# Optimize database
psql -c "VACUUM ANALYZE;"

# Clear Redis cache
redis-cli FLUSHALL

# Restart services
docker-compose restart
```

---

## 📝 Deployment Checklist

### Pre-Deployment

- [ ] All tests passing
- [ ] Code reviewed and merged
- [ ] Environment variables configured
- [ ] Database migrations ready
- [ ] SSL certificates obtained
- [ ] Domain DNS configured
- [ ] Backup strategy in place

### Deployment

- [ ] Build production images
- [ ] Run database migrations
- [ ] Deploy backend services
- [ ] Deploy frontend
- [ ] Configure load balancer
- [ ] Setup monitoring
- [ ] Test all endpoints

### Post-Deployment

- [ ] Verify application is accessible
- [ ] Check all features working
- [ ] Monitor error rates
- [ ] Check performance metrics
- [ ] Verify backups running
- [ ] Update documentation
- [ ] Notify team

---

## 🔗 Useful Commands

```bash
# Check application status
docker-compose ps

# View real-time logs
docker-compose logs -f

# Restart all services
docker-compose restart

# Update and restart
git pull && docker-compose up -d --build

# Database backup
docker-compose exec postgres pg_dump -U aetherial aetherial > backup.sql

# Clear all data (WARNING)
docker-compose down -v

# Check disk usage
docker system df

# Clean up unused resources
docker system prune -a
```

---

## 📞 Support

- **Documentation:** https://docs.aetherial.io
- **GitHub Issues:** https://github.com/jayprophit/aetherial-platform/issues
- **Email:** support@aetherial.io
- **Discord:** https://discord.gg/aetherial

---

## 📄 License

Copyright © 2025 AETHERIAL Platform. All rights reserved.

---

**Last Updated:** October 28, 2025  
**Version:** 1.0.0  
**Maintained by:** AETHERIAL Development Team

