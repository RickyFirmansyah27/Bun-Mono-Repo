import controllers from '../controllers';

interface Route {
  path: String;
  method: String;
  handler: (req: Request) => Response | Promise<Response>;
}

const basePrefix = '/bun';

const routes: Route[] = [
  {
    path: `${basePrefix}`,
    method: 'GET',
    handler: controllers.Index,
  },
  {
    path: `${basePrefix}/register`,
    method: 'POST',
    handler: controllers.Register,
  },
  {
    path: `${basePrefix}/login`,
    method: 'POST',
    handler: controllers.Login,
  },
  {
    path: `${basePrefix}/protected`,
    method: 'GET',
    handler: controllers.Protect,
  },
];

export default routes;
