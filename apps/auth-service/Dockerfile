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
RUN cd apps/auth-service && bun run build

# Stage 2: Runner (Production)
FROM oven/bun:1-slim AS runner
WORKDIR /app

# Copy hanya file yang diperlukan untuk production
COPY --from=builder /app/apps/auth-service/dist ./apps/auth-service/dist

# Set up environment dan jalankan aplikasi
ENV PORT=8000
EXPOSE 8000
CMD ["bun", "apps/auth-service/dist/index.js"]
