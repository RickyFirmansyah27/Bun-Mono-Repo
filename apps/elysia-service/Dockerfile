# Stage 1: Builder
FROM oven/bun:1 AS builder
WORKDIR /app

# Copy seluruh proyek termasuk semua packages dan apps
COPY . .

# Install dependencies
RUN bun install

# Build semua packages (misalnya `bun build` digunakan untuk membuild package)
RUN bun run build --filter=@bun/utils
RUN cd apps/elysia-service && bun run build

# Stage 2: Runner (Production)
FROM oven/bun:1-slim AS runner
WORKDIR /app

# Copy hasil build dari packages dan elysia-service
COPY --from=builder /app/packages/bun.utils/dist /app/node_modules/@bun/utils
COPY --from=builder /app/apps/elysia-service/dist ./apps/elysia-service/dist
COPY --from=builder /app/apps/elysia-service/package.json ./apps/elysia-service/

# Set up environment
ENV PORT=8001
EXPOSE 8001
CMD ["bun", "apps/elysia-service/dist/index.js"]
