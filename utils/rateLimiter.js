const rateLimit = require('express-rate-limit');

// Create a reusable rate limiter
const createRateLimiter = (options = {}) => {
  return rateLimit({
    windowMs: options.windowMs || 15 * 60 * 1000, // Default: 15 minutes
    max: options.max || 100, // Default: 100 requests per windowMs
    message: options.message || 'Too many requests, please try again later.',
    headers: true, // Include rate limit headers in the response
    standardHeaders: true, // Use standardized rate limit headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  });
};

module.exports = createRateLimiter;
