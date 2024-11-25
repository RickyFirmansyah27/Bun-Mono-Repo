import userRoute from './user-route';
import { checkHealth } from '../helper/health';

const basePath = '/api/express';

export const routes = [
    { path: `${basePath}/health`, handler: checkHealth },
    { path: `${basePath}/user`, handler: userRoute },
];
