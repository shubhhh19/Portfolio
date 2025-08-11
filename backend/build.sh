#!/bin/bash
set -e

echo "🔧 Installing Python dependencies..."

# Upgrade pip first
pip install --upgrade pip

# Install packages one by one to avoid conflicts
pip install fastapi==0.104.1
pip install uvicorn[standard]==0.24.0
pip install sqlalchemy==2.0.23
pip install psycopg2-binary==2.9.9
pip install alembic==1.13.1
pip install python-dotenv==1.0.0
pip install pydantic==2.5.0
pip install python-multipart==0.0.6
pip install gunicorn==21.2.0
pip install python-jose[cryptography]==3.3.0
pip install passlib[bcrypt]==1.7.4
pip install httpx==0.25.2

echo "✅ All dependencies installed successfully!"
