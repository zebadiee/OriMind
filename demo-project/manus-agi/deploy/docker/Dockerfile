# 🌍 OriMind Universal Multi-Architecture Dockerfile
# Supports amd64, arm64, arm/v7, ppc64le, s390x

FROM node:18-alpine

# Install dependencies for multiple architectures
RUN apk add --no-cache \
    bash \
    curl \
    git \
    python3 \
    make \
    g++

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY package-universal.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application files
COPY . .

# Create non-root user
RUN addgroup -g 1001 -S orimind && \
    adduser -S orimind -u 1001

# Change ownership
RUN chown -R orimind:orimind /app
USER orimind

# Expose ports
EXPOSE 3000 3002 5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:3002/health || exit 1

# Start command
CMD ["node", "process-manager.js", "start"]
