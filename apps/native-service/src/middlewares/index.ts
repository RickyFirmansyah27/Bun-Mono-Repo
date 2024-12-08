import { IncomingMessage, ServerResponse } from 'http';

type Middleware = (
  req: IncomingMessage,
  res: ServerResponse,
  next: () => void
) => void;

const createMiddlewareHandler = (...middlewares: Middleware[]) => {
  return (req: IncomingMessage, res: ServerResponse) => {
    let index = 0;

    const next = () => {
      if (index < middlewares.length) {
        const middleware = middlewares[index];
        index++;
        middleware(req, res, next);
      }
    };

    next();
  };
};

export default createMiddlewareHandler;
