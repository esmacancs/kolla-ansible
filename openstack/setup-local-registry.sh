#!/bin/bash

# Local Docker Registry Setup Script
# Run this on ALL nodes (controllers and computes)

set -e

# Variables
REGISTRY_IP="10.8.132.165"
REGISTRY_PORT="5000"
REGISTRY_URL="${REGISTRY_IP}:${REGISTRY_PORT}"

echo "=== Setting up Local Docker Registry ==="
echo "Registry URL: ${REGISTRY_URL}"

# Function to setup on registry node (controller01)
setup_registry_node() {
    echo "Setting up registry on $(hostname)..."
    
    # Create registry data directory
    sudo mkdir -p /var/lib/registry
    
    # Stop existing registry if running
    docker stop local-registry 2>/dev/null || true
    docker rm local-registry 2>/dev/null || true
    
    # Run local registry
    docker run -d \
        --name local-registry \
        --restart=always \
        -p ${REGISTRY_PORT}:5000 \
        -v /var/lib/registry:/var/lib/registry \
        registry:2
    
    echo "Registry started on $(hostname)"
}

# Function to setup Docker daemon on all nodes
setup_docker_config() {
    echo "Configuring Docker daemon on $(hostname)..."
    
    # Create Docker daemon config
    sudo tee /etc/docker/daemon.json <<EOF
{
  "insecure-registries": ["${REGISTRY_URL}"],
  "live-restore": true,
  "userland-proxy": false,
  "experimental": false
}
EOF
    
    # Restart and enable Docker
    sudo systemctl restart docker
    sudo systemctl enable docker
    
    echo "Docker configured on $(hostname)"
}

# Function to test registry
test_registry() {
    echo "Testing registry connectivity..."
    
    # Wait for registry to be ready
    sleep 5
    
    if curl -f http://${REGISTRY_URL}/v2/; then
        echo "✅ Registry is accessible"
    else
        echo "❌ Registry not accessible"
        return 1
    fi
}

# Function to pull and push test image
test_push_pull() {
    echo "Testing push/pull functionality..."
    
    # Pull test image
    docker pull alpine:latest
    
    # Tag for local registry
    docker tag alpine:latest ${REGISTRY_URL}/alpine:latest
    
    # Push to local registry
    docker push ${REGISTRY_URL}/alpine:latest
    
    # Clean local images
    docker rmi ${REGISTRY_URL}/alpine:latest alpine:latest 2>/dev/null || true
    
    # Pull from local registry
    docker pull ${REGISTRY_URL}/alpine:latest
    
    echo "✅ Push/pull test successful"
}

# Main execution
main() {
    echo "Starting local registry setup..."
    
    # Setup Docker config on all nodes
    setup_docker_config
    
    # Check if this is the registry node (controller01)
    if [[ "$(hostname)" == *"controller01"* ]]; then
        setup_registry_node
        test_registry
        
        if [[ "$1" == "--test" ]]; then
            test_push_pull
        fi
    else
        echo "Waiting for registry to be available..."
        sleep 10
        test_registry
    fi
    
    echo "=== Local Registry Setup Complete ==="
    echo "Registry available at: http://${REGISTRY_URL}"
    echo "Registry catalog: curl http://${REGISTRY_URL}/v2/_catalog"
}

# Check if running as root or with sudo
if [[ $EUID -ne 0 ]]; then
    echo "This script needs to be run with sudo privileges"
    echo "Usage: sudo $0 [--test]"
    exit 1
fi

# Run main function
main "$@"
