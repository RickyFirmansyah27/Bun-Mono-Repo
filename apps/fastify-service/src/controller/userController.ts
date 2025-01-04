import type { FastifyReply, FastifyRequest } from "fastify";
import { getUsers, getUser } from "../service/userService";
import { BaseResponse, Logger } from "../helper";

export const getAllUsers = async (req: FastifyRequest, reply: FastifyReply) => {
  const contextLogger = 'UserController';
  try {
    Logger.info(`${contextLogger} | getUser`);
    const users = await getUsers();
    Logger.info(`${contextLogger} | users: ${JSON.stringify(users)}`);
    return BaseResponse(reply, 'User fecth successfully', 'success', users);
  } catch (error) {
    Logger.error(`${contextLogger} | error: ${(error as Error).message}`);
    return BaseResponse(reply, 'error', 'internalServerError', null);
  }
};

export const getUserById = async (req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
  const { id } = req.params;
  const contextLogger = 'UserController';
  try {
    Logger.info(`${contextLogger} | getUser`, { id: id });
    const users = await getUser(Number(id));
    if (!users) {
      return BaseResponse(reply, 'User not found', 'notFound', null);
    }
    return BaseResponse(reply, 'User fecth successfully', 'success', users);
  } catch (error) {
    Logger.error(`${contextLogger} | error: ${(error as Error).message}`);
    return BaseResponse(reply, 'error', 'internalServerError', null);
  }
};
