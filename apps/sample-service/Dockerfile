FROM oven/bun:1 as builder
WORKDIR /app
COPY package.json .
COPY bun.lockb .
RUN bun install --frozen-lockfile
COPY . .
RUN bun run build

FROM oven/bun:1-slim
WORKDIR /app
COPY --from=builder /app/dist /app/dist
COPY package.json .
COPY bun.lockb .
RUN bun install --production --frozen-lockfile

ENV PORT=3000
EXPOSE 3000
CMD ["bun", "run", "dist/index.js"]