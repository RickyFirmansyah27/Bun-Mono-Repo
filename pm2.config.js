module.exports = {
  apps: [
    {
      name: "auth-service",
      script: "./dist/index.js",
      cwd: "./apps/auth-service",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      },
    },
    {
      name: "hono-service",
      script: "./dist/index.js",
      cwd: "./apps/hono-service",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      },
    },
    {
      name: "elysia-service",
      script: "./dist/index.js",
      cwd: "./apps/elysia-service",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      },
    },
    {
      name: "express-service",
      script: "./dist/index.js",
      cwd: "./apps/express-service",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      },
    },
    {
      name: "fastify-service",
      script: "./dist/index.js",
      cwd: "./apps/fastify-service",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      },
    },
    {
      name: "koa-service",
      script: "./dist/index.js",
      cwd: "./apps/koa-service",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      },
    },
  ],
};
