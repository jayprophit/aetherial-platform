# Aetherial Platform - Manus Integration Guide

## Overview
This document provides complete instructions for Manus to build and deploy the Aetherial Platform. It includes all necessary configurations, dependencies, and setup steps.

## Prerequisites

### 1. Infrastructure Requirements
- Kubernetes cluster (v1.22+)
- Container registry (DHub, ECR, GCR, or GHCR)
- DNS configuration for production domains
- SSL certificates (Let's Encrypt recommended)

### 2. Required Tools
- `kubectl` (v1.22+)
- `helm` (v3.8+)
- `docker` (v20.10+)
- `git` (v2.30+)

## Setup Instructions

### 1. Clone Repository
```bash
git clone https://github.com/jayprohit/aetherial-platform.git
cd aetherial-platform
```

### 2. Environment Configuration
Create `.env` file in the project root:
```env
# Kubernetes
KUBE_NAMESPACE=production
KUBE_CONFIG=~/.kube/config

# Container Registry
REGISTRY=ghcr.io
REGISTRY_USER=your-username
REGISTRY_PASSWORD=your-password

# Database
POSTGRES_PASSWORD=$(openssl rand -hex 16)
REDIS_PASSWORD=$(openssl rand -hex 16)

# API Configuration
API_SECRET_KEY=$(openssl rand -hex 32)
JWT_SECRET=$(openssl rand -hex 32)

# Monitoring
GRAFANA_ADMIN_PASSWORD=$(openssl rand -hex 16)
PROMETHEUS_ADMIN_PASSWORD=$(openssl rand -hex 16)
```

### 3. Deploy Dependencies

#### 3.1. Kubernetes Namespaces
```bash
kubectl apply -f whats_missing_and_needed/kubernetes/production/monitoring-namespace.yaml
kubectl apply -f whats_missing_and_needed/kubernetes/production/00-namespaces/
```

#### 3.2. Storage
```bash
# Create storage classes if not using a cloud provider
kubectl apply -f whats_missing_and_needed/kubernetes/production/storage/
```

#### 3.3. Monitoring Stack
```bash
# Deploy Prometheus
kubectl apply -f whats_missing_and_needed/kubernetes/production/prometheus-config.yaml
kubectl apply -f whats_missing_and_needed/kubernetes/production/prometheus-deployment.yaml

# Deploy Grafana
kubectl apply -f whats_missing_and_needed/kubernetes/production/grafana-config.yaml
```

### 4. Deploy Core Services

#### 4.1. Database Layer
```bash
# Deploy PostgreSQL
kubectl apply -f whats_missing_and_needed/kubernetes/production/postgresql-statefulset.yaml

# Deploy Redis
kubectl apply -f whats_missing_and_needed/kubernetes/production/redis-deployment.yaml
```

#### 4.2. Application Layer
```bash
# Deploy API
kubectl apply -f whats_missing_and_needed/kubernetes/production/api-deployment.yaml
kubectl apply -f whats_missing_and_needed/kubernetes/production/api-service.yaml

# Deploy Frontend
kubectl apply -f whats_missing_and_needed/kubernetes/production/frontend-deployment.yaml
kubectl apply -f whats_missing_and_needed/kubernetes/production/frontend-service.yaml
```

### 5. Configure Networking

#### 5.1. Ingress Controller
```bash
# Using Nginx Ingress
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm install nginx-ingress ingress-nginx/ingress-nginx \
  --namespace ingress-nginx \
  --create-namespace \
  --set controller.replicaCount=2 \
  --set controller.nodeSelector."kubernetes.io/os"=linux \
  --set defaultBackend.nodeSelector."kubernetes.io/os"=linux
```

#### 5.2. Ingress Resources
```bash
kubectl apply -f whats_missing_and_needed/kubernetes/production/ingress.yaml
```

### 6. Verify Deployment

#### 6.1. Check Pod Status
```bash
kubectl get pods --all-namespaces -w
```

#### 6.2. Check Services
```bash
kubectl get svc --all-namespaces
```

#### 6.3. Access Dashboards
- Grafana: `http://<ingress-ip>/grafana`
- Prometheus: `http://<ingress-ip>/prometheus`
- API: `http://<ingress-ip>/api`
- Frontend: `http://<ingress-ip>`

## CI/CD Integration

### 1. GitHub Actions Secrets
Add the following secrets to your GitHub repository:
- `KUBE_CONFIG`: Base64-encoded kubeconfig
- `REGISTRY_USER`: Container registry username
- `REGISTRY_PASSWORD`: Container registry password
- `SLACK_WEBHOOK_URL`: For deployment notifications

### 2. Workflow Triggers
- Push to `main` branch: Deploys to production
- Push to `develop` branch: Deploys to staging
- Pull requests: Runs tests and preview builds

## Maintenance

### 1. Backups
```bash
# Database backup
kubectl exec -n production <postgres-pod> -- pg_dump -U postgres aetherial > backup_$(date +%Y%m%d).sql

# Persistent volume backup
kubectl cp production/<pod-name>:/path/to/data ./backup/
```

### 2. Updates
```bash
# Update container images
kubectl set image deployment/aetherial-api api=ghcr.io/your-org/aetherial-api:latest -n production

# Rollback if needed
kubectl rollout undo deployment/aetherial-api -n production
```

## Troubleshooting

### Common Issues
1. **Pods in CrashLoopBackOff**
   ```bash
   kubectl logs -n production <pod-name> --previous
   kubectl describe pod -n production <pod-name>
   ```

2. **Network Issues**
   ```bash
   kubectl get networkpolicies --all-namespaces
   kubectl describe networkpolicy <policy-name> -n <namespace>
   ```

3. **Storage Issues**
   ```bash
   kubectl get pvc -n production
   kubectl describe pvc <pvc-name> -n production
   ```

## Support
For additional assistance, please refer to:
- [Documentation](docs/)
- [Troubleshooting Guide](docs/TROUBLESHOOTING.md)
- [API Reference](docs/API.md)

---
**Note:** Replace all placeholder values (enclosed in `<>`) with your actual configuration values before deployment.
