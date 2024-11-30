import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { spawn } from 'child_process';

const app = express();

// Start all services
const services = [
  { name: 'auth-service', port: 8100 },
  { name: 'express-service', port: 8001 },
  { name: 'hono-service', port: 8002 },
  { name: 'elysia-service', port: 8003 },
  { name: 'fastify-service', port: 8004 },
  { name: 'koa-service', port: 8005 },
];

services.forEach(({ name, port }) => {
  console.log(`Starting ${name} on port ${port}...`);
  spawn('bun', ['run', 'dev'], {
    cwd: `apps/${name}`,
    env: { ...process.env, PORT: port },
    stdio: 'inherit',
  });
});

// Proxy setup
const proxies = {
  '/auth': 'http://localhost:8100',
  '/express': 'http://localhost:8001',
  '/hono': 'http://localhost:8002',
  '/elysia': 'http://localhost:8003',
  '/fastify': 'http://localhost:8004',
  '/koa': 'http://localhost:8005',
};

Object.keys(proxies).forEach((path) => {
  app.use(
    path,
    createProxyMiddleware({
      target: proxies[path],
      changeOrigin: true,
      pathRewrite: (path) => path.replace(new RegExp(`^${path}`), ''),
    })
  );
});

// Root route
app.get('/', (req, res) => {
  res.send('API Gateway is running. Use /auth, /express, /hono, etc.');
});

// Start proxy server
const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});
