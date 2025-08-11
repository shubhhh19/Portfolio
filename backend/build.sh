#!/bin/bash
set -e

echo "🔧 Installing Python dependencies..."

# Upgrade pip first
pip install --upgrade pip

# Install packages one by one to avoid conflicts
pip install fastapi==0.88.0
pip install uvicorn==0.20.0
pip install sqlalchemy==1.4.53
pip install psycopg2-binary==2.9.5
pip install alembic==1.8.1
pip install python-dotenv==0.21.1
pip install pydantic==1.10.2
pip install python-multipart==0.0.5
pip install gunicorn==20.1.0
pip install python-jose==3.3.0
pip install passlib==1.7.4
pip install httpx==0.23.3
pip install starlette==0.22.0
pip install anyio==3.6.2
pip install h11==0.14.0
pip install click==8.1.3
pip install typing-extensions==4.5.0

echo "✅ All dependencies installed successfully!"
