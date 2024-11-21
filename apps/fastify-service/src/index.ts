import Fastify from "fastify";
import registerRoutes from "./routes";
import { HttpLogger, Logger } from "./helper";
import { PORT_SERVICE } from '@bun/utils';

const fastify = Fastify();
const port = PORT_SERVICE.fastifyService;

fastify.addHook('onRequest', HttpLogger);

// Register all routes
registerRoutes(fastify);

// Start server
const start = async () => {
  try {
    await fastify.listen({ port: port });
    Logger.info(`[Fastify-Service] Server is running on port ${port}`);
  } catch (error) {
    if (error instanceof Error) {
      Logger.error(
        `Error starting server: Message: ${error.message} | Stack: ${error.stack}`
      );
    } else {
      Logger.error(`Error starting server: ${String(error)}`);
    }
  }
};

start();
