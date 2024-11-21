import type { FastifyRequest, FastifyReply, FastifyInstance } from "fastify";
import { Logger } from './logger';

export const HttpLogger = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  const start = process.hrtime();

  Logger.http({
    message: `Request | Method: ${req.method} | Headers: ${JSON.stringify(req.headers)} | URL: ${req.url}`
  });

  reply.raw.on('finish', () => {
    const duration = process.hrtime(start);
    const durationInMs = duration[0] * 1000 + duration[1] / 1e6;

    Logger.http({
      message: `Response | Method: ${req.method} | URL: ${req.url} | Status: ${reply.statusCode} | Duration: ${durationInMs.toFixed(2)} ms`
    });
  });
};
