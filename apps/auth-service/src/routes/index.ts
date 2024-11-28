import { Bao } from 'baojs';
import ctl from '../controller';
import middleware from '../middleware';

const basePath = '/api/auth';

const initializeRoutes = (app: Bao) => {
  app.before(middleware.requestMiddleware);
  app.get(basePath, ctl.indexController);
  app.get(`${basePath}/users`, ctl.getAllUsersController);
  app.get(`${basePath}/users/:id`, ctl.gerUserDetailController);
  app.post(`${basePath}/register`, ctl.registerController);
  app.post(`${basePath}/login`, ctl.loginController);
  app.get(`${basePath}/refresh-token`, ctl.indexController);
  app.get(`${basePath}/protected`, ctl.protectedController);
  app.after(middleware.afterMiddleware);
};

export default initializeRoutes;
