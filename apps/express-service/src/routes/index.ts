import userRoute from './user-route';

const basePath = '/api/express';

export const routes = [
    { path: `${basePath}/user`, router: userRoute },
];

