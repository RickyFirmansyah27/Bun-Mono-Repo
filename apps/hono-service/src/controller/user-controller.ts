import { BaseResponse, Logger } from '../helper';
import { getAllUsers, addUser, deleteUser } from '../service/user-service';
import { Context } from 'hono';

const contextLogger = 'UserController';
export const getUsersHandler = (c: Context) => {
  const users = getAllUsers();
  Logger.info(`${contextLogger} | getUser`, users);
  return BaseResponse(c, 'User created successfully', 'success', { users: users })
};


export const addUserHandler = async (c: Context) => {
  const body = await c.req.json<{ name: string; email: string }>();
  const user = addUser(body);
  return BaseResponse(c, 'User created successfully', 'created', { data: user });
};

export const deleteUserHandler = (c: Context) => {
  const id = parseInt(c.req.param('id'), 10);
  const deletedUser = deleteUser(id);
  if (deletedUser) {
    return BaseResponse(c, 'User delete successfully', 'success', { data: [] })
  }
  return BaseResponse(c, 'User delete successfully', 'internalServerError')
};
