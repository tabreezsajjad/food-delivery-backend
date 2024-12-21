const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const createRateLimiter = require('./utils/rateLimiter');
const errorHandler = require('./middlewares/errorMiddleware');
const notFound = require('./middlewares/notFoundMiddleware');
const userRoutes = require('./routes/userRoutes');
const restaurantRoutes = require('./routes/restaurantRoutes'); 
const cartRoutes = require('./routes/cartRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');

const morganMiddleware = require('./utils/morgan'); 
const logger = require('./utils/logger'); 

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(helmet());
app.use(morganMiddleware); // Use Morgan for HTTP logging

// Apply rate limiter globally
const globalRateLimiter = createRateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Max 100 requests per IP
  });
  app.use(globalRateLimiter);



// User Routes
app.use('/api/users', userRoutes);

// restaurant routes
app.use('/api/restaurants', restaurantRoutes);

//Cart Routes
app.use('/api/cart', cartRoutes);

//Feedback Routes
app.use('/api/users', feedbackRoutes);

//Check Health
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', uptime: process.uptime() });
});

// Not Found Middleware
app.use(notFound);

//Error handler
app.use(errorHandler);

// Example log usage with Winston
logger.info('Application initialized successfully');





module.exports = app;
