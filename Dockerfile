# Use the official Bun image as base
FROM oven/bun:latest as base

# Set working directory
WORKDIR /app

# Copy package.json and bun.lock for dependency installation
COPY package.json bun.lock ./

# Install dependencies
RUN bun install --frozen-lockfile --force

# Copy source code
COPY . .

# Build the application
RUN bun run build

# Production stage
FROM oven/bun:latest as production

# Set working directory
WORKDIR /app

# Copy built application from build stage
COPY --from=base /app/.output /app/.output

# Copy package.json for runtime dependencies info
COPY --from=base /app/package.json /app/package.json

# Set environment to production
ENV NODE_ENV=production

# Expose port 3000
EXPOSE 3000

# Set the host to 0.0.0.0 to allow external connections
ENV HOST=0.0.0.0

# Start the application
CMD ["bun", "run", ".output/server/index.mjs"] 