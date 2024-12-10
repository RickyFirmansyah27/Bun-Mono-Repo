import { Router } from 'express';
import { getUser, getUserDetail } from '../controller/user-controller';

const userRoute = Router();

userRoute.route('/').get(getUser);
userRoute.route('/:id').get(getUserDetail);

export default userRoute;