import { Context } from 'baojs';
import { Logger } from './logger.js';

export const HttpLogger = (ctx: Context) => {
  const start = process.hrtime();

  if (!ctx.res) {
    Logger.http({
      message: `Request | Method: ${ctx.method} | Headers: ${JSON.stringify(ctx.headers)} | URL: ${ctx.originalUrl || ctx.url}`,
    });
  } else {
    const duration = process.hrtime(start);
    const durationInMs = duration[0] * 1000 + duration[1] / 1e6;
    Logger.http({
      message: `Response | Method: ${ctx.method} | URL: ${ctx.url || ctx.url} | Status: ${ctx?.res.status} | Duration: ${durationInMs.toFixed(2)} ms`,
    });
  }
};
