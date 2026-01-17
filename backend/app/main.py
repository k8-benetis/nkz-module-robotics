"""
FastAPI main application for Robotics Module.
"""

import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import robotics
from app.db import init_db

logger = logging.getLogger(__name__)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events."""
    logger.info("Starting Robotics Module API...")
    
    # Initialize database tables
    try:
        init_db()
        logger.info("Database tables initialized")
    except Exception as e:
        logger.warning(f"Database initialization warning: {e}")
    
    yield
    
    logger.info("Shutting down Robotics Module API...")


# Create FastAPI app
app = FastAPI(
    title="Robotics Module API",
    description="""
    Advanced Robotics Module for Nekazari Platform.
    
    ## Features
    - Zenoh Configuration Generator
    - Robot Fleet Management
    - Real-time Telemetry Gateway
    """,
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(robotics.router, prefix="/api/robotics", tags=["Robotics"])


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "module": "robotics",
        "version": "1.0.0"
    }


@app.get("/")
async def root():
    """Root endpoint with API info."""
    return {
        "module": "nkz-module-robotics",
        "version": "1.0.0",
        "description": "Robotics & Telemetry Module for Nekazari",
        "docs": "/docs",
        "health": "/health"
    }
