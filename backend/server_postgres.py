from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from dotenv import load_dotenv
from sqlalchemy import create_engine, Column, String, Integer, Boolean, DateTime, Text, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.sql import func
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

# Database configuration
DATABASE_URL = os.environ.get('DATABASE_URL')
if not DATABASE_URL:
    raise ValueError("DATABASE_URL environment variable is required")

# Create SQLAlchemy engine
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create base class for models
Base = declarative_base()

# Database Models
class PortfolioSection(Base):
    __tablename__ = "portfolio_sections"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    section_type = Column(String, nullable=False)
    content = Column(JSON, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

class TechSkill(Base):
    __tablename__ = "tech_skills"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False)
    category = Column(String, nullable=False)
    icon = Column(String)
    proficiency = Column(Integer, nullable=False)
    years_experience = Column(Integer)

class Project(Base):
    __tablename__ = "projects"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    tech_stack = Column(JSON, nullable=False)
    github_url = Column(String)
    live_demo_url = Column(String)
    image_url = Column(String)
    featured = Column(Boolean, default=False)
    created_at = Column(DateTime, default=func.now())

class Experience(Base):
    __tablename__ = "experience"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String, nullable=False)
    company = Column(String, nullable=False)
    location = Column(String, nullable=False)
    start_date = Column(String, nullable=False)
    end_date = Column(String)
    description = Column(Text, nullable=False)
    technologies = Column(JSON, default=list)
    is_current = Column(Boolean, default=False)

# Create tables
Base.metadata.create_all(bind=engine)

# Create the main app with rate limiting
app = FastAPI(
    title="Terminal Portfolio API",
    description="Secure API for Terminal Portfolio CMS with PostgreSQL",
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

# Pydantic Models for API
class PortfolioSectionCreate(BaseModel):
    section_type: str = Field(..., pattern="^(hero|about|skills|experience|projects|contact)$")
    content: Dict[str, Any]
    is_active: bool = True

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

class TechSkillCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    category: str = Field(..., pattern="^(languages|frameworks|databases|cloud|tools)$")
    icon: Optional[str] = Field(None, max_length=200)
    proficiency: int = Field(..., ge=1, le=5)
    years_experience: Optional[int] = Field(None, ge=0, le=50)

class ProjectCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: str = Field(..., min_length=10, max_length=2000)
    tech_stack: List[str] = Field(..., min_items=1)
    github_url: Optional[str] = Field(None, pattern=r'^https?://.*')
    live_demo_url: Optional[str] = Field(None, pattern=r'^https?://.*')
    image_url: Optional[str] = Field(None, pattern=r'^https?://.*')
    featured: bool = False

class ExperienceCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    company: str = Field(..., min_length=1, max_length=200)
    location: str = Field(..., min_length=1, max_length=200)
    start_date: str = Field(..., pattern=r'^\d{4}-\d{2}$')
    end_date: Optional[str] = Field(None, pattern=r'^\d{4}-\d{2}$')
    description: str = Field(..., min_length=10, max_length=2000)
    technologies: List[str] = Field(default_factory=list)
    is_current: bool = False

# Database dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

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
        db = SessionLocal()
        db.execute("SELECT 1")
        db.close()
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
def initialize_default_data(db: Session):
    try:
        # Check if data already exists
        existing_hero = db.query(PortfolioSection).filter_by(section_type="hero").first()
        if existing_hero:
            return
        
        # Default portfolio sections
        default_sections = [
            PortfolioSection(
                section_type="hero",
                content={
                    "name": "Software Developer",
                    "title": "Full Stack Developer & Problem Solver",
                    "tagline": "Building innovative solutions with code",
                    "terminal_intro": ["$ whoami", "Software Developer & Problem Solver", "$ echo 'Welcome to my terminal portfolio'", "Welcome to my terminal portfolio"]
                }
            ),
            PortfolioSection(
                section_type="about",
                content={
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
            ),
            PortfolioSection(
                section_type="contact",
                content={
                    "email": "your.email@example.com",
                    "linkedin": "https://linkedin.com/in/yourprofile",
                    "github": "https://github.com/yourusername",
                    "twitter": "@yourusername",
                    "phone": "+1 (555) 123-4567"
                }
            )
        ]
        
        for section in default_sections:
            db.add(section)
        
        # Default tech skills
        default_skills = [
            TechSkill(name="JavaScript", category="languages", proficiency=4),
            TechSkill(name="Python", category="languages", proficiency=4),
            TechSkill(name="React", category="frameworks", proficiency=4),
            TechSkill(name="Node.js", category="frameworks", proficiency=3),
            TechSkill(name="FastAPI", category="frameworks", proficiency=3),
            TechSkill(name="PostgreSQL", category="databases", proficiency=3),
            TechSkill(name="Git", category="tools", proficiency=4)
        ]
        
        for skill in default_skills:
            db.add(skill)
        
        # Default projects
        default_projects = [
            Project(
                title="Terminal Portfolio Website",
                description="A modern terminal-style portfolio with 3D animations and glass morphism design",
                tech_stack=["React", "Three.js", "FastAPI", "PostgreSQL"],
                featured=True
            ),
            Project(
                title="Task Management System",
                description="Full-stack application for project and task management",
                tech_stack=["React", "Node.js", "PostgreSQL"],
                featured=True
            )
        ]
        
        for project in default_projects:
            db.add(project)
        
        db.commit()
        
    except Exception as e:
        logging.error(f"Error initializing default data: {e}")
        db.rollback()
        raise

# Portfolio Section Routes
@api_router.get("/portfolio/{section_type}")
async def get_portfolio_section(section_type: str, db: Session = Depends(get_db)):
    try:
        section = db.query(PortfolioSection).filter_by(section_type=section_type, is_active=True).first()
        if not section:
            raise HTTPException(status_code=404, detail="Section not found")
        return {
            "id": section.id,
            "section_type": section.section_type,
            "content": section.content,
            "is_active": section.is_active,
            "created_at": section.created_at,
            "updated_at": section.updated_at
        }
    except Exception as e:
        logging.error(f"Error fetching portfolio section {section_type}: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@api_router.put("/portfolio/{section_type}")
async def update_portfolio_section(
    section_type: str, 
    update_data: PortfolioSectionUpdate,
    admin_token: str = Depends(verify_admin_token),
    db: Session = Depends(get_db)
):
    try:
        section = db.query(PortfolioSection).filter_by(section_type=section_type).first()
        if not section:
            raise HTTPException(status_code=404, detail="Section not found")
        
        if update_data.content is not None:
            section.content = update_data.content
        if update_data.is_active is not None:
            section.is_active = update_data.is_active
        
        section.updated_at = datetime.utcnow()
        db.commit()
        
        return {
            "id": section.id,
            "section_type": section.section_type,
            "content": section.content,
            "is_active": section.is_active,
            "created_at": section.created_at,
            "updated_at": section.updated_at
        }
    except Exception as e:
        logging.error(f"Error updating portfolio section {section_type}: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail="Internal server error")

@api_router.get("/portfolio")
async def get_all_portfolio_sections(db: Session = Depends(get_db)):
    try:
        sections = db.query(PortfolioSection).filter_by(is_active=True).all()
        return [
            {
                "id": section.id,
                "section_type": section.section_type,
                "content": section.content,
                "is_active": section.is_active,
                "created_at": section.created_at,
                "updated_at": section.updated_at
            }
            for section in sections
        ]
    except Exception as e:
        logging.error(f"Error fetching all portfolio sections: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

# Tech Skills Routes
@api_router.get("/skills", response_model=List[TechSkillCreate])
async def get_tech_skills(db: Session = Depends(get_db)):
    try:
        skills = db.query(TechSkill).all()
        return [
            {
                "id": skill.id,
                "name": skill.name,
                "category": skill.category,
                "icon": skill.icon,
                "proficiency": skill.proficiency,
                "years_experience": skill.years_experience
            }
            for skill in skills
        ]
    except Exception as e:
        logging.error(f"Error fetching skills: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@api_router.post("/skills", response_model=TechSkillCreate)
async def create_tech_skill(
    skill: TechSkillCreate,
    admin_token: str = Depends(verify_admin_token),
    db: Session = Depends(get_db)
):
    try:
        db_skill = TechSkill(
            name=skill.name,
            category=skill.category,
            icon=skill.icon,
            proficiency=skill.proficiency,
            years_experience=skill.years_experience
        )
        db.add(db_skill)
        db.commit()
        db.refresh(db_skill)
        return skill
    except Exception as e:
        logging.error(f"Error creating skill: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail="Internal server error")

# Projects Routes
@api_router.get("/projects", response_model=List[ProjectCreate])
async def get_projects(db: Session = Depends(get_db)):
    try:
        projects = db.query(Project).all()
        return [
            {
                "id": project.id,
                "title": project.title,
                "description": project.description,
                "tech_stack": project.tech_stack,
                "github_url": project.github_url,
                "live_demo_url": project.live_demo_url,
                "image_url": project.image_url,
                "featured": project.featured,
                "created_at": project.created_at
            }
            for project in projects
        ]
    except Exception as e:
        logging.error(f"Error fetching projects: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

# Experience Routes
@api_router.get("/experience", response_model=List[ExperienceCreate])
async def get_experience(db: Session = Depends(get_db)):
    try:
        experiences = db.query(Experience).all()
        return [
            {
                "id": exp.id,
                "title": exp.title,
                "company": exp.company,
                "location": exp.location,
                "start_date": exp.start_date,
                "end_date": exp.end_date,
                "description": exp.description,
                "technologies": exp.technologies,
                "is_current": exp.is_current
            }
            for exp in experiences
        ]
    except Exception as e:
        logging.error(f"Error fetching experience: {e}")
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
    return {"message": "Terminal Portfolio CMS API with PostgreSQL", "version": "1.0.0"}

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
        # Initialize default data
        db = SessionLocal()
        initialize_default_data(db)
        db.close()
        logger.info("Default portfolio data initialized")
    except Exception as e:
        logger.error(f"Failed to initialize default data: {e}")
        raise

# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    logger.error(f"Unhandled exception: {exc}")
    return {"detail": "Internal server error"}, 500
