const winston = require('winston');

// Define log formats
const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.printf(({ timestamp, level, message }) => {
    return `${timestamp} [${level.toUpperCase()}]: ${message}`;
  })
);

// Create a Winston logger
const logger = winston.createLogger({
  level: 'info', // Default log level
  format: logFormat,
  transports: [
    // Write all logs with level 'error' and below to `error.log`
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),

    // Write all logs to `combined.log`
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

// Add console logging during development
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}

module.exports = logger;
