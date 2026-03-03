"""
API routes for EdTech AI Services.
Contains all endpoint versions and routers.
"""

from fastapi import APIRouter
from app.api import v1
from app.api.v1 import quiz, hackathon, interview

api_router = APIRouter()

# Include v1 routes
api_router.include_router(quiz.router, prefix="/v1")
api_router.include_router(hackathon.router, prefix="/v1")
api_router.include_router(interview.router, prefix="/v1")

__all__ = [
    "api_router",
    "v1",
]
