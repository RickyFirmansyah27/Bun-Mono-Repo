# Stage 1: Builder
FROM oven/bun:1 AS builder
WORKDIR /app

# Copy seluruh monorepo
COPY . .

# Upgrade semua dependensi ke versi terbaru
RUN bun add --upgrade

# Install semua dependensi
RUN bun install

# Build aplikasi
RUN cd apps/koa-service && bun run build

# Stage 2: Runner (Production)
FROM oven/bun:1-slim AS runner
WORKDIR /app

# Copy hanya file yang diperlukan untuk production
COPY --from=builder /app/apps/koa-service/dist ./apps/koa-service/dist

# Set up environment dan jalankan aplikasi
ENV PORT=8002
EXPOSE 8002
CMD ["bun", "apps/koa-service/dist/index.js"]
