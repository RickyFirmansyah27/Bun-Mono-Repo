// src/index.ts
import express from 'express';
import { type Express } from 'express';

const app: Express = express();
const port = 3001;

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Express + Bun API' });
});

app.listen(port, () => {
  console.log(`⚡ Server is running at http://localhost:${port}`);
});
