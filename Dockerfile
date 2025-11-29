# Multi-stage Dockerfile for production-ready Next.js app
# - Builder: installs all deps and runs `next build`
# - Runner: installs only production deps and runs the built app

# Builder stage
FROM node:20-alpine3.22 AS builder
WORKDIR /app

# Install dependencies (including dev) for build
COPY package*.json ./
RUN npm ci && \
		npm cache clean --force

# Copy source and build
COPY . .
RUN npm run build:standalone

# Runner stage
FROM node:20-alpine3.22 AS runner
WORKDIR /app

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy built output and public assets from builder and set ownership to nextjs:nodejs
COPY --from=builder --chown=nextjs:nodejs /app/dist ./dist

# Set production env
ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

# Switch to non-root user & Expose port
USER nextjs
EXPOSE 3000

# Use the standard Next start command
CMD ["node", "dist/server.js"]
