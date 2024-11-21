import type { FastifyInstance } from "fastify";
import { getAllUsers, getUserById } from "../controller/userController";

const basePath = "/user";
const userRoute = async (fastify: FastifyInstance) => {
  fastify.get(`${basePath}`, getAllUsers);
  fastify.get(`${basePath}/:id`, getUserById);
};

export default userRoute;
