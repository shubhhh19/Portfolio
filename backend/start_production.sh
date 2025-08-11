#!/bin/bash

# Production startup script for Terminal Portfolio Backend

echo "🚀 Starting Terminal Portfolio Backend in Production Mode..."

# Check if .env.production exists
if [ ! -f .env.production ]; then
    echo "❌ Error: .env.production file not found!"
    echo "Please create .env.production with your production configuration."
    exit 1
fi

# Load production environment variables
export $(cat .env.production | xargs)

# Validate required environment variables
if [ -z "$MONGO_URL" ] || [ -z "$SECRET_KEY" ] || [ -z "$ADMIN_TOKEN" ]; then
    echo "❌ Error: Missing required environment variables!"
    echo "Please check MONGO_URL, SECRET_KEY, and ADMIN_TOKEN in .env.production"
    exit 1
fi

# Install/upgrade dependencies
echo "📦 Installing production dependencies..."
pip install -r requirements.txt

# Run database health check
echo "🔍 Checking database connection..."
python3 -c "
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

load_dotenv('.env.production')

async def check_db():
    try:
        client = AsyncIOMotorClient(os.environ['MONGO_URL'], serverSelectionTimeoutMS=5000)
        await client.admin.command('ping')
        print('✅ Database connection successful')
        client.close()
    except Exception as e:
        print(f'❌ Database connection failed: {e}')
        exit(1)

asyncio.run(check_db())
"

if [ $? -ne 0 ]; then
    echo "❌ Database health check failed!"
    exit 1
fi

# Start production server
echo "🌐 Starting production server with Gunicorn..."
gunicorn server:app \
    --workers 4 \
    --worker-class uvicorn.workers.UvicornWorker \
    --bind 0.0.0.0:8000 \
    --timeout 120 \
    --keepalive 2 \
    --max-requests 1000 \
    --max-requests-jitter 100 \
    --access-logfile - \
    --error-logfile - \
    --log-level info

echo "✅ Production server started successfully!"
