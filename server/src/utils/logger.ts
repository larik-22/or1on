import winston from 'winston';

/**
 * Creates and configures a logger instance using Winston.
 *
 * The logger outputs log messages to both the console and a file (`app.log`).
 * Log messages are timestamped and formatted to include the log level.
 */
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => `${timestamp} [${level}]: ${message}`)
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'app.log' }),
    ],
});

export default logger;
