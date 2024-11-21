import type { FastifyReply, FastifyRequest } from "fastify";
import { getUsers, getUser } from "../service/userService";

export const getAllUsers = async (req: FastifyRequest, reply: FastifyReply) => {
  const users = await getUsers();
  reply.send({ success: true, data: users });
};

export const getUserById = async (req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
  const { id } = req.params;
  const user = await getUser(Number(id));
  if (!user) {
    reply.status(404).send({ success: false, message: "User not found" });
  } else {
    reply.send({ success: true, data: user });
  }
};
