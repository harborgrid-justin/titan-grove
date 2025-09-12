import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { createBiRoutes } from './routes/bi';
import { createAnalyticsRoutes } from './routes/analytics';
import { createPredictiveRoutes } from './routes/predictive';
import { errorHandler } from './middleware/errorHandler';
import { logger } from './utils/logger';

const app: Express = express();
const PORT = process.env.PORT || 3004;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'analytics-service', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/bi', createBiRoutes());
app.use('/api/analytics', createAnalyticsRoutes());
app.use('/api/predictive', createPredictiveRoutes());

// Error handling
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  logger.info(`Analytics Service running on port ${PORT}`);
});

export default app;