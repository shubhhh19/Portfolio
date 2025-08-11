from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, String, Text, DateTime, Integer
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from pydantic import BaseModel, Field, validator
from datetime import datetime
import os
from dotenv import load_dotenv
import logging

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=getattr(logging, os.getenv('LOG_LEVEL', 'INFO')))
logger = logging.getLogger(__name__)

# Database configuration
DATABASE_URL = os.getenv('DATABASE_URL')
if not DATABASE_URL:
    raise ValueError("DATABASE_URL environment variable is required")

# Create SQLAlchemy engine
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create tables
Base = declarative_base()

class PortfolioSection(Base):
    __tablename__ = "portfolio_sections"
    
    id = Column(Integer, primary_key=True, index=True)
    section_name = Column(String(100), unique=True, index=True)
    title = Column(String(200))
    content = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class TechSkill(Base):
    __tablename__ = "tech_skills"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, index=True)
    category = Column(String(50))
    proficiency = Column(Integer)
    created_at = Column(DateTime, default=datetime.utcnow)

class Project(Base):
    __tablename__ = "projects"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200))
    description = Column(Text)
    technologies = Column(String(500))
    github_url = Column(String(500))
    live_url = Column(String(500))
    created_at = Column(DateTime, default=datetime.utcnow)

class Experience(Base):
    __tablename__ = "experience"
    
    id = Column(Integer, primary_key=True, index=True)
    company = Column(String(200))
    position = Column(String(200))
    duration = Column(String(100))
    description = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

# Create tables
Base.metadata.create_all(bind=engine)

# Pydantic models
class PortfolioSectionCreate(BaseModel):
    section_name: str = Field(..., min_length=1, max_length=100)
    title: str = Field(..., min_length=1, max_length=200)
    content: str = Field(..., min_length=1)
    
    @validator('section_name')
    def validate_section_name(cls, v):
        if not v.replace('_', '').replace('-', '').isalnum():
            raise ValueError('Section name must be alphanumeric with underscores or hyphens only')
        return v

class TechSkillCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    category: str = Field(..., min_length=1, max_length=50)
    proficiency: int = Field(..., ge=1, le=10)

class ProjectCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: str = Field(..., min_length=1)
    technologies: str = Field(..., min_length=1, max_length=500)
    github_url: str = Field(..., min_length=1, max_length=500)
    live_url: str = Field(..., min_length=1, max_length=500)

class ExperienceCreate(BaseModel):
    company: str = Field(..., min_length=1, max_length=200)
    position: str = Field(..., min_length=1, max_length=200)
    duration: str = Field(..., min_length=1, max_length=100)
    description: str = Field(..., min_length=1)

# FastAPI app
app = FastAPI(
    title="Terminal Portfolio CMS API",
    description="A FastAPI backend for managing portfolio content with PostgreSQL",
    version="1.0.0",
    docs_url="/docs" if os.getenv('ENVIRONMENT') != 'production' else None,
    redoc_url="/redoc" if os.getenv('ENVIRONMENT') != 'production' else None
)

# CORS middleware
cors_origins = os.getenv('CORS_ORIGINS', 'http://localhost:3000').split(',')
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

# Database dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Health check endpoint
@app.get("/api/health")
async def health_check():
    try:
        # Test database connection
        db = SessionLocal()
        db.execute("SELECT 1")
        db.close()
        return {
            "status": "healthy",
            "database": "connected",
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Service unhealthy: {str(e)}"
        )

# API endpoints
@app.get("/")
async def root():
    return {"message": "Terminal Portfolio CMS API with PostgreSQL"}

@app.get("/api/portfolio/{section_name}")
async def get_portfolio_section(section_name: str, db: Session = Depends(get_db)):
    section = db.query(PortfolioSection).filter(PortfolioSection.section_name == section_name).first()
    if not section:
        raise HTTPException(status_code=404, detail="Section not found")
    return section

@app.put("/api/portfolio/{section_name}")
async def update_portfolio_section(
    section_name: str, 
    section_data: PortfolioSectionCreate, 
    db: Session = Depends(get_db)
):
    section = db.query(PortfolioSection).filter(PortfolioSection.section_name == section_name).first()
    if not section:
        section = PortfolioSection(section_name=section_name)
        db.add(section)
    
    section.title = section_data.title
    section.content = section_data.content
    section.updated_at = datetime.utcnow()
    
    db.commit()
    db.refresh(section)
    return section

@app.get("/api/portfolio")
async def get_all_portfolio_sections(db: Session = Depends(get_db)):
    sections = db.query(PortfolioSection).all()
    return sections

@app.get("/api/tech-skills")
async def get_tech_skills(db: Session = Depends(get_db)):
    skills = db.query(TechSkill).all()
    return skills

@app.post("/api/tech-skills")
async def create_tech_skill(skill: TechSkillCreate, db: Session = Depends(get_db)):
    db_skill = TechSkill(**skill.dict())
    db.add(db_skill)
    db.commit()
    db.refresh(db_skill)
    return db_skill

@app.get("/api/projects")
async def get_projects(db: Session = Depends(get_db)):
    projects = db.query(Project).all()
    return projects

@app.post("/api/projects")
async def create_project(project: ProjectCreate, db: Session = Depends(get_db)):
    db_project = Project(**project.dict())
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project

@app.get("/api/experience")
async def get_experience(db: Session = Depends(get_db)):
    experience = db.query(Experience).all()
    return experience

@app.post("/api/experience")
async def create_experience(exp: ExperienceCreate, db: Session = Depends(get_db)):
    db_exp = Experience(**exp.dict())
    db.add(db_exp)
    db.commit()
    db.refresh(db_exp)
    return db_exp

# Initialize default data
def initialize_default_data():
    try:
        db = SessionLocal()
        
        # Check if data already exists
        if db.query(PortfolioSection).count() == 0:
            default_sections = [
                PortfolioSection(
                    section_name="hero",
                    title="Welcome to My Portfolio",
                    content="Hi, I'm a passionate developer building amazing things!"
                ),
                PortfolioSection(
                    section_name="about",
                    title="About Me",
                    content="I love coding, problem-solving, and creating innovative solutions."
                )
            ]
            
            for section in default_sections:
                db.add(section)
            
            db.commit()
            logger.info("Default portfolio sections created")
        
        db.close()
    except Exception as e:
        logger.error(f"Failed to initialize default data: {e}")

# Startup and shutdown events
@app.on_event("startup")
async def startup_event():
    logger.info("Starting Portfolio CMS API...")
    initialize_default_data()

@app.on_event("shutdown")
async def shutdown_event():
    logger.info("Shutting down Portfolio CMS API...")

# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    logger.error(f"Unhandled exception: {exc}")
    return {"detail": "Internal server error"}, 500
