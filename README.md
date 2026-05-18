# AI-CareerOS

A unified AI-powered career preparation ecosystem combining placement management, resume optimization, interview simulation, and DSA planning.

## Architecture

```
AI-CareerOS/
├── backend/          # Spring Boot REST API (Java 17)
├── ai-services/      # Python FastAPI AI microservices
├── frontend/         # React + TypeScript
├── docs/             # Documentation
└── shared/           # Common utilities
```

## Services

### Backend (Port 8080)
- User authentication & authorization
- Placement management (companies, drives, applications)
- Student profiles & eligibility
- Interview scheduling
- Notifications

### AI Services (Port 8000)
- **Interview Arena** - Mock interviews with AI feedback
- **ATS Engine** - Resume scoring & job matching
- **DSA Planner** - Personalized coding roadmaps
- **Knowledge Hub** - PDF chatbot with RAG

### Frontend (Port 3000)
- Student Dashboard
- Resume Studio
- Interview Arena
- DSA Planner
- Knowledge Hub

## Quick Start

```bash
# Backend (Java)
cd backend && ./mvnw spring-boot:run

# AI Services (Python)
cd ai-services && pip install -r requirements.txt
uvicorn app.main:app --reload

# Frontend
cd frontend && npm install && npm run dev
```

## Database

```sql
mysql -u root -p < backend/src/main/resources/schema.sql
```

## Migration Guide

See `docs/MIGRATION_GUIDE.md` for integrating existing projects.

## Environment Variables

Create `.env` files in `backend/` and `ai-services/` directories.