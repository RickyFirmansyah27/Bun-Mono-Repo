import { Elysia } from 'elysia'
import { Logger } from './logger'

interface LocalContext {
    start: [number, number]
    url: string
}

export const HttpLogger = new Elysia()
    .state('loggerContext', {} as LocalContext)
    .onRequest((ctx) => {
        const loggerContext = ctx.store.loggerContext as LocalContext
        loggerContext.start = process.hrtime()
        loggerContext.url = new URL(ctx.request.url).pathname

        Logger.http({
            message: `Request | Method: ${ctx.request.method} | Headers: ${JSON.stringify(Object.fromEntries(ctx.request.headers))} | URL: ${loggerContext.url}`
        })
    })
    .onAfterHandle((ctx) => {
        const loggerContext = ctx.store.loggerContext as LocalContext
        const duration = process.hrtime(loggerContext.start)
        const durationInMs = duration[0] * 1000 + duration[1] / 1e6

        Logger.http({
            message: `Response | Method: ${ctx.request.method} | URL: ${loggerContext.url} | Status: ${ctx.set.status || 200} | Duration: ${durationInMs.toFixed(2)} ms`
        })
    })