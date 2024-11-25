import { Context } from 'baojs';
import jwt from 'jsonwebtoken';
import { HttpLogger } from '../helper/http-logger';

const secret = 'qwqonddqwiqwh1821j31igbwiduxhn8112ex1h299qhwehq98u';

const requestMiddleware = (ctx: Context) => {
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
};

const afterMiddleware = (ctx: Context) => {
  HttpLogger(ctx);
  return ctx;
};

export default {
  requestMiddleware,
  afterMiddleware,
};
