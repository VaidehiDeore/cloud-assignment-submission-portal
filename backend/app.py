from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.auth import router as auth_router
from routes.assignments import router as assignments_router
from routes.submissions import router as submissions_router
from routes.feedback import router as feedback_router
from routes.files import router as files_router
from routes.dashboard import router as dashboard_router
from middleware.error_handler import register_exception_handlers
from utils.config import settings

app = FastAPI(
    title="Cloud Assignment Submission Portal API",
    version="1.0.0",
    description="Cloud-based student assignment submission and feedback portal.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.frontend_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/api")
app.include_router(assignments_router, prefix="/api")
app.include_router(submissions_router, prefix="/api")
app.include_router(feedback_router, prefix="/api")
app.include_router(files_router, prefix="/api")
app.include_router(dashboard_router, prefix="/api")

register_exception_handlers(app)

@app.get("/")
def root():
    return {
        "message": "Cloud Assignment Submission Portal API",
        "status": "running",
        "docs": "/docs",
    }

@app.get("/health")
def health():
    return {"status": "healthy"}
