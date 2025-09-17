# Build stage
FROM node:20.11.1-alpine AS builder

WORKDIR /usr/src/app

# Install pnpm
RUN npm install -g pnpm@8.15.1

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
RUN pnpm run build

# Production stage
FROM node:20.11.1-alpine AS production

WORKDIR /usr/src/app

# Install pnpm
RUN npm install -g pnpm@8.15.1

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install only production dependencies
RUN pnpm install --prod --frozen-lockfile && pnpm store prune

# Copy built application from builder stage
COPY --from=builder /usr/src/app/dist ./dist

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001

# Change ownership of the app directory
RUN chown -R nestjs:nodejs /usr/src/app
USER nestjs

# Expose port
EXPOSE 4000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node dist/health-check.js || exit 1

# Start the application
CMD ["node", "dist/main"]