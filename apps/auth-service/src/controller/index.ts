import { IHandler, Context } from 'baojs';
import { BaseResponse } from '../helper';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const secret = 'qwqonddqwiqwh1821j31igbwiduxhn8112ex1h299qhwehq98u';

const indexController: IHandler = (ctx: Context) => {
  return BaseResponse(ctx, 'Auth service', 'success', {
    message: 'Hello from Auth service 🚀🚀🚀',
  });
};

const registerController: IHandler = async (ctx: Context) => {
  try {
    const body = (await ctx.req.json()) as any;
    if (!body.username || !body.password) {
      throw new Error('username and password is required');
    }
    const hash = crypto.createHash('sha256');
    hash.update(body.password);
    const password = hash.digest('hex');
    // TODO: store to database
    return BaseResponse(ctx, 'Register success', 'success', {
      username: body.username,
      hashedPassword: password,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return BaseResponse(ctx, error.message, 'badRequest', error);
    }
    return BaseResponse(
      ctx,
      'Internal Server Error',
      'internalServerError',
      error
    );
  }
};

const loginController: IHandler = async (ctx: Context) => {
  try {
    const body = (await ctx.req.json()) as any;
    if (!body.username) {
      throw new Error('username is required');
    }
    const token = jwt.sign({ username: body.username }, secret, {
      expiresIn: '1h',
    });
    return BaseResponse(ctx, 'Login success', 'success', { token });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return BaseResponse(ctx, error.message, 'badRequest', error);
    }
    return BaseResponse(
      ctx,
      'Internal Server Error',
      'internalServerError',
      error
    );
  }
};

const refreshTokenController: IHandler = async (ctx: Context) => {
  return ctx.sendPrettyJson({ message: 'Refresh' });
};

const protectedController: IHandler = async (ctx: Context) => {
  return ctx.sendPrettyJson({ message: 'protected route' });
};

export default {
  indexController,
  registerController,
  loginController,
  refreshTokenController,
  protectedController,
};
