from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, validator
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timedelta
import secrets

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Security configuration
SECRET_KEY = os.environ.get('SECRET_KEY', secrets.token_urlsafe(32))
ADMIN_TOKEN = os.environ.get('ADMIN_TOKEN', secrets.token_urlsafe(32))
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.environ.get('ACCESS_TOKEN_EXPIRE_MINUTES', '30'))

# Rate limiting
limiter = Limiter(key_func=get_remote_address)

# MongoDB connection with proper error handling
mongo_url = os.environ.get('MONGO_URL')
if not mongo_url:
    raise ValueError("MONGO_URL environment variable is required")

client = AsyncIOMotorClient(mongo_url, serverSelectionTimeoutMS=5000)
db = client[os.environ.get('DB_NAME', 'portfolio_db')]

# Create the main app with rate limiting
app = FastAPI(
    title="Terminal Portfolio API",
    description="Secure API for Terminal Portfolio CMS",
    version="1.0.0",
    docs_url="/docs" if os.environ.get('ENVIRONMENT') != 'production' else None,
    redoc_url="/redoc" if os.environ.get('ENVIRONMENT') != 'production' else None
)

# Add rate limiting
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Security middleware
security = HTTPBearer()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Portfolio Data Models with validation
class PortfolioSection(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    section_type: str = Field(..., pattern="^(hero|about|skills|experience|projects|contact)$")
    content: Dict[str, Any]
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    @validator('content')
    def validate_content(cls, v):
        if not isinstance(v, dict):
            raise ValueError('Content must be a dictionary')
        if len(v) == 0:
            raise ValueError('Content cannot be empty')
        return v

class PortfolioSectionUpdate(BaseModel):
    content: Dict[str, Any]
    is_active: Optional[bool] = None

    @validator('content')
    def validate_content(cls, v):
        if not isinstance(v, dict):
            raise ValueError('Content must be a dictionary')
        if len(v) == 0:
            raise ValueError('Content cannot be empty')
        return v

class TechSkill(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str = Field(..., min_length=1, max_length=100)
    category: str = Field(..., pattern="^(languages|frameworks|databases|cloud|tools)$")
    icon: Optional[str] = Field(None, max_length=200)
    proficiency: int = Field(..., ge=1, le=5)
    years_experience: Optional[int] = Field(None, ge=0, le=50)

class Project(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str = Field(..., min_length=1, max_length=200)
    description: str = Field(..., min_length=10, max_length=2000)
    tech_stack: List[str] = Field(..., min_items=1)
    github_url: Optional[str] = Field(None, pattern=r'^https?://.*')
    live_demo_url: Optional[str] = Field(None, pattern=r'^https?://.*')
    image_url: Optional[str] = Field(None, pattern=r'^https?://.*')
    featured: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Experience(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str = Field(..., min_length=1, max_length=200)
    company: str = Field(..., min_length=1, max_length=200)
    location: str = Field(..., min_length=1, max_length=200)
    start_date: str = Field(..., pattern=r'^\d{4}-\d{2}$')
    end_date: Optional[str] = Field(None, pattern=r'^\d{4}-\d{2}$')
    description: str = Field(..., min_length=10, max_length=2000)
    technologies: List[str] = Field(default_factory=list)
    is_current: bool = False

# Authentication
async def verify_admin_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    if credentials.credentials != ADMIN_TOKEN:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid admin token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return credentials.credentials

# Health check endpoint
@api_router.get("/health")
async def health_check():
    try:
        # Test database connection
        await db.command("ping")
        return {
            "status": "healthy",
            "timestamp": datetime.utcnow().isoformat(),
            "database": "connected"
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Service unhealthy: {str(e)}"
        )

# Initialize default portfolio data
async def initialize_default_data():
    try:
        # Check if data already exists
        existing_hero = await db.portfolio_sections.find_one({"section_type": "hero"})
        if existing_hero:
            return
        
        # Default portfolio sections
        default_sections = [
            {
                "section_type": "hero",
                "content": {
                    "name": "Software Developer",
                    "title": "Full Stack Developer & Problem Solver",
                    "tagline": "Building innovative solutions with code",
                    "terminal_intro": ["$ whoami", "Software Developer & Problem Solver", "$ echo 'Welcome to my terminal portfolio'", "Welcome to my terminal portfolio"]
                }
            },
            {
                "section_type": "about",
                "content": {
                    "name": "Your Name",
                    "bio": "Passionate software developer with expertise in full-stack development. I enjoy creating elegant solutions to complex problems.",
                    "education": {
                        "institution": "Conestoga College",
                        "degree": "Software Engineering",
                        "year": "2023"
                    },
                    "location": "Canada",
                    "email": "your.email@example.com"
                }
            },
            {
                "section_type": "contact",
                "content": {
                    "email": "your.email@example.com",
                    "linkedin": "https://linkedin.com/in/yourprofile",
                    "github": "https://github.com/yourusername",
                    "twitter": "@yourusername",
                    "phone": "+1 (555) 123-4567"
                }
            }
        ]
        
        for section_data in default_sections:
            section = PortfolioSection(**section_data)
            await db.portfolio_sections.insert_one(section.dict())
        
        # Default tech skills
        default_skills = [
            {"name": "JavaScript", "category": "languages", "proficiency": 4},
            {"name": "Python", "category": "languages", "proficiency": 4},
            {"name": "React", "category": "frameworks", "proficiency": 4},
            {"name": "Node.js", "category": "frameworks", "proficiency": 3},
            {"name": "FastAPI", "category": "frameworks", "proficiency": 3},
            {"name": "MongoDB", "category": "databases", "proficiency": 3},
            {"name": "PostgreSQL", "category": "databases", "proficiency": 3},
            {"name": "AWS", "category": "cloud", "proficiency": 2},
            {"name": "Docker", "category": "tools", "proficiency": 3},
            {"name": "Git", "category": "tools", "proficiency": 4}
        ]
        
        for skill_data in default_skills:
            skill = TechSkill(**skill_data)
            await db.tech_skills.insert_one(skill.dict())
        
        # Default projects
        default_projects = [
            {
                "title": "Terminal Portfolio Website",
                "description": "A modern terminal-style portfolio with 3D animations and glass morphism design",
                "tech_stack": ["React", "Three.js", "FastAPI", "MongoDB"],
                "featured": True
            },
            {
                "title": "Task Management System",
                "description": "Full-stack application for project and task management",
                "tech_stack": ["React", "Node.js", "PostgreSQL"],
                "featured": True
            }
        ]
        
        for project_data in default_projects:
            project = Project(**project_data)
            await db.projects.insert_one(project.dict())
            
    except Exception as e:
        logging.error(f"Error initializing default data: {e}")
        raise

# Portfolio Section Routes
@api_router.get("/portfolio/{section_type}")
async def get_portfolio_section(section_type: str):
    try:
        section = await db.portfolio_sections.find_one({"section_type": section_type, "is_active": True})
        if not section:
            raise HTTPException(status_code=404, detail="Section not found")
        return PortfolioSection(**section)
    except Exception as e:
        logging.error(f"Error fetching portfolio section {section_type}: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@api_router.put("/portfolio/{section_type}")
async def update_portfolio_section(
    section_type: str, 
    update_data: PortfolioSectionUpdate,
    admin_token: str = Depends(verify_admin_token)
):
    try:
        update_dict = {"content": update_data.content, "updated_at": datetime.utcnow()}
        if update_data.is_active is not None:
            update_dict["is_active"] = update_data.is_active
        
        result = await db.portfolio_sections.update_one(
            {"section_type": section_type},
            {"$set": update_dict}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Section not found")
        
        updated_section = await db.portfolio_sections.find_one({"section_type": section_type})
        return PortfolioSection(**updated_section)
    except Exception as e:
        logging.error(f"Error updating portfolio section {section_type}: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@api_router.get("/portfolio")
async def get_all_portfolio_sections():
    try:
        sections = await db.portfolio_sections.find({"is_active": True}).to_list(100)
        return [PortfolioSection(**section) for section in sections]
    except Exception as e:
        logging.error(f"Error fetching all portfolio sections: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

# Tech Skills Routes
@api_router.get("/skills", response_model=List[TechSkill])
async def get_tech_skills():
    try:
        skills = await db.tech_skills.find().to_list(100)
        return [TechSkill(**skill) for skill in skills]
    except Exception as e:
        logging.error(f"Error fetching skills: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@api_router.post("/skills", response_model=TechSkill)
async def create_tech_skill(
    skill: TechSkill,
    admin_token: str = Depends(verify_admin_token)
):
    try:
        await db.tech_skills.insert_one(skill.dict())
        return skill
    except Exception as e:
        logging.error(f"Error creating skill: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@api_router.put("/skills/{skill_id}")
async def update_tech_skill(
    skill_id: str, 
    skill_update: TechSkill,
    admin_token: str = Depends(verify_admin_token)
):
    try:
        result = await db.tech_skills.update_one(
            {"id": skill_id},
            {"$set": skill_update.dict()}
        )
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Skill not found")
        return skill_update
    except Exception as e:
        logging.error(f"Error updating skill {skill_id}: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@api_router.delete("/skills/{skill_id}")
async def delete_tech_skill(
    skill_id: str,
    admin_token: str = Depends(verify_admin_token)
):
    try:
        result = await db.tech_skills.delete_one({"id": skill_id})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Skill not found")
        return {"message": "Skill deleted successfully"}
    except Exception as e:
        logging.error(f"Error deleting skill {skill_id}: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

# Projects Routes
@api_router.get("/projects", response_model=List[Project])
async def get_projects():
    try:
        projects = await db.projects.find().to_list(100)
        return [Project(**project) for project in projects]
    except Exception as e:
        logging.error(f"Error fetching projects: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@api_router.post("/projects", response_model=Project)
async def create_project(
    project: Project,
    admin_token: str = Depends(verify_admin_token)
):
    try:
        await db.projects.insert_one(project.dict())
        return project
    except Exception as e:
        logging.error(f"Error creating project: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@api_router.put("/projects/{project_id}")
async def update_project(
    project_id: str, 
    project_update: Project,
    admin_token: str = Depends(verify_admin_token)
):
    try:
        result = await db.projects.update_one(
            {"id": project_id},
            {"$set": project_update.dict()}
        )
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Project not found")
        return project_update
    except Exception as e:
        logging.error(f"Error updating project {project_id}: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@api_router.delete("/projects/{project_id}")
async def delete_project(
    project_id: str,
    admin_token: str = Depends(verify_admin_token)
):
    try:
        result = await db.projects.delete_one({"id": project_id})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Project not found")
        return {"message": "Project deleted successfully"}
    except Exception as e:
        logging.error(f"Error deleting project {project_id}: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

# Experience Routes
@api_router.get("/experience", response_model=List[Experience])
async def get_experience():
    try:
        experiences = await db.experience.find().to_list(100)
        return [Experience(**exp) for exp in experiences]
    except Exception as e:
        logging.error(f"Error fetching experience: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@api_router.post("/experience", response_model=Experience)
async def create_experience(
    experience: Experience,
    admin_token: str = Depends(verify_admin_token)
):
    try:
        await db.experience.insert_one(experience.dict())
        return experience
    except Exception as e:
        logging.error(f"Error creating experience: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

# Terminal Commands
@api_router.get("/terminal/commands")
async def get_terminal_commands():
    commands = [
        {"command": "help", "description": "Show available commands", "section": "system", "is_admin": False},
        {"command": "about", "description": "Display about section", "section": "about", "is_admin": False},
        {"command": "whoami", "description": "Display developer info", "section": "hero", "is_admin": False},
        {"command": "skills", "description": "List technical skills", "section": "skills", "is_admin": False},
        {"command": "projects", "description": "Show projects grid", "section": "projects", "is_admin": False},
        {"command": "experience", "description": "Display work history", "section": "experience", "is_admin": False},
        {"command": "contact", "description": "Open contact form", "section": "contact", "is_admin": False},
        {"command": "clear", "description": "Clear terminal screen", "section": "system", "is_admin": False},
        {"command": "edit", "description": "Enter edit mode (Admin)", "section": "admin", "is_admin": True},
        {"command": "theme", "description": "Toggle theme", "section": "system", "is_admin": False}
    ]
    return commands

# Root route
@api_router.get("/")
async def root():
    return {"message": "Terminal Portfolio CMS API", "version": "1.0.0"}

# Include the router in the main app
app.include_router(api_router)

# Secure CORS configuration
cors_origins = os.environ.get('CORS_ORIGINS', 'http://localhost:3000').split(',')
if os.environ.get('ENVIRONMENT') == 'production':
    # In production, only allow specific origins
    cors_origins = [origin.strip() for origin in cors_origins if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=cors_origins,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
    max_age=3600,
)

# Configure logging
logging.basicConfig(
    level=logging.INFO if os.environ.get('ENVIRONMENT') != 'production' else logging.WARNING,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("startup")
async def startup_event():
    try:
        await initialize_default_data()
        logger.info("Default portfolio data initialized")
    except Exception as e:
        logger.error(f"Failed to initialize default data: {e}")
        raise

@app.on_event("shutdown")
async def shutdown_db_client():
    try:
        client.close()
        logger.info("Database connection closed")
    except Exception as e:
        logger.error(f"Error closing database connection: {e}")

# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    logger.error(f"Unhandled exception: {exc}")
    return {"detail": "Internal server error"}, 500