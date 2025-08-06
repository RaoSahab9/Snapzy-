const { RateLimiterMemory } = require('rate-limiter-flexible');

// Different rate limiters for different endpoints
const rateLimiters = {
  // General API rate limiter
  general: new RateLimiterMemory({
    points: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 10,
    duration: parseInt(process.env.RATE_LIMIT_WINDOW_MS) / 1000 || 900, // 15 minutes
  }),

  // Stricter rate limiter for generation endpoint
  generation: new RateLimiterMemory({
    points: 3, // 3 generations per hour
    duration: 3600, // 1 hour
  }),

  // Auth endpoints rate limiter
  auth: new RateLimiterMemory({
    points: 5, // 5 attempts per 15 minutes
    duration: 900, // 15 minutes
  })
};

const createRateLimitMiddleware = (limiterType = 'general') => {
  return async (req, res, next) => {
    const limiter = rateLimiters[limiterType];
    const key = req.ip || req.connection.remoteAddress;

    try {
      await limiter.consume(key);
      next();
    } catch (rateLimiterRes) {
      const secs = Math.round(rateLimiterRes.msBeforeNext / 1000) || 1;
      
      res.set('Retry-After', String(secs));
      res.status(429).json({
        error: 'Too many requests',
        message: `Rate limit exceeded. Try again in ${secs} seconds.`,
        retryAfter: secs
      });
    }
  };
};

// Export specific middleware for different endpoints
module.exports = {
  general: createRateLimitMiddleware('general'),
  generation: createRateLimitMiddleware('generation'),
  auth: createRateLimitMiddleware('auth'),
  createRateLimitMiddleware
};