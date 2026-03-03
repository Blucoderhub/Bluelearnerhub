from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
import time

from app.config import settings
from app.api import api_router
from app.core.logging import logger
from app.core.database import redis_client


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifespan events for startup and shutdown
    """
    # Startup
    logger.info("Starting AI Services...")
    logger.info(f"Environment: {settings.debug}")

    # Test Redis connection
    try:
        if redis_client is None:
            logger.warning("Redis client is not initialized")
        else:
            await redis_client.ping()
            logger.info("✓ Redis connected successfully")
    except Exception as e:
        logger.error(f"✗ Redis connection failed: {e}")

    yield

    # Shutdown
    logger.info("Shutting down AI Services...")
    try:
        if redis_client is not None:
            await redis_client.close()
    except Exception as e:
        logger.error(f"Error while closing Redis client: {e}")


# Create FastAPI app
app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="AI/ML services for EdTech platform",
    lifespan=lifespan
)

# Import and setup security middleware
from app.security import setup_security_middleware, setup_https_redirect, validate_security_config

# Validate security configuration
try:
    validate_security_config()
except ValueError as e:
    logger.warning(f"Security configuration warning: {e}")

# Setup security middleware
setup_security_middleware(app)
setup_https_redirect(app)

# Legacy CORS (kept for compatibility, but overridden by security.py)
# CORS middleware is now handled by security.py with proper origin validation
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],  # Now handled by security.py
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )


# Request logging middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    """Log all requests"""
    start_time = time.time()

    logger.info(f"Request: {request.method} {request.url.path}")

    response = await call_next(request)

    process_time = time.time() - start_time
    logger.info(
        f"Response: {response.status_code} - "
        f"Time: {process_time:.3f}s"
    )

    return response


# Exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Global exception handler"""
    logger.error(f"Global exception: {str(exc)}", exc_info=True)

    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "message": "Internal server error",
            "detail": str(exc) if settings.debug else None
        }
    )


# Health check
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": settings.app_name,
        "version": settings.app_version
    }


# Include API routes
app.include_router(api_router, prefix="/api")


# Root endpoint
@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "service": settings.app_name,
        "version": settings.app_version,
        "docs": "/docs",
        "health": "/health"
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "app.main:app",
        host=settings.host,
        port=settings.port,
        reload=settings.debug,
        log_level=settings.log_level.lower()
    )
