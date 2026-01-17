"""
Configuration module for LIDAR backend.
Loads settings from environment variables with sensible defaults.
"""

import os
from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    """Application settings."""
    API_V1_STR: str = "/api"
    PROJECT_NAME: str = "Robotics Module API"
    
    # Shared Services
    REDIS_URL: str = "redis://redis:6379/0"
    DATABASE_URL: str = "postgresql+asyncpg://postgres:postgres@timescaledb:5432/nekazari"
    
    # MinIO / S3 Storage
    MINIO_ENDPOINT: str = "minio:9000"
    MINIO_ACCESS_KEY: str = "minioadmin"
    MINIO_SECRET_KEY: str = "minioadmin"
    MINIO_SECURE: bool = False
    
    TILESET_PUBLIC_URL: str = "https://nkz.artotxiki.com/lidar-tilesets"
    
    # Orion-LD Context Broker
    ORION_URL: str = "http://orion-ld:1026"
    
    # Keycloak (for token validation)
    KEYCLOAK_URL: str = "https://auth.artotxiki.com/auth"
    KEYCLOAK_REALM: str = "nekazari"
    
    # PNOA / CNIG data source
    PNOA_SHAPEFILE_PATH: Optional[str] = None  # Path to local shapefile if downloaded
    
    # Processing settings
    DEFAULT_TREE_MIN_HEIGHT: float = 2.0  # meters
    DEFAULT_TREE_SEARCH_RADIUS: float = 3.0  # meters
    
    # Worker settings
    WORKER_QUEUE_NAME: str = "lidar-processing"
    WORKER_TIMEOUT: int = 1800  # 30 minutes max per job
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = "ignore"


# Singleton settings instance
settings = Settings()
