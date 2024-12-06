import { IncomingMessage, ServerResponse } from 'http';
import { Logger } from "@bun/utils";
import { createServer } from "http";
import { parse } from "url";

interface Route {
  path: string;
  method: string;
  handler: (req: IncomingMessage, res: ServerResponse) => void;
}

const port = 8101;
const basePrefix = '/auth';

const routes: Route[] = [
  { path: `${basePrefix}`, method: 'GET', handler: (req: IncomingMessage, res: ServerResponse ) => res.end('Welcome to Hyper Express') },
  { path: `${basePrefix}/user`, method: 'GET', handler: (req: IncomingMessage, res: ServerResponse ) => res.end('User route accessed!') },
  { path: `${basePrefix}/hello-bun`, method: 'GET', handler: (req: IncomingMessage, res: ServerResponse ) => res.end('Hello Bun!') },
];

const server = createServer((req, res) => {
  const method = req.method!;
  const url = parse(req.url!, true);
  const route = routes.find(route => route.path === url.pathname && route.method === method);

  if (route) {
    return route.handler(req, res);
  } else {
    res.statusCode = 404;
    res.end('Route Not Found');
  }
});

server.listen(port, () => {
  try {
      Logger.info(`[Native-Service] Server is running on port ${port}`);
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