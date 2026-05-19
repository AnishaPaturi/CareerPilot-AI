from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import interview, ats, dsa_planner, knowledge
from app.core.config import settings

app = FastAPI(
    title="AI-CareerOS AI Services",
    description="AI-powered career services including interview simulation, ATS analysis, and DSA planning",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(interview.router, prefix="/api/ai/interview", tags=["interview"])
app.include_router(ats.router, prefix="/api/ai/ats", tags=["ats"])
app.include_router(dsa_planner.router, prefix="/api/ai/dsa", tags=["dsa"])
app.include_router(knowledge.router, prefix="/api/ai/knowledge", tags=["knowledge"])

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "AI-CareerOS AI Services"}