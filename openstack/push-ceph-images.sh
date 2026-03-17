#!/bin/bash

# Ceph Container Images Push Script
# Run this on computehci01 after registry is setup

set -e

# Variables
REGISTRY_IP="10.8.132.165"
REGISTRY_PORT="5000"
REGISTRY_URL="${REGISTRY_IP}:${REGISTRY_PORT}"
CEPH_VERSION="squid"

echo "=== Pushing Ceph Images to Local Registry ==="
echo "Registry URL: ${REGISTRY_URL}"

# Ceph images to pull and push
CEPH_IMAGES=(
    "quay.io/ceph/ceph:${CEPH_VERSION}"
    "quay.io/ceph/ceph:${CEPH_VERSION}-latest"
    "quay.io/ceph/ceph:${CEPH_VERSION}-stable"
    "quay.io/ceph/ceph:${CEPH_VERSION}-devel"
)

# Function to pull, tag and push image
push_image() {
    local source_image=$1
    local target_image="${REGISTRY_URL}/$(echo $source_image | cut -d'/' -f3-)"
    
    echo "Processing: $source_image -> $target_image"
    
    # Pull source image
    echo "  Pulling: $source_image"
    docker pull $source_image
    
    # Tag for local registry
    echo "  Tagging: $target_image"
    docker tag $source_image $target_image
    
    # Push to local registry
    echo "  Pushing: $target_image"
    docker push $target_image
    
    # Clean up source image to save space
    docker rmi $source_image 2>/dev/null || true
    
    echo "  ✅ Completed: $target_image"
}

# Function to verify images in registry
verify_images() {
    echo "Verifying images in local registry..."
    curl -s http://${REGISTRY_URL}/v2/_catalog | jq .
    
    echo ""
    echo "Available Ceph images:"
    curl -s http://${REGISTRY_URL}/v2/ceph/tags/list | jq .
}

# Main execution
main() {
    echo "Starting Ceph images push..."
    
    # Check if registry is accessible
    if ! curl -f http://${REGISTRY_URL}/v2/; then
        echo "❌ Registry not accessible at http://${REGISTRY_URL}"
        echo "Please ensure registry is running first"
        exit 1
    fi
    
    echo "✅ Registry is accessible"
    
    # Process all Ceph images
    for image in "${CEPH_IMAGES[@]}"; do
        push_image "$image"
    done
    
    # Verify uploaded images
    verify_images
    
    echo ""
    echo "=== Ceph Images Push Complete ==="
    echo "Images available at: http://${REGISTRY_URL}/v2/ceph/tags/list"
    echo ""
    echo "Usage in cephadm:"
    echo "ceph config set global container_image ${REGISTRY_URL}/ceph/ceph:${CEPH_VERSION}"
}

# Check if running as root or with sudo
if [[ $EUID -ne 0 ]]; then
    echo "This script needs to be run with sudo privileges"
    echo "Usage: sudo $0"
    exit 1
fi

# Install jq if not present
if ! command -v jq &> /dev/null; then
    echo "Installing jq..."
    apt-get update && apt-get install -y jq
fi

# Run main function
main
