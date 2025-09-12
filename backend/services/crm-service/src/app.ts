import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { createCrmRoutes } from './routes/crm';
import { createSalesRoutes } from './routes/sales';
import { createMarketingRoutes } from './routes/marketing';
import { errorHandler } from './middleware/errorHandler';
import { logger } from './utils/logger';

const app: Express = express();
const PORT = process.env.PORT || 3003;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'crm-service', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/customers', createCrmRoutes());
app.use('/api/sales', createSalesRoutes());
app.use('/api/marketing', createMarketingRoutes());

// Error handling
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  logger.info(`CRM Service running on port ${PORT}`);
});

export default app;