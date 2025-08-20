# Multi-stage Dockerfile for Typesense Next.js Application
FROM node:20-alpine AS base

# Install system dependencies and security updates
FROM base AS system-deps
RUN apk update && apk upgrade && \
    apk add --no-cache \
    libc6-compat \
    dumb-init \
    curl \
    jq && \
    rm -rf /var/cache/apk/*

# Install dependencies only when needed
FROM system-deps AS deps
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies with npm ci for faster, reproducible builds
RUN npm ci --only=production --ignore-scripts && \
    npm cache clean --force

# Install dev dependencies in a separate layer
FROM system-deps AS dev-deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --ignore-scripts && \
    npm cache clean --force

# Development image with hot reloading
FROM base AS development
WORKDIR /app

# Install system dependencies for development
RUN apk add --no-cache \
    libc6-compat \
    curl \
    jq

COPY --from=dev-deps /app/node_modules ./node_modules
COPY . .

# Create non-root user for development
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Change ownership
RUN chown -R nextjs:nodejs /app
USER nextjs

# Health check for development
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

EXPOSE 3000
ENV PORT=3000
ENV NODE_ENV=development
ENV NEXT_TELEMETRY_DISABLED=1

CMD ["npm", "run", "dev"]

# Build stage
FROM system-deps AS builder
WORKDIR /app

# Copy dependencies
COPY --from=dev-deps /app/node_modules ./node_modules

# Copy source code
COPY . .

# Set build environment
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Build application with optimization
RUN npm run build && \
    npm prune --production

# Production image
FROM base AS production
WORKDIR /app

# Install only essential system dependencies
RUN apk add --no-cache \
    dumb-init \
    curl \
    jq && \
    rm -rf /var/cache/apk/*

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy built application
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Set up proper permissions
RUN chown -R nextjs:nodejs /app

# Switch to non-root user
USER nextjs

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD curl -f http://localhost:$PORT/api/health || exit 1

# Environment variables
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Expose port
EXPOSE 3000

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["node", "server.js"]

# Testing stage
FROM system-deps AS testing
WORKDIR /app

COPY --from=dev-deps /app/node_modules ./node_modules
COPY . .

# Install additional testing dependencies
RUN npx playwright install --with-deps chromium

ENV NODE_ENV=test
ENV CI=true

# Run tests
CMD ["npm", "run", "test"]