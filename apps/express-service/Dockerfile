# Stage 1: Builder
FROM oven/bun:1 AS builder
WORKDIR /app

# Copy seluruh proyek termasuk packages
COPY . .

# Install dependencies
RUN bun install

# Build aplikasi
RUN cd apps/express-service && bun run build

# Stage 2: Runner (Production)
FROM oven/bun:1-slim AS runner
WORKDIR /app


COPY --from=builder /app/apps/express-service/dist ./apps/express-service/dist
COPY --from=builder /app/apps/express-service/package.json ./apps/express-service/

# Set up environment
ENV PORT=8001
EXPOSE 8001
CMD ["bun", "apps/express-service/dist/index.js"]