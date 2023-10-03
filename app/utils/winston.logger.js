import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import moment from 'moment';
import path from 'path';

const __dirname = path.dirname(new URL(
    import.meta.url).pathname).replace(/^\//, '');

const transportApi = new DailyRotateFile({
    filename: `${__dirname}/../../logs/${process.env.APP}-%DATE%.log`,
    datePattern: 'DD-MM-YYYY',
    zippedArchive: true,
    maxSize: '10m',
    maxFiles: '15d',
});

const transportApiError = new DailyRotateFile({
    filename: `${__dirname}/../../logs/errors-${process.env.APP}-%DATE%.log`,
    datePattern: 'DD-MM-YYYY',
    zippedArchive: true,
    maxSize: '10m',
    maxFiles: '15d',
    level: 'error'
}, );

const appendTimestamp = winston.format((info) =>
    Object.assign(info, { timestamp: moment().format() })
);


const logger = winston.createLogger({
    level: process.env.LOG_LEVEL | "info",
    format: winston.format.combine(
        winston.format.splat(),
        winston.format.metadata(),
        appendTimestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
    ),
    transports: [transportApi, transportApiError],
});



export { logger };