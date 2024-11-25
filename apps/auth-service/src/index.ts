import Bao from 'baojs';
import { Logger } from './helper';
import { PORT_SERVICE } from '@bun/utils';
import initializeRoutes from './routes';

const app = new Bao();

initializeRoutes(app);

const port = PORT_SERVICE.authService;

app.listen({ port });

Logger.info(`[Auth-Service] Server is running on port ${port} 🚀🚀🚀`);
