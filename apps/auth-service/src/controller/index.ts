import { IHandler, Context } from 'baojs';
import { BaseResponse } from '../helper';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import sql from '../db';
import AuthServices from '../services';
import { config } from 'dotenv';
import path from 'path';
const envPath = path.resolve(__dirname, '../../.env');
config({ path: envPath });

const secret = process.env.JWT_SECRET;
const jwtExpired = process.env.JWT_EXPIRED;
const jwtIssuer = process.env.JWT_ISSUER;
const jwtAudience = process.env.JWT_CLIENT;

// Helper untuk validasi input
const validateBody = (body: any, requiredFields: string[]) => {
  for (const field of requiredFields) {
    if (!body[field]) {
      throw new Error(`${field} is required`);
    }
  }
};

const indexController: IHandler = (ctx: Context) => {
  return BaseResponse(ctx, 'Auth service', 'success', {
    message: 'Hello from Auth service 🚀🚀🚀',
  });
};

const getAllUsersController: IHandler = async (ctx: Context) => {
  try {
    const users = await AuthServices.getAllUsers();

    return BaseResponse(ctx, 'Get all users', 'success', users);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return BaseResponse(ctx, message, 'badRequest', null);
  }
};

const gerUserDetailController: IHandler = async (ctx: Context) => {
  try {
    const user = await AuthServices.getUserDetail(ctx.params.id);
    if (!user.length) {
      return BaseResponse(ctx, 'User not found', 'notFound', null);
    }
    return BaseResponse(ctx, 'Get user detail', 'success', user[0]);
  } catch (error) {
    return BaseResponse(
      ctx,
      'Error on get user detail',
      'internalServerError',
      null
    );
  }
};

const registerController: IHandler = async (ctx: Context) => {
  try {
    const body = (await ctx.req.json()) as any;
    validateBody(body, ['username', 'password']);

    const hash = crypto.createHash('sha256');
    hash.update(body.password);
    const hashedPassword = hash.digest('hex');

    const user = await AuthServices.createUser(body.username, hashedPassword);

    return BaseResponse(ctx, 'Register success', 'success', user);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return BaseResponse(ctx, message, 'badRequest', null);
  }
};

const loginController: IHandler = async (ctx: Context) => {
  try {
    const body = (await ctx.req.json()) as any;
    validateBody(body, ['username', 'password']);

    const user = await AuthServices.getUserByName(body.username);
    if (!user.length) {
      throw new Error('User not found');
    }

    const hash = crypto.createHash('sha256');
    hash.update(body.password);
    const hashedPassword = hash.digest('hex');

    if (user[0].password !== hashedPassword) {
      throw new Error('Invalid password');
    }

    const token = jwt.sign({ name: body.name }, secret as string, {
      expiresIn: jwtExpired,
      issuer: jwtIssuer,
      audience: jwtAudience,
    });

    return BaseResponse(ctx, 'Login success', 'success', { token });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return BaseResponse(ctx, message, 'badRequest', null);
  }
};

const refreshTokenController: IHandler = async (ctx: Context) => {
  return BaseResponse(ctx, 'Refresh token route', 'success', {
    message: 'This is where you would handle token refreshing.',
  });
};

const protectedController: IHandler = async (ctx: Context) => {
  const authHeader = ctx.req.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return BaseResponse(ctx, 'Unauthorized', 'unauthorized', null);
  }

  const token = authHeader.split(' ')[1];
  try {
    jwt.verify(token, secret as string, {
      issuer: jwtIssuer,
      audience: jwtAudience,
    });
    return BaseResponse(ctx, 'Access granted', 'success', {
      message: 'Protected route',
    });
  } catch (error) {
    return BaseResponse(ctx, 'Invalid or expired token', 'unauthorized', null);
  }
};

export default {
  indexController,
  getAllUsersController,
  gerUserDetailController,
  registerController,
  loginController,
  refreshTokenController,
  protectedController,
};
