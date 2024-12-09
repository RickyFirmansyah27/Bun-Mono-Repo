import { Logger } from './logger';
import { IncomingMessage, ServerResponse } from 'http';

export const HttpLogger = (
  req: IncomingMessage,
  res: ServerResponse,
  next: () => void
): void => {
  const start = process.hrtime();

  Logger.http({
    message: `Request | Method: ${req.method} | Headers: ${JSON.stringify(req.headers)}  | URL: ${req.url}`,
  });

  res.on('finish', () => {
    const duration = process.hrtime(start);
    const durationInMs = duration[0] * 1000 + duration[1] / 1e6;

    Logger.http({
      message: `Response | Method: ${req.method} | URL: ${req.url} | Status: ${res.statusCode} | Duration: ${durationInMs.toFixed(2)} ms`,
    });
  });

  next();
};
