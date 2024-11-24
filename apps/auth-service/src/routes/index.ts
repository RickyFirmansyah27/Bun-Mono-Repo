import Router from 'koa-router';
import userRoute from './user-route';

const basePath = '/api/koa';
const router = new Router({ prefix: basePath });

router.use(userRoute.routes());

export default router;
