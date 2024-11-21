import Router from 'koa-router';
import { getUser, getUserById } from '../controller/user-controller';

const userRouter = new Router();

userRouter.get('/user', getUser);

userRouter.get('/user/:userId', getUserById);

export default userRouter;
