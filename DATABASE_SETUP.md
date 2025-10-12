# Database Setup Guide

## Overview

The Titan Grove platform uses a flexible database layer that supports multiple database types including PostgreSQL (recommended for production with Neon), SQLite (for development), MySQL, and MongoDB.

## Quick Start

### 1. Configure Database Connection

Copy `.env.example` to `.env` and configure your database settings:

#### For Development (SQLite - Default)
```env
DB_TYPE=sqlite
DB_NAME=./data/titan_grove.db
```

#### For Production (Neon PostgreSQL)
```env
DB_TYPE=postgresql
DB_HOST=your-neon-host.neon.tech
DB_PORT=5432
DB_NAME=titan_grove
DB_USER=your_username
DB_PASSWORD=your_password
DATABASE_URL=postgresql://user:password@host:5432/database?sslmode=require
```

### 2. Initialize and Seed Database

Run the database setup script to create tables and seed initial data:

```bash
npm run db:setup
```

This will:
- Create database tables (users, customers, products, orders, order_items)
- Seed sample data
- Create test user accounts

### 3. Test Credentials

After setup, the following test accounts are available:

**Admin Account:**
- Username: `admin`
- Password: `admin123`
- Role: Administrator with full access

**Enterprise Account:**
- Username: `enterprise`
- Password: `enterprise123`
- Role: Enterprise user with business system access

**Test User Account:**
- Username: `testuser`
- Password: `test123`
- Role: Standard user

## Database Schema

### Users Table
- `id`: Primary key
- `username`: Unique username
- `email`: User email address
- `password`: Bcrypt hashed password
- `first_name`, `last_name`: User's name
- `role`: User role (admin, enterprise, user)
- `system`: System access (business, customer)
- `active`: Account status
- `created_at`, `updated_at`: Timestamps

### Customers Table
- `id`: Primary key
- `name`: Customer name
- `email`, `phone`: Contact information
- `company`: Company name
- `address`, `city`, `state`, `country`, `postal_code`: Address fields
- `status`: Customer status
- `created_at`, `updated_at`: Timestamps

### Products Table
- `id`: Primary key
- `name`: Product name
- `sku`: Stock keeping unit
- `description`: Product description
- `price`: Product price
- `stock_quantity`: Available inventory
- `category`: Product category
- `status`: Product status
- `created_at`, `updated_at`: Timestamps

### Orders Table
- `id`: Primary key
- `customer_id`: Foreign key to customers
- `user_id`: Foreign key to users
- `order_number`: Unique order identifier
- `total_amount`: Order total
- `status`: Order status
- `order_date`: Order placement date
- `created_at`, `updated_at`: Timestamps

### Order Items Table
- `id`: Primary key
- `order_id`: Foreign key to orders
- `product_id`: Foreign key to products
- `quantity`: Item quantity
- `unit_price`: Price per unit
- `total_price`: Line item total
- `created_at`, `updated_at`: Timestamps

## API Endpoints

The API server provides the following endpoints for database operations:

### Authentication
- `POST /api/auth/login` - User login (returns JWT token)

### Data Access
- `GET /api/health` - System health check including database status
- `GET /api/users` - List all users
- `GET /api/customers` - List all customers
- `GET /api/customers/:id` - Get specific customer
- `GET /api/products` - List all products
- `GET /api/orders` - List all orders with customer/user details
- `GET /api/orders/:id` - Get specific order with items
- `GET /api/dashboard/metrics` - Dashboard statistics
- `GET /api/crm/customers` - CRM customer list
- `GET /api/crm/metrics` - CRM metrics

## Running the API Server

Start the API server with database connectivity:

```bash
npm run start:api
```

The server will:
1. Connect to the configured database
2. Start on port 3000 (or PORT environment variable)
3. Serve API endpoints with database integration
4. Provide a web dashboard at http://localhost:3000

## Neon PostgreSQL Configuration

### Setting up Neon Database

1. Create a Neon account at https://neon.tech
2. Create a new project
3. Copy your connection string
4. Update `.env` with your Neon credentials:

```env
DB_TYPE=postgresql
DATABASE_URL=postgresql://username:password@your-host.neon.tech:5432/database?sslmode=require
```

5. Run setup:
```bash
npm run db:setup
```

### Neon Connection Features
- SSL enabled by default (required)
- Connection pooling supported
- Serverless PostgreSQL (auto-scaling)
- High availability and backups

## Troubleshooting

### Database Connection Issues

**SQLite "database is locked":**
- Ensure no other processes are accessing the database
- Check file permissions in `./data/` directory

**PostgreSQL connection refused:**
- Verify host and port are correct
- Check firewall allows port 5432
- Ensure SSL mode is set correctly for Neon (`sslmode=require`)

**Neon connection timeout:**
- Verify your connection string includes `?sslmode=require`
- Check network connectivity
- Ensure database is not suspended (Neon auto-suspends after inactivity)

### Re-seeding Database

To clear and re-seed the database:

```bash
# For SQLite
rm ./data/titan_grove.db
npm run db:setup

# For PostgreSQL/Neon
# Drop tables manually or use migration tools
npm run db:setup
```

## Production Deployment

For production deployment with Neon:

1. Set environment variables in your hosting platform
2. Use strong JWT secret: `JWT_SECRET=your-super-secret-key`
3. Configure connection pooling for optimal performance
4. Enable SSL/TLS for all connections
5. Set up regular backups (Neon provides automatic backups)
6. Monitor database performance and query times

## Security Notes

- **Never commit `.env` file** - it contains sensitive credentials
- **Change default passwords** - update test credentials before production
- **Use strong JWT secrets** - generate secure random keys
- **Enable SSL** - always use SSL for database connections
- **Limit database access** - use minimal permissions for application user
- **Regular updates** - keep dependencies up to date

## Support

For issues or questions:
- Check logs in `./logs/` directory
- Review database connection settings in `.env`
- Ensure all dependencies are installed: `npm install`
- Verify database service is running and accessible
