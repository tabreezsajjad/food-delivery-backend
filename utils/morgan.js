const morgan = require('morgan');
const logger = require('./logger');

// Create a Morgan middleware that integrates with Winston
const morganMiddleware = morgan('combined', {
  stream: {
    write: (message) => logger.info(message.trim()), // Pass Morgan logs to Winston
  },
});

module.exports = morganMiddleware;
