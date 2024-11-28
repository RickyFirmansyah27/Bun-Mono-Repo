import { IHandler, Context } from 'baojs';
import { BaseResponse } from '../helper';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { config } from 'dotenv';
config({ path: './auth-service.env' });
import sql from '../db';

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
    //     const users = await sql`DROP TYPE "Role";
    // `;
    const users = await sql`SELECT * FROM "User"`;

    return BaseResponse(ctx, 'Get all users', 'success', users);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return BaseResponse(ctx, message, 'badRequest', null);
  }
};

const registerController: IHandler = async (ctx: Context) => {
  try {
    const body = (await ctx.req.json()) as any;
    validateBody(body, ['name', 'password']);

    const hash = crypto.createHash('sha256');
    hash.update(body.password);
    const hashedPassword = hash.digest('hex');

    const user = await sql`
      INSERT INTO "User" (name, password) 
      VALUES (${body.name}, ${hashedPassword}) 
      RETURNING *
    `;

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

    const user = await sql`SELECT * FROM "User" WHERE name = ${body.username}`;
    if (!user.length) {
      throw new Error('User not found');
    }

    const hash = crypto.createHash('sha256');
    hash.update(body.password);
    const hashedPassword = hash.digest('hex');

    if (user[0].password !== hashedPassword) {
      throw new Error('Invalid password');
    }

    const token = jwt.sign({ username: body.username }, secret as string, {
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
  registerController,
  loginController,
  refreshTokenController,
  protectedController,
};
