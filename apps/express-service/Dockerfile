# Stage 1: Builder
FROM oven/bun:1 AS builder
WORKDIR /app

# Copy package files first for better caching
COPY package.json bun.lockb ./
COPY apps/express-service/package.json ./apps/express-service/
COPY packages/utils/package.json ./packages/utils/

# Install dependencies
RUN bun install

# Copy the rest of the source code
COPY . .

# Build utils package first
RUN cd packages/utils && bun run build

# Build express service
RUN cd apps/express-service && bun run build

# Stage 2: Runner (Production)
FROM oven/bun:1-slim AS runner
WORKDIR /app

# Copy only the necessary files for production
COPY --from=builder /app/apps/express-service/dist ./apps/express-service/dist
COPY --from=builder /app/apps/express-service/package.json ./apps/express-service/

# Set up environment and run the application
ENV PORT=8001
EXPOSE 8001
CMD ["bun", "apps/express-service/dist/index.js"]