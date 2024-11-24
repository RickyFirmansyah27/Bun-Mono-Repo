import Bao from 'baojs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { BaseResponse, HttpLogger, Logger } from './helper';
import { PORT_SERVICE } from '@bun/utils';

const secret = 'qwqonddqwiqwh1821j31igbwiduxhn8112ex1h299qhwehq98u';

const app = new Bao();

app.before((ctx) => {
  HttpLogger(ctx);
  const urlPath = ctx.req.url.match(/\/api\/auth\/(.*)/)?.[1];
  if (urlPath === 'protected') {
    const authHeader = ctx.req.headers.get('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return ctx.sendText('unauthorized', { status: 401 }).forceSend();
    }

    const token = authHeader.split(' ')[1];

    try {
      jwt.verify(token, secret);
    } catch (err) {
      return ctx.sendText('unauthorized', { status: 401 }).forceSend();
    }
  }
  return ctx;
});

app.get('/api/auth', (ctx) => {
  return BaseResponse(ctx, 'Auth service', 'success', {
    message: 'Hello from Auth service 🚀🚀🚀',
  });
});

app.post('/api/auth/register', async (ctx) => {
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
      password,
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
});

app.post('/api/auth/login', async (ctx) => {
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
});

app.post('/api/auth/refresh-token', (ctx) => {
  return ctx.sendPrettyJson({ message: 'Refresh' });
});

app.get('/api/auth/protected', (ctx) => {
  return ctx.sendPrettyJson({ message: 'protected route' });
});

app.after((ctx) => {
  HttpLogger(ctx);
  return ctx;
});

const port = PORT_SERVICE.authService;

const server = app.listen({ port });

Logger.info(`[Auth-Service] Server is running on port ${port} 🚀🚀🚀`);
