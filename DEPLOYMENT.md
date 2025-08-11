# Deployment Guide

## Local Development ✅

Your portfolio is currently running locally:
- **Backend**: http://localhost:8000 (FastAPI)
- **Frontend**: http://localhost:3000 (React)
- **Database**: MongoDB (local)

## Deployment Options

### 1. Frontend Deployment (Vercel - Recommended)

```bash
cd frontend
npm run build
```

Then deploy to Vercel:
- Connect your GitHub repository
- Set build command: `npm run build`
- Set output directory: `build`
- Add environment variable: `REACT_APP_BACKEND_URL=<your-backend-url>`

### 2. Backend Deployment (Railway/Heroku)

#### Railway (Recommended)
- Connect your GitHub repository
- Set Python environment
- Add environment variables:
  ```
  MONGO_URL=<your-mongodb-atlas-url>
  DB_NAME=portfolio_db
  CORS_ORIGINS=<your-frontend-url>
  ```

#### Heroku
```bash
cd backend
heroku create your-portfolio-backend
heroku config:set MONGO_URL=<your-mongodb-atlas-url>
heroku config:set DB_NAME=portfolio_db
heroku config:set CORS_ORIGINS=<your-frontend-url>
git push heroku main
```

### 3. Database Deployment (MongoDB Atlas)

1. Create free MongoDB Atlas account
2. Create a new cluster
3. Get connection string
4. Update backend environment variables

### 4. Environment Variables for Production

#### Backend (.env)
```
MONGO_URL=mongodb+srv://<username>:<password>@<cluster>.mongodb.net
DB_NAME=portfolio_db
CORS_ORIGINS=https://your-frontend-domain.vercel.app
```

#### Frontend (.env)
```
REACT_APP_BACKEND_URL=https://your-backend-domain.railway.app
```

## Quick Deploy Commands

### Railway Backend
```bash
cd backend
railway login
railway init
railway up
```

### Vercel Frontend
```bash
cd frontend
vercel --prod
```

## Post-Deployment

1. Update your portfolio content through the admin panel
2. Test all terminal commands
3. Verify 3D animations work
4. Check mobile responsiveness
5. Test contact form functionality

## Monitoring

- Backend: Railway/Heroku dashboard
- Frontend: Vercel analytics
- Database: MongoDB Atlas monitoring
- Performance: Lighthouse scores
