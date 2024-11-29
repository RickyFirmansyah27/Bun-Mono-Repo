import Bao from 'baojs';
import { Logger } from './helper';
import { PORT_SERVICE, DBConnection } from '@bun/utils';
import { config } from 'dotenv';
import path from 'path';
const envPath = path.resolve(__dirname, '../.env');
config({ path: envPath });

import initializeRoutes from './routes';

await DBConnection();

const app = new Bao();

initializeRoutes(app);

const port = PORT_SERVICE.authService;

app.listen({ port });

Logger.info(`[Auth-Service] Server is running on port ${port} 🚀🚀🚀`);
