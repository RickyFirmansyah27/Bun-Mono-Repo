import { Router } from 'express';
import { UserController } from '../controller/user-controller';

const userRoute = Router();

userRoute.route('/').get(UserController.getUser);
userRoute.route('/').post(UserController.createUser);

export default userRoute;