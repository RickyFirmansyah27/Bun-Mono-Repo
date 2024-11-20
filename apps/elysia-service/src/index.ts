import dotenv from 'dotenv';
import Elysia from 'elysia';
import { HttpLogger, Logger } from './helper';
import { indexRoutes } from './routes';
import { PORT_SERVICE } from '@bun/utils';

dotenv.config();

const app = new Elysia();
const port = PORT_SERVICE.elysiaService;

// Middleware
app.use(HttpLogger);

// Registering routes
app.use(indexRoutes);

// Starting the server
app.listen(port, async () => {
    try {
        Logger.info(`[Elysia-Service] Server is running on port ${port}`);
    } catch (error) {
        if (error instanceof Error) {
            Logger.error(
                `Error starting server: Message: ${error.message} | Stack: ${error.stack}`
            );
        } else {
            Logger.error(`Error starting server: ${String(error)}`);
        }
    }
});
