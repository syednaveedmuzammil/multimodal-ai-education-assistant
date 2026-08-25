from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes.auth import router as auth_router
from app.api.routes.health import router as health_router
from app.core.config import settings


app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description=(
        "Backend API for LearnMate AI, a multimodal "
        "AI-powered education assistant."
    ),
)


# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.frontend_url,
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# API Routes
# ============================================================

app.include_router(
    health_router,
    prefix="/api",
)

app.include_router(
    auth_router,
    prefix="/api",
)


# ============================================================
# Root Endpoint
# ============================================================

@app.get("/")
async def root():
    """
    Root endpoint used to verify that the FastAPI server is running.
    """

    return {
        "message": "Welcome to LearnMate AI API",
        "version": settings.app_version,
        "status": "running",
    }