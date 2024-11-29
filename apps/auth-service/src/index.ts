import Bao from 'baojs';
import { Logger } from './helper';
import { PORT_SERVICE } from '@bun/utils';
import { config } from 'dotenv';
import path from 'path';
const envPath = path.resolve(__dirname, '../.env');
config({ path: envPath });

import initializeRoutes from './routes';
import sql from './db';
import { DBConnection } from './db/dbPoolService';

await DBConnection();
const rows = await sql`SELECT version()`;

Logger.info(`[Auth-Service] Postgresql version: ${rows[0].version}`);

const app = new Bao();

initializeRoutes(app);

const port = PORT_SERVICE.authService;

app.listen({ port });

Logger.info(`[Auth-Service] Server is running on port ${port} 🚀🚀🚀`);
