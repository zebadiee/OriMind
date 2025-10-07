#!/bin/bash
# 🐳 OriMind Multi-Architecture Docker Build

echo "🚀 Building OriMind Docker images for multiple architectures..."

# Enable Docker BuildKit
export DOCKER_BUILDKIT=1

# Build for multiple architectures
docker buildx create --use --name orimind-builder || true

# Build and push multi-arch image
docker buildx build \
    --platform linux/amd64,linux/arm64,linux/arm/v7,linux/ppc64le,linux/s390x \
    --tag orimind/universal:latest \
    --tag orimind/universal:1.0.0 \
    --push \
    .

echo "✅ Multi-architecture Docker images built and pushed!"
echo "🐳 Pull with: docker pull orimind/universal:latest"
