import { Request, Response } from 'express';
import { BaseResponse, Logger } from '../helper';
import 'express-boom';

interface User {
  id: number;
  name: string;
  email: string;
}

// Sample in-memory users array to store users
const users: User[] = [
  { id: 1, name: 'John Doe', email: '' },
  { id: 2, name: 'Jane Smith', email: '' },
  { id: 3, name: 'Skyes', email: '' },
  { id: 4, name: 'Danny Alexandria', email: '' },
  { id: 5, name: 'Dennis Johnson', email: '' },
];

import { Context } from 'koa';

const contextLogger = 'UserController';
export const getUser = (ctx: Context) => {

  Logger.info(`${contextLogger} | getUser`, users);
  return BaseResponse(ctx, 'User fecthed successfully', 'success', { users: users })
};

export const getUserById = (ctx: Context) => {
  const { userId } = ctx.params;
  const data = users.find((user) => user.id === Number(userId));
  return BaseResponse(ctx, 'User fecthed successfully', 'success', { users: data })
};
