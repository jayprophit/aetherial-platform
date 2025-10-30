#!/bin/bash

# Aetherial Platform - Kubernetes Setup Script
# This script helps set up the Kubernetes environment for Aetherial Platform

set -euo pipefail

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if kubectl is installed
check_kubectl() {
    if ! command -v kubectl &> /dev/null; then
        echo -e "${RED}Error: kubectl is not installed. Please install kubectl first.${NC}"
        exit 1
    fi
    echo -e "${GREEN}✓ kubectl is installed${NC}"
}

# Check if the cluster is accessible
check_cluster() {
    if ! kubectl cluster-info &> /dev/null; then
        echo -e "${RED}Error: Unable to connect to Kubernetes cluster. Please configure your kubeconfig.${NC}"
        exit 1
    fi
    echo -e "${GREEN}✓ Connected to Kubernetes cluster${NC}"
    echo -e "Cluster: $(kubectl config current-context)"
}

# Create namespaces
create_namespaces() {
    echo -e "\n${YELLOW}Creating namespaces...${NC}"
    kubectl apply -f k8s/production/manifests/00-namespaces/namespaces.yaml
    echo -e "${GREEN}✓ Namespaces created${NC}"
}

# Setup database secrets
setup_database_secrets() {
    echo -e "\n${YELLOW}Setting up database secrets...${NC}"
    
    if [ ! -f ".env" ]; then
        echo -e "${YELLOW}Creating .env file with default values...${NC}"
        cat > .env <<EOL
# Database Configuration
POSTGRES_USER=postgres
POSTGRES_PASSWORD=$(openssl rand -hex 16)
POSTGRES_DB=aetherial

# Redis Configuration
REDIS_PASSWORD=$(openssl rand -hex 16)
EOL
        echo -e "${GREEN}✓ Created .env file with generated credentials${NC}"
    fi
    
    # Source the .env file
    set -a
    source .env
    set +a
    
    # Encode values to base64
    export POSTGRES_USER_BASE64=$(echo -n "$POSTGRES_USER" | base64)
    export POSTGRES_PASSWORD_BASE64=$(echo -n "$POSTGRES_PASSWORD" | base64)
    export POSTGRES_DB_BASE64=$(echo -n "$POSTGRES_DB" | base64)
    export REDIS_PASSWORD_BASE64=$(echo -n "$REDIS_PASSWORD" | base64)
    
    # Generate secrets from template
    envsubst < k8s/production/manifests/01-databases/secrets.yaml.template > k8s/production/manifests/01-databases/secrets.yaml
    
    # Apply secrets
    kubectl apply -f k8s/production/manifests/01-databases/secrets.yaml
    
    echo -e "${GREEN}✓ Database secrets configured${NC}"
}

# Deploy databases
deploy_databases() {
    echo -e "\n${YELLOW}Deploying databases...${NC}"
    
    # Apply PostgreSQL
    kubectl apply -f k8s/production/manifests/01-databases/postgresql-statefulset.yaml
    
    # Apply Redis
    kubectl apply -f k8s/production/manifests/01-databases/redis-deployment.yaml
    
    echo -e "${GREEN}✓ Databases deployed${NC}"
}

# Main function
main() {
    echo -e "${YELLOW}=== Aetherial Platform - Kubernetes Setup ===${NC}\n"
    
    check_kubectl
    check_cluster
    create_namespaces
    setup_database_secrets
    deploy_databases
    
    echo -e "\n${GREEN}✓ Setup completed successfully!${NC}"
    echo -e "\nNext steps:"
    echo -e "1. Check the status of your deployments with: kubectl get pods -n production"
    echo -e "2. Access the PostgreSQL database:"
    echo -e "   kubectl port-forward svc/postgresql 5432:5432 -n production"
    echo -e "3. Access Redis:"
    echo -e "   kubectl port-forward svc/redis 6379:6379 -n production"
}

# Run the main function
main
