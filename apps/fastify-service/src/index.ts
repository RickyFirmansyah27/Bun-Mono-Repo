import Fastify from "fastify";
import registerRoutes from "./routes";

const fastify = Fastify({ logger: true });

// Register all routes
registerRoutes(fastify);

// Start server
const start = async () => {
  try {
    await fastify.listen({ port: 8004 });
    console.log("[Fastify-Service] Server is running on port : 8004");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
