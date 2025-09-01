#!/bin/bash
# Titan Grove Production Server Startup Script

set -e

echo "🏢 Starting Titan Grove Production Server..."
echo "=============================================="

# Set production environment
export NODE_ENV=production

# Check if built application exists
if [ ! -d "dist" ]; then
    echo "📦 No dist directory found. Building application..."
    npm run build
    
    if [ $? -ne 0 ]; then
        echo "❌ Build failed. Please check build errors."
        exit 1
    fi
fi

# Check if .env.production exists
if [ ! -f ".env.production" ]; then
    echo "⚠️  .env.production file not found."
    if [ -f ".env.production.example" ]; then
        echo "📝 You may want to create .env.production from .env.production.example"
    fi
fi

# Display configuration
echo "📋 Production Configuration:"
echo "   Node.js version: $(node --version)"
echo "   Environment: $NODE_ENV"
echo "   Port: ${PORT:-3000}"
echo "   Memory limit: ${NODE_OPTIONS:-default}"
echo ""

# Health check function
health_check() {
    local url="http://localhost:${PORT:-3000}/health"
    local max_attempts=30
    local attempt=1
    
    echo "🔍 Performing health check..."
    
    while [ $attempt -le $max_attempts ]; do
        if curl -f -s "$url" > /dev/null 2>&1; then
            echo "✅ Health check passed"
            return 0
        fi
        
        echo "⏳ Waiting for server to start (attempt $attempt/$max_attempts)..."
        sleep 2
        ((attempt++))
    done
    
    echo "❌ Health check failed after $max_attempts attempts"
    return 1
}

# Start production server
echo "🚀 Starting production server..."

# Use PM2 if available, otherwise use npm start
if command -v pm2 >/dev/null 2>&1; then
    echo "📊 Using PM2 process manager..."
    pm2 start ecosystem.config.js
    
    # Wait a moment for PM2 to start
    sleep 5
    
    # Show PM2 status
    pm2 status
    
    echo ""
    echo "✅ Titan Grove started with PM2"
    echo "📊 Monitor with: pm2 monit"
    echo "📝 View logs with: pm2 logs"
    echo "⏹️  Stop with: pm2 stop all"
else
    echo "🚀 Starting with npm..."
    npm start &
    SERVER_PID=$!
    
    # Wait for server to start
    sleep 5
    
    # Perform health check
    if health_check; then
        echo "✅ Titan Grove is running (PID: $SERVER_PID)"
        echo "🔗 Access at: http://localhost:${PORT:-3000}"
        echo "⏹️  Stop with: kill $SERVER_PID"
        
        # Wait for the server process
        wait $SERVER_PID
    else
        echo "❌ Server failed to start properly"
        kill $SERVER_PID 2>/dev/null || true
        exit 1
    fi
fi