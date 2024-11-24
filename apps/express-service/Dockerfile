# Base image dengan Bun dari Oven
FROM oven/bun:latest AS base

# Tahap builder: Menyiapkan proyek dan dependensi
FROM base AS builder
WORKDIR /app

# Salin semua file ke dalam container
COPY . .

# Instal dependensi menggunakan Bun
RUN bun install

# Build proyek dengan Turbo
RUN npx turbo prune --scope=express-service --docker

# Tahap installer: Menyiapkan aplikasi dengan dependensi lengkap
FROM base AS installer
WORKDIR /app

# Salin hasil prune dari builder
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/package-lock.json ./package-lock.json

# Instal dependensi untuk subproyek yang terisolasi
RUN bun install

# Salin kode aplikasi penuh dan file Turbo
COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json

# Bangun proyek menggunakan Turbo
RUN bun turbo build --filter=express-service...

# Tahap runner: Menyiapkan aplikasi untuk dijalankan
FROM base AS runner
WORKDIR /app

# Tambahkan pengguna non-root untuk keamanan
RUN addgroup --system --gid 1001 expressjs
RUN adduser --system --uid 1001 expressjs
USER expressjs

# Salin hasil build dari installer
COPY --from=installer /app .

# Jalankan aplikasi
CMD bun apps/express-service/dist/index.js
