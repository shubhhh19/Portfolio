# Terminal Portfolio Website

A modern, interactive portfolio website built with React, Three.js, and FastAPI. Features a terminal-style interface with 3D animations and glass morphism design.

## Features

- 🖥️ **Terminal Interface** - Interactive command-line experience
- 🎨 **3D Graphics** - Three.js powered animations and backgrounds
- 🎭 **Glass Morphism** - Modern UI design with transparency effects
- 📱 **Responsive Design** - Works on all devices
- 🚀 **Fast API Backend** - Python FastAPI with MongoDB
- 🎯 **Portfolio Sections** - Hero, About, Skills, Projects, Experience, Contact

## Tech Stack

### Frontend
- React 19
- Three.js for 3D graphics
- Tailwind CSS for styling
- Framer Motion for animations
- GSAP for advanced animations

### Backend
- FastAPI (Python)
- MongoDB with Motor (async)
- CORS enabled for frontend integration

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.8+
- MongoDB

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd Portfolio
   ```

2. **Backend Setup**
   ```bash
   cd backend
   pip install -r requirements.txt
   # Create .env file with your MongoDB connection
   uvicorn server:app --reload --port 8000
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm start
   ```

4. **Environment Variables**
   
   Backend (.env):
   ```
   MONGO_URL=mongodb://localhost:27017
   DB_NAME=portfolio_db
   CORS_ORIGINS=http://localhost:3000
   ```
   
   Frontend (.env):
   ```
   REACT_APP_BACKEND_URL=http://localhost:8000
   ```

## Usage

- Open the website and type `help` in the terminal
- Navigate through different sections using terminal commands
- Explore the 3D interactive elements
- View your portfolio content dynamically

## Deployment

The application is ready for deployment to platforms like:
- Vercel (Frontend)
- Railway/Heroku (Backend)
- MongoDB Atlas (Database)

## License

MIT License
