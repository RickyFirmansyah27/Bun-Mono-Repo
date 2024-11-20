import { Elysia } from 'elysia';
import { userRoutes } from './user-route';

const basePath = '/api/elysia';

export const indexRoutes = new Elysia()
    .group(basePath, app => {
        return app
            .use(userRoutes)
            // .use(someRoutes)
    });