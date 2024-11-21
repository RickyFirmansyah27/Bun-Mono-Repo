import { Context, Next } from 'koa';
import { Logger } from './logger.js';

export const HttpLogger = async (ctx: Context, next: Next) => {
    const start = process.hrtime();

    Logger.http({
        message: `Request | Method: ${ctx.method} | Headers: ${JSON.stringify(ctx.headers)} | URL: ${ctx.originalUrl || ctx.url}`
    });

    try {
        await next();
    } finally {
        const duration = process.hrtime(start);
        const durationInMs = duration[0] * 1000 + duration[1] / 1e6;

        Logger.http({
            message: `Response | Method: ${ctx.method} | URL: ${ctx.originalUrl || ctx.url} | Status: ${ctx.status} | Duration: ${durationInMs.toFixed(2)} ms`
        });
    }
};