# User Service - Sequelize Implementation

## Overview

This service manages user authentication, user profiles, and role management using **Sequelize ORM** instead of Prisma.

## Database Support

The service supports multiple database backends:
- **PostgreSQL** (recommended for production)
- **MySQL**
- **SQLite** (default for development)

## Environment Variables

Configure the database connection using the following environment variables:

```bash
# Database Type (postgres, mysql, or sqlite)
DB_DIALECT=sqlite

# PostgreSQL/MySQL Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=user_service
DB_USER=postgres
DB_PASSWORD=postgres

# SQLite Configuration (used when DB_DIALECT=sqlite)
DB_STORAGE=:memory:  # or path to file: ./data/user-service.db

# Database Logging
DB_LOGGING=false
```

## Project Structure

```
src/
├── config/
│   └── database.ts          # Sequelize configuration
├── models/
│   ├── User.model.ts        # User model definition
│   └── index.ts             # Models initialization
├── repositories/
│   └── user.repository.ts   # Data access layer
├── routes/
│   ├── auth.routes.ts       # Authentication routes
│   └── user.routes.ts       # User management routes
├── middleware/
│   └── error.middleware.ts  # Error handling
├── utils/
│   └── logger.ts            # Logging utility
└── app.ts                   # Application entry point
```

## Key Features

### User Model

The User model includes:
- UUID primary key
- Email (unique, validated)
- Username (unique)
- Password (hashed)
- First name and last name (optional)
- Active status flag
- Role (admin, user, guest)
- Timestamps (createdAt, updatedAt)

### User Repository

The repository provides methods for:
- `create(userData)` - Create new user
- `findById(id)` - Find user by ID
- `findByEmail(email)` - Find user by email
- `findByUsername(username)` - Find user by username
- `findAll(filters)` - List users with filters
- `update(id, updates)` - Update user
- `delete(id)` - Delete user
- `search(query)` - Search users
- `count(filters)` - Count users

## Migration from Prisma

### Changes Made

1. **Dependencies**
   - Removed: `prisma`, `@prisma/client`
   - Added: `sequelize`, `sequelize-typescript`, `pg`, `mysql2`, `sqlite3`, `pg-hstore`

2. **Database Configuration**
   - Created `src/config/database.ts` with Sequelize configuration
   - Supports multiple database dialects
   - Environment-based configuration

3. **Models**
   - Created Sequelize models in `src/models/`
   - Type-safe interfaces for attributes
   - Proper indexing and constraints

4. **Repositories**
   - Created repository pattern in `src/repositories/`
   - Uses Sequelize query methods
   - Maintains same API surface

5. **Application Bootstrap**
   - Updated `app.ts` to initialize Sequelize models
   - Added graceful shutdown with database cleanup

## Running the Service

### Development

```bash
npm install
npm run dev
```

### Production

```bash
npm run build
npm start
```

### Testing

```bash
npm test
```

## API Endpoints

- `GET /health` - Health check endpoint
- `POST /api/auth/...` - Authentication endpoints (to be implemented)
- `GET /api/users/...` - User management endpoints (to be implemented)

## Notes

- In development, models are auto-synced to the database
- In production, use Sequelize migrations for schema changes
- Password hashing should be implemented in the auth service layer
- JWT token generation should be added to authentication routes
