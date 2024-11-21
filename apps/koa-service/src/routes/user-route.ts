import Router from 'koa-router';
import { getUser, getUserById } from '../controller/user-controller';

const basePath = '/user';
const userRouter = new Router();

userRouter.get(`${basePath}`, getUser);

userRouter.get(`${basePath}/:userId`, getUserById);

export default userRouter;
