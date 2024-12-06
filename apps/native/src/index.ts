import { serve } from 'bun';
import routes from './routes';

serve({
  port: 3000,
  fetch(req: Request) {
    const { pathname } = new URL(req.url);
    const { method } = req;
    const route = routes.find(
      (route) => route.path === pathname && route.method === method
    );
    if (route) {
      return route.handler(req);
    }
    return new Response('Not Found', { status: 404 });
  },
});

console.log('Listening on localhost:3000');
