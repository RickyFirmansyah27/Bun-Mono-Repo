# Stage 1: Builder
FROM oven/bun:1 AS builder
WORKDIR /app

# Copy seluruh proyek termasuk semua packages dan apps
COPY . .

# Install dependencies
RUN bun install

# Build semua packages (misalnya `bun build` digunakan untuk membuild package)
RUN bun run build --filter=@bun/utils
RUN cd apps/auth-service && bun run build

# Stage 2: Runner (Production)
FROM oven/bun:1-slim AS runner
WORKDIR /app

# Copy hasil build dari packages dan auth-service
COPY --from=builder /app/packages/bun.utils/dist /app/node_modules/@bun/utils
COPY --from=builder /app/apps/auth-service/dist ./apps/auth-service/dist
COPY --from=builder /app/apps/auth-service/package.json ./apps/auth-service/

# Set up environment
ENV PORT=8101
EXPOSE 8101
CMD ["bun", "apps/auth-service/dist/index.js"]
