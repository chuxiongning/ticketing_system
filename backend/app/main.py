"""
FastAPI Application for EV Charging Station Maintenance System
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .core.config import settings
from .core.database import init_db
from .routers import auth, tickets, templates, users, files, face_recognition


# Create FastAPI app
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    debug=settings.DEBUG
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Include routers
app.include_router(auth.router, prefix=settings.API_PREFIX)
app.include_router(tickets.router, prefix=settings.API_PREFIX)
app.include_router(templates.router, prefix=settings.API_PREFIX)
app.include_router(users.router, prefix=settings.API_PREFIX)
app.include_router(files.router, prefix=settings.API_PREFIX)
app.include_router(face_recognition.router, prefix=settings.API_PREFIX)


@app.on_event("startup")
async def startup_event():
    """Initialize database on startup"""
    init_db()


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "EV Charging Station Maintenance API",
        "version": settings.APP_VERSION,
        "docs": "/docs"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
