#!/bin/bash

# Deploy Local Registry on All Nodes
# Run this script to setup registry on all nodes

set -e

NODES=(
    "10.8.132.162 computehci01"
    "10.8.132.163 computehci02" 
    "10.8.132.164 computehci03"
    "10.8.132.165 controller01"
    "10.8.132.166 controller02"
    "10.8.132.167 controller03"
)

SCRIPT_DIR="/home/kolla/openstack"
SETUP_SCRIPT="setup-local-registry.sh"

echo "=== Deploying Local Registry to All Nodes ==="

# Function to copy script to node and execute
deploy_to_node() {
    local ip=$1
    local hostname=$2
    
    echo "Deploying to ${hostname} (${ip})..."
    
    # Copy setup script
    scp ${SCRIPT_DIR}/${SETUP_SCRIPT} kolla@${ip}:/tmp/
    
    # Execute setup script
    ssh kolla@${ip} "chmod +x /tmp/${SETUP_SCRIPT} && sudo /tmp/${SETUP_SCRIPT}"
    
    echo "✅ Deployment to ${hostname} completed"
}

# Function to test registry connectivity
test_connectivity() {
    echo "Testing connectivity to all nodes..."
    
    for node in "${NODES[@]}"; do
        ip=$(echo $node | cut -d' ' -f1)
        hostname=$(echo $node | cut -d' ' -f2)
        
        if ssh kolla@${ip} "docker ps | grep local-registry" 2>/dev/null; then
            echo "✅ ${hostname}: Registry running"
        else
            echo "❌ ${hostname}: Registry not running"
        fi
    done
}

# Main execution
main() {
    echo "Starting cluster-wide registry deployment..."
    
    # Check if setup script exists
    if [[ ! -f "${SCRIPT_DIR}/${SETUP_SCRIPT}" ]]; then
        echo "❌ Setup script not found: ${SCRIPT_DIR}/${SETUP_SCRIPT}"
        exit 1
    fi
    
    # Deploy to all nodes
    for node in "${NODES[@]}"; do
        ip=$(echo $node | cut -d' ' -f1)
        hostname=$(echo $node | cut -d' ' -f2)
        
        deploy_to_node "$ip" "$hostname"
        echo ""
    done
    
    # Test connectivity
    test_connectivity
    
    echo ""
    echo "=== Cluster Deployment Complete ==="
    echo "Registry URL: http://10.8.132.165:5000"
    echo "Test with: curl http://10.8.132.165:5000/v2/_catalog"
    echo ""
    echo "Next steps:"
    echo "1. Run: sudo ${SCRIPT_DIR}/push-ceph-images.sh"
    echo "2. Configure cephadm to use local registry"
}

# Check if kolla user
if [[ "$(whoami)" != "kolla" ]]; then
    echo "This script should be run as kolla user"
    echo "Usage: ./deploy-registry-cluster.sh"
    exit 1
fi

# Check SSH connectivity
echo "Checking SSH connectivity to all nodes..."
for node in "${NODES[@]}"; do
    ip=$(echo $node | cut -d' ' -f1)
    hostname=$(echo $node | cut -d' ' -f2)
    
    if ! ssh -o ConnectTimeout=5 kolla@${ip} "echo 'SSH OK'" &>/dev/null; then
        echo "❌ Cannot SSH to ${hostname} (${ip})"
        echo "Please ensure SSH keys are properly configured"
        exit 1
    fi
done
echo "✅ SSH connectivity verified"

# Run main function
main
