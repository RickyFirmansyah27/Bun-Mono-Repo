import { Elysia } from 'elysia';
import { Logger } from './logger';

interface LocalContext {
    start?: [number, number];
    url?: string;
}

export const HttpLogger = (app: Elysia) =>
    app
        .state('loggerContext', {} as LocalContext)
        .onRequest(({ request, store }) => {
            const state = store.loggerContext as LocalContext;
            state.start = process.hrtime();
            state.url = request.url;

            Logger.http({
                message: `Request | Method: ${request.method} | Headers: ${JSON.stringify(
                    Object.fromEntries(request.headers)
                )} | URL: ${request.url}`
            });
        })
        .onAfterHandle(({ request, store, set }) => {
            const state = store.loggerContext as LocalContext;
            if (state.start) {
                const duration = process.hrtime(state.start);
                const durationInMs = duration[0] * 1000 + duration[1] / 1e6;

                Logger.http({
                    message: `Response | Method: ${request.method} | URL: ${request.url} | Status: ${set.status || 200} | Duration: ${durationInMs.toFixed(2)} ms`
                });
            }
        })
        .onError(({ error, store }) => {
            const state = store.loggerContext as LocalContext;
            Logger.error({
                message: `Error occurred at URL: ${state.url || 'unknown'} | Error: ${error.message || error}`
            });
        });
