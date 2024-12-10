import dotenv from 'dotenv';
dotenv.config();

import express, { Express } from 'express';
import { HttpLogger, Logger } from './helper';
import { DBConnection, PORT_SERVICE, rabbitMqConnection } from '@bun/utils';
import { routes } from './routes';

const app: Express = express();
const port = PORT_SERVICE.expressService;

// Middleware
app.use(HttpLogger);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
routes.forEach(route => {
    app.use(route.path, route.handler);
});

app.listen(port, async (): Promise<void> => {
  try {
    await DBConnection();
    await rabbitMqConnection();
      Logger.info(`[Express-Service] Server is running on port ${port}`);
  } catch (error) {
      if (error instanceof Error) {
          Logger.error(
              `Error starting server: Message: ${error.message} | Stack: ${error.stack}`
          );
      } else {
          Logger.error(`Error starting server: ${String(error)}`);
      }
  }
});

