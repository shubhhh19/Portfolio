# 🚀 Quick Setup Guide

## Prerequisites
- Node.js 18+
- Python 3.8+
- MongoDB (local or Atlas)

## 🏃‍♂️ Quick Start

### 1. Clone and Setup
```bash
git clone <your-repo-url>
cd Portfolio
```

### 2. Backend Setup
```bash
cd backend

# Copy environment template
cp .env.example .env

# Edit .env with your values
# MONGO_URL=mongodb://localhost:27017
# SECRET_KEY=your-secret-key
# ADMIN_TOKEN=your-admin-token

# Install dependencies
pip install -r requirements.txt

# Start MongoDB (if local)
brew services start mongodb-community

# Start backend
uvicorn server:app --reload --port 8000
```

### 3. Frontend Setup
```bash
cd frontend

# Copy environment template
cp .env.example .env

# Edit .env with your backend URL
# REACT_APP_BACKEND_URL=http://localhost:8000

# Install dependencies
npm install

# Start frontend
npm start
```

### 4. Access Your Portfolio
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

## 🔑 Environment Variables

### Backend (.env)
```bash
MONGO_URL=mongodb://localhost:27017
DB_NAME=portfolio_db
SECRET_KEY=your-secret-key-here
ADMIN_TOKEN=your-admin-token-here
CORS_ORIGINS=http://localhost:3000
ENVIRONMENT=development
```

### Frontend (.env)
```bash
REACT_APP_BACKEND_URL=http://localhost:8000
```

## 🎯 Next Steps
1. Customize your portfolio content
2. Update the admin token for security
3. Deploy to production (see DEPLOYMENT.md)
4. Set up monitoring and alerts

## 🆘 Troubleshooting
- **Backend won't start**: Check MongoDB connection
- **Frontend can't connect**: Verify backend URL in .env
- **Permission errors**: Check file permissions on start_production.sh

## 📚 Documentation
- [Production Readiness](PRODUCTION_READINESS.md)
- [Deployment Guide](DEPLOYMENT.md)
- [API Documentation](http://localhost:8000/docs)
