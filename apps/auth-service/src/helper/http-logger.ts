import { Context } from 'baojs';
import { Logger } from './logger.js';

export const HttpLogger = async (ctx: Context) => {
  const start = performance.now(); // Start measuring time

  // Log the incoming request
  Logger.http({
    message: `Request | Method: ${ctx.method} | Headers: ${JSON.stringify(ctx.headers)} | URL: ${ctx.url}`,
  });

  // Wait for the response to complete
  await ctx.res;

  const end = performance.now(); // End measuring time
  const durationInMs = end - start;

  // Log the outgoing response
  Logger.http({
    message: `Response | Method: ${ctx.method} | URL: ${ctx.url} | Status: ${ctx?.res?.status} | Duration: ${durationInMs.toFixed(2)} ms`,
  });
};
