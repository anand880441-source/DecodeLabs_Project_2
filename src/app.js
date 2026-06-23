const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { errorHandler } = require('./middleware/errorHandler');
const { requestLogger } = require('./middleware/logger');
const routes = require('./routes');

const app = express();

// ===== Security Middleware =====
app.use(helmet());

// ===== CORS Configuration =====
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-frontend-domain.com'] 
    : '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ===== Rate Limiting (Resilience) =====
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: {
    status: 429,
    error: 'Too Many Requests',
    message: 'Please slow down your requests. Rate limit exceeded.'
  },
  standardHeaders: true,
  legacyHeaders: false
});
app.use('/api', limiter);

// ===== Body Parsers =====
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ===== Logging =====
app.use(requestLogger);

// ===== API Routes =====
app.use('/api', routes);

// ===== Health Check =====
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.API_VERSION || 'v1'
  });
});

// ===== 404 Handler =====
app.use((req, res) => {
  res.status(404).json({
    status: 404,
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

// ===== Global Error Handler =====
app.use(errorHandler);

module.exports = app;