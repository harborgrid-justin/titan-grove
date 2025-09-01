-- Titan Grove PostgreSQL Database Initialization
-- This script sets up the PostgreSQL database for Titan Grove Enterprise Business Suite

-- Create extensions if they don't exist
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";

-- Create core schema tables for PostgreSQL-specific features
CREATE TABLE IF NOT EXISTS postgres_health_check (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    status VARCHAR(50) NOT NULL DEFAULT 'healthy',
    checked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert initial health check record
INSERT INTO postgres_health_check (status) VALUES ('initialized');

-- Log successful initialization
SELECT 'PostgreSQL database initialization completed successfully' AS message;