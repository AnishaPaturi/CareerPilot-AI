from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from prometheus_fastapi_instrumentator import Instrumentator
from app.routers import interview, ats, dsa_planner, knowledge
from app.core.config import settings
import os

app = FastAPI(
    title="AI-CareerOS AI Services",
    description="AI-powered career services including interview simulation, ATS analysis, and DSA planning",
    version="1.0.0"
)

# Instrument the FastAPI app and expose /metrics endpoint
Instrumentator().instrument(app).expose(app)


app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(interview.router, prefix="/api/ai/interview", tags=["interview"])
app.include_router(ats.router, prefix="/api/ai/ats", tags=["ats"])
app.include_router(dsa_planner.router, prefix="/api/ai/dsa", tags=["dsa"])
app.include_router(knowledge.router, prefix="/api/ai/knowledge", tags=["knowledge"])

# Serve uploaded files
if os.path.exists("./uploads"):
    app.mount("/uploads", StaticFiles(directory="./uploads"), name="uploads")

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "AI-CareerOS AI Services"}