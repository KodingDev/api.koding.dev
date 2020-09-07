import winston from 'winston';

/**
 * The logger uses the Winston library to log colorful
 * messages into the console with timestamps.
 */
export const logger = winston.createLogger({
    level: 'debug',
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp(),
        winston.format.align(),
        winston.format.printf((info) => {
            // Extract proper timestamp and variables from the info
            const { timestamp, level, message, ...args } = info;
            const ts = timestamp.slice(0, 19).replace('T', ' ');

            // Return a formatted logger message
            const base = `${ts} ${level}: ${message}`;
            if (args instanceof Error) return `${base} ${info.stack}`;
            return `${base} ${Object.keys(args).length ? JSON.stringify(args, null, 2) : ''}`;
        }),
    ),
    transports: [new winston.transports.Console()],
});
