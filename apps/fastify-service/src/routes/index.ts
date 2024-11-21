import type { FastifyInstance } from "fastify";
import userRoute from "./userRoute";

const basePath = '/api/fastify'
const registerRoutes = async (fastify: FastifyInstance) => {
  fastify.register(userRoute, { prefix: basePath });
};

export default registerRoutes;
