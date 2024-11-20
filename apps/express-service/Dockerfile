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
RUN cd apps/express-service && bun run build

# Stage 2: Runner (Production)
FROM oven/bun:1-slim AS runner
WORKDIR /app

# Copy hanya file yang diperlukan untuk production
COPY --from=builder /app/apps/express-service/dist ./apps/express-service/dist

# Set up environment dan jalankan aplikasi
ENV PORT=8001
EXPOSE 8001
CMD ["bun", "apps/express-service/dist/index.js"]
