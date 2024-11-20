import moment  from 'moment';
import { createLogger, format, transports } from 'winston';

const { combine, timestamp, printf, colorize } = format;

const loggerFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level}]: ${message}`;
});

export const Logger = createLogger({
    level: 'debug',
    format: combine(
        colorize(),
        timestamp({
            format: () => moment().format('ddd, DD MMM YYYY HH:mm:ss')
        }),
        loggerFormat
    ),
    transports: [new transports.Console()]
});
