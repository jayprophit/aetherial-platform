#!/bin/bash
set -e

# Load environment variables
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

# Set default values
export REGISTRY=${REGISTRY:-ghcr.io}
export IMAGE_REPO=${IMAGE_REPO:-aetherial-platform}
export VERSION=${VERSION:-latest}

# Create namespaces
kubectl apply -f kubernetes/production/manifests/00-namespaces/

# Deploy databases
kubectl apply -f kubernetes/production/manifests/01-databases/

# Wait for databases to be ready
kubectl wait --for=condition=ready pod -l app=postgres -n production --timeout=300s
kubectl wait --for=condition=ready pod -l app=redis -n production --timeout=300s

# Deploy application
kubectl apply -f kubernetes/production/manifests/02-application/

# Deploy networking
kubectl apply -f kubernetes/production/manifests/03-networking/

# Deploy monitoring
kubectl apply -f kubernetes/production/manifests/04-monitoring/

echo "Deployment complete!"
echo "API will be available at: https://api.aetherial.example.com"
echo "Web interface will be available at: https://app.aetherial.example.com"
