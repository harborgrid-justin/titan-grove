import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { createFinancialRoutes } from './routes/financial';
import { createTreasuryRoutes } from './routes/treasury';
import { createTaxRoutes } from './routes/tax';
import { errorHandler } from './middleware/errorHandler';
import { logger } from './utils/logger';

const app: Express = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'financial-service', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/financial', createFinancialRoutes());
app.use('/api/treasury', createTreasuryRoutes());
app.use('/api/tax', createTaxRoutes());

// Error handling
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  logger.info(`Financial Service running on port ${PORT}`);
});

export default app;