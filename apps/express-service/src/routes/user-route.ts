import { Router } from 'express';
import { getUser, createUser } from '../controller/user-controller';

const userRoute = Router();

userRoute.route('/').get(getUser);
userRoute.route('/').post(createUser);

export default userRoute;