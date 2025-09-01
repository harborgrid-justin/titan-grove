-- Titan Grove MySQL Database Initialization
-- This script sets up the MySQL database for Titan Grove Enterprise Business Suite

CREATE DATABASE IF NOT EXISTS titan_grove_mysql;
USE titan_grove_mysql;

-- Create core schema tables for MySQL-specific features
CREATE TABLE IF NOT EXISTS mysql_health_check (
    id INT AUTO_INCREMENT PRIMARY KEY,
    status VARCHAR(50) NOT NULL DEFAULT 'healthy',
    checked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert initial health check record
INSERT INTO mysql_health_check (status) VALUES ('initialized');

-- Grant permissions for titan user
GRANT ALL PRIVILEGES ON titan_grove_mysql.* TO 'titan'@'%';
GRANT ALL PRIVILEGES ON titan_grove.* TO 'titan'@'%';
FLUSH PRIVILEGES;

-- Log successful initialization
SELECT 'MySQL database initialization completed successfully' AS message;