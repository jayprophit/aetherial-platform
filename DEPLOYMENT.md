# Aetherial Platform - Complete VM Deployment Guide
## "Aetherial in a Box" - Self-Contained Platform

**Version:** 1.0  
**Last Updated:** October 27, 2025

---

## 📦 What's Included

This VM package contains everything you need to run the complete Aetherial platform:

### **Services:**
1. **Documentation Website** (Port 3000) - Complete research and planning docs
2. **PostgreSQL Database** (Port 5432) - With sample data
3. **Redis Cache** (Port 6379) - For sessions and real-time data
4. **Elasticsearch** (Port 9200) - Search engine
5. **MinIO Storage** (Port 9000/9001) - S3-compatible file storage
6. **Adminer** (Port 8080) - Database management UI
7. **Redis Commander** (Port 8081) - Redis management UI
8. **Portainer** (Port 9443) - Container management UI

### **Documentation:**
- 1,320+ platform research
- 50+ categories analyzed
- 222 chat extractions
- Master specification
- Implementation roadmap
- Architecture documents
- Governance framework

---

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose installed
- At least 4GB RAM available
- 10GB free disk space

### One-Command Deployment

```bash
docker-compose up -d
```

That's it! All services will start automatically.

---

## 🌐 Access Points

Once deployed, access the services at:

| Service | URL | Credentials |
|---------|-----|-------------|
| **Documentation** | http://localhost:3000 | None |
| **Database UI** | http://localhost:8080 | Server: postgres<br>User: aetherial<br>Pass: aetherial_dev_password |
| **Redis UI** | http://localhost:8081 | None |
| **Storage UI** | http://localhost:9001 | User: aetherial<br>Pass: aetherial_dev_password |
| **Container UI** | https://localhost:9443 | Create on first visit |
| **PostgreSQL** | localhost:5432 | User: aetherial<br>Pass: aetherial_dev_password |
| **Redis** | localhost:6379 | None |
| **Elasticsearch** | http://localhost:9200 | None |
| **MinIO API** | http://localhost:9000 | Access Key: aetherial<br>Secret: aetherial_dev_password |

---

## 📋 Service Management

### Start All Services
```bash
docker-compose up -d
```

### Stop All Services
```bash
docker-compose down
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f docs
docker-compose logs -f postgres
```

### Restart Services
```bash
docker-compose restart
```

### Check Status
```bash
docker-compose ps
```

---

## 🗄️ Database Access

### Using Adminer (Web UI)
1. Open http://localhost:8080
2. System: PostgreSQL
3. Server: postgres
4. Username: aetherial
5. Password: aetherial_dev_password
6. Database: aetherial

### Using Command Line
```bash
docker exec -it aetherial-db psql -U aetherial -d aetherial
```

### Sample Data Included
- Users (demo accounts)
- Posts (social media content)
- Courses (e-learning content)
- Products (e-commerce items)

---

## 📁 File Storage

### MinIO (S3-Compatible)
1. Open http://localhost:9001
2. Login with:
   - Username: aetherial
   - Password: aetherial_dev_password
3. Create buckets and upload files

### API Access
```bash
# Configure AWS CLI for MinIO
aws configure --profile minio
# AWS Access Key ID: aetherial
# AWS Secret Access Key: aetherial_dev_password
# Default region: us-east-1

# Create bucket
aws --profile minio --endpoint-url http://localhost:9000 s3 mb s3://my-bucket

# Upload file
aws --profile minio --endpoint-url http://localhost:9000 s3 cp file.txt s3://my-bucket/
```

---

## 🔍 Search Engine

### Elasticsearch
Access at http://localhost:9200

```bash
# Check cluster health
curl http://localhost:9200/_cluster/health

# Create index
curl -X PUT http://localhost:9200/my-index

# Index document
curl -X POST http://localhost:9200/my-index/_doc \
  -H 'Content-Type: application/json' \
  -d '{"title": "Test", "content": "Hello World"}'

# Search
curl http://localhost:9200/my-index/_search?q=hello
```

---

## 🐳 Container Management

### Portainer (Web UI)
1. Open https://localhost:9443
2. Create admin account on first visit
3. Manage all containers, images, volumes, networks

---

## 🔧 Configuration

### Environment Variables
Edit `docker-compose.yml` to customize:
- Ports
- Passwords
- Resource limits
- Volume paths

### Database Configuration
Edit `init-db.sql` to customize:
- Schema
- Sample data
- Indexes

### Web Server Configuration
Edit `nginx.conf` to customize:
- Caching
- Security headers
- Routing

---

## 📊 Resource Usage

### Minimum Requirements
- **CPU:** 2 cores
- **RAM:** 4GB
- **Disk:** 10GB

### Recommended
- **CPU:** 4 cores
- **RAM:** 8GB
- **Disk:** 20GB

### Production
- **CPU:** 8+ cores
- **RAM:** 16GB+
- **Disk:** 50GB+

---

## 🔒 Security Notes

### ⚠️ Development Mode
This package is configured for **development/demo** purposes with default passwords.

### 🛡️ For Production:
1. **Change all passwords** in `docker-compose.yml`
2. **Enable SSL/TLS** for all services
3. **Configure firewalls** to restrict access
4. **Use secrets management** (Docker secrets, Vault)
5. **Enable authentication** on all services
6. **Regular backups** of data volumes
7. **Keep images updated** (`docker-compose pull`)

---

## 💾 Backup & Restore

### Backup All Data
```bash
# Create backup directory
mkdir -p backups

# Backup PostgreSQL
docker exec aetherial-db pg_dump -U aetherial aetherial > backups/db_backup.sql

# Backup volumes
docker run --rm -v unified-platform-docs_postgres-data:/data -v $(pwd)/backups:/backup alpine tar czf /backup/postgres-data.tar.gz -C /data .
docker run --rm -v unified-platform-docs_redis-data:/data -v $(pwd)/backups:/backup alpine tar czf /backup/redis-data.tar.gz -C /data .
docker run --rm -v unified-platform-docs_minio-data:/data -v $(pwd)/backups:/backup alpine tar czf /backup/minio-data.tar.gz -C /data .
```

### Restore Data
```bash
# Restore PostgreSQL
docker exec -i aetherial-db psql -U aetherial aetherial < backups/db_backup.sql

# Restore volumes
docker run --rm -v unified-platform-docs_postgres-data:/data -v $(pwd)/backups:/backup alpine tar xzf /backup/postgres-data.tar.gz -C /data
```

---

## 🚀 Deployment Options

### 1. Local Development
```bash
docker-compose up -d
```

### 2. Cloud VM (AWS, Azure, GCP, DigitalOcean)
1. Provision VM with Docker installed
2. Copy this directory to VM
3. Run `docker-compose up -d`

### 3. Kubernetes
Convert to Kubernetes manifests:
```bash
kompose convert -f docker-compose.yml
kubectl apply -f .
```

### 4. Docker Swarm
```bash
docker stack deploy -c docker-compose.yml aetherial
```

---

## 📚 Documentation Structure

```
/docs/
├── AETHERIAL_MASTER_SPECIFICATION.md
├── IMPLEMENTATION_ROADMAP.md
├── PROJECT_STATUS.md
├── README.md
└── ai_research/
    ├── COMPLETE_PLATFORM_RESEARCH.md
    ├── ai_ml/
    ├── blockchain/
    ├── cloud/
    ├── databases/
    ├── security/
    ├── architecture/
    ├── vision/
    └── chat_extracts/
```

---

## 🐛 Troubleshooting

### Services Won't Start
```bash
# Check logs
docker-compose logs

# Check system resources
docker stats

# Restart services
docker-compose restart
```

### Port Conflicts
Edit `docker-compose.yml` and change port mappings:
```yaml
ports:
  - "3001:80"  # Change 3000 to 3001
```

### Permission Issues
```bash
# Fix volume permissions
sudo chown -R $USER:$USER .
```

### Out of Disk Space
```bash
# Clean up Docker
docker system prune -a --volumes

# Remove unused images
docker image prune -a
```

---

## 📞 Support

- **Documentation:** http://localhost:3000
- **GitHub:** https://github.com/jayprophit/aetherial-platform
- **Issues:** https://github.com/jayprophit/aetherial-platform/issues

---

## 📄 License

See LICENSE file in the repository.

---

## 🎉 Next Steps

1. ✅ Explore the documentation at http://localhost:3000
2. ✅ Check out the database UI at http://localhost:8080
3. ✅ Review the sample data
4. ✅ Start building your features
5. ✅ Read the Implementation Roadmap
6. ✅ Join the community

---

**Welcome to Aetherial Platform! 🚀**

*One Platform. One Community. One Humanity.*

