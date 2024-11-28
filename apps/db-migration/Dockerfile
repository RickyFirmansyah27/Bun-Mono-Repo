# Stage 1: Builder
FROM oven/bun:1 AS builder
WORKDIR /app

# Salin hanya file yang relevan dari konteks ./apps/db-migration
COPY package.json ./
COPY prisma ./prisma
COPY src ./src
COPY tsconfig.json ./

# Install dependencies
RUN bun install

# Build aplikasi
RUN bun run build

# Stage 2: Runner (Production)
FROM oven/bun:1-slim AS runner
WORKDIR /app

# Salin hasil build dan file yang relevan dari stage builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
COPY --from=builder /app/prisma ./prisma

# Set DATABASE_URL sebagai argumen lingkungan
ENV DATABASE_URL=postgresql://myapp_owner:MQuO3eoA6Lik@ep-steep-wave-a12ap90f-pooler.ap-southeast-1.aws.neon.tech/myapp?sslmode=require

# Jalankan migrasi saat kontainer dimulai
CMD ["bunx", "prisma", "migrate", "deploy"]