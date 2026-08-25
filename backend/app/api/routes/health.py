from fastapi import APIRouter


router = APIRouter(
    prefix="/health",
    tags=["Health"],
)


@router.get("/")
async def health_check():
    """
    Basic backend health check.
    """

    return {
        "status": "ok",
        "service": "LearnMate AI API",
    }