#!/bin/bash
# Titan Grove Development Server Startup Script

set -e

echo "🏢 Starting Titan Grove Development Server..."
echo "=============================================="

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "⚠️  .env file not found. Creating from example..."
    if [ -f ".env.example" ]; then
        cp .env.example .env
        echo "✅ Created .env file"
    else
        echo "❌ No .env.example found. Please create .env file manually."
        exit 1
    fi
fi

# Set development environment
export NODE_ENV=development
export DEBUG=titan:*

# Display configuration
echo "📋 Configuration:"
echo "   Node.js version: $(node --version)"
echo "   npm version: $(npm --version)"
echo "   Environment: $NODE_ENV"
echo "   Port: ${PORT:-3000}"
echo ""

# Start development server with hot reload
echo "🚀 Starting development server with hot reload..."
npm run dev