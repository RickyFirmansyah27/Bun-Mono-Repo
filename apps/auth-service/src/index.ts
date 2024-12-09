import { Logger, PORT_SERVICE } from '@bun/utils';
import { createServer, IncomingMessage, ServerResponse } from 'http';
import { parse } from 'url';
import routes from './routes';
import createMiddlewareHandler from './middlewares';
import { BaseResponse, HttpLogger } from './helper';

const port = PORT_SERVICE.authService || 8100;

const routeHandlers = (req: IncomingMessage, res: ServerResponse) => {
  const method = req.method!;
  const url = parse(req.url!, true);
  const route = routes.find(
    (route) => route.path === url.pathname && route.method === method
  );

  if (route) {
    return route.handler(req, res);
  } else {
    BaseResponse(res, 'Route not found', 'notFound', null);
  }
};

const handler = createMiddlewareHandler(HttpLogger, routeHandlers);

const server = createServer(handler);
server.listen(port, () => {
  try {
    Logger.info(`[Auth-Service] Server is running on port ${port}`);
  } catch (error) {
    if (error instanceof Error) {
      Logger.error(
        `Error starting server: Message: ${error.message} | Stack: ${error.stack}`
      );
    } else {
      Logger.error(`Error starting server: ${String(error)}`);
    }
  }
});
