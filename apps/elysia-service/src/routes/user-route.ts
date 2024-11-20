import { Elysia } from 'elysia';
import { UserController } from '../controller/user-controller';

const basePath = '/user';
export const userRoutes = new Elysia()
    .get(`${basePath}`, UserController.getUser)
    .post(`${basePath}/create`, UserController.createUser);
