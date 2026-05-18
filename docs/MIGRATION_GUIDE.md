# AI-CareerOS Code Migration Guide

## Overview
This guide explains how to merge your existing 8 projects into the unified AI-CareerOS platform.

## Project Integration Matrix

### 1. AI-pdf-chatbot → Knowledge Hub Service
**Source:** `C:\Users\anish\OneDrive\College\Projects\AI-pdf-chatbot\`
- Copy `backend/main.py` → `ai-services/app/routers/knowledge.py`
- Copy `backend/database.py` models to `ai-services/app/core/database.py`
- Copy `backend/auth.py` to `ai-services/app/core/auth.py`
- Copy `backend/models.py` entities to unified schema

**Key Endpoints Migrated:**
- `/upload` - PDF upload and vectorization
- `/chat` - RAG chat with documents
- `/summary` - Document summarization
- `/documents` - User document management

### 2. Smart Placement Management System → Backend Core
**Source:** `C:\Users\anish\OneDrive\College\Projects\Smart Placement_Management_System\`
- Merge Java entities to unified schema:
  - `Student.java` → `backend/src/main/java/com/careeros/model/Student.java`
  - `Company.java` → `backend/src/main/java/com/careeros/model/Company.java`
  - `Drive.java` → `backend/src/main/java/com/careeros/model/Drive.java`
  - `Job.java` → `backend/src/main/java/com/careeros/model/Job.java`
  - `Application.java` → `backend/src/main/java/com/careeros/model/Application.java`
  - `Interview.java` → `backend/src/main/java/com/careeros/model/Interview.java`

**Controllers to Migrate:**
- `AuthController.java` → `backend/src/main/java/com/careeros/controller/AuthController.java`
- `StudentController.java` → `backend/src/main/java/com/careeros/controller/StudentController.java`
- `DriveController.java` → `backend/src/main/java/com/careeros/controller/DriveController.java`
- `CompanyController.java` → `backend/src/main/java/com/careeros/controller/CompanyController.java`
- `InterviewController.java` → `backend/src/main/java/com/careeros/controller/InterviewController.java`
- `ApplicationController.java` → `backend/src/main/java/com/careeros/controller/ApplicationController.java`

### 3. ResumeIQ → Resume Studio + ATS Engine
**Source:** `C:\Users\anish\OneDrive\College\Projects\ResumeIQ\`
- Copy AI agents:
  - `agents/parserAgent.js` → `ai-services/app/agents/parser.py`
  - `agents/scoringAgent.js` → `ai-services/app/agents/scoring.py`
  - `agents/recommenderAgent.js` → `ai-services/app/agents/recommender.py`
  - `agents/matcherAgent.js` → `ai-services/app/agents/matcher.py`
  - `agents/advisorAgent.js` → `ai-services/app/agents/advisor.py`

**Resume Endpoints:**
- `/api/ats/analyze` - Resume ATS scoring
- `/api/ats/match-job` - Job matching
- `/api/ats/rewrite` - Resume rewriting

### 4. ResumeBuilder → Resume Studio UI
**Source:** `C:\Users\anish\OneDrive\College\Projects\ResumeBuilder\RB\`
- Copy React Native components:
  - `screens/FormScreen.js` → `frontend/src/screens/ResumeForm.jsx`
  - `screens/PreviewScreen.js` → `frontend/src/screens/ResumePreview.jsx`
  - `components/ResumePreview.js` → `frontend/src/components/ResumePreview.jsx`
  - `utils/storage.js` → `frontend/src/utils/resumeStorage.js`

**Frontend Pages:**
- `/resume/builder` - Drag & drop resume builder
- `/resume/preview` - Live preview
- `/resume/export` - PDF export

### 5. AlgoMentor DSA Planner → AI Career Mentor
**Source:** `C:\Users\anish\OneDrive\College\Projects\AlgoMentor-Agentic-DSA-Planner\`
- Copy Python agents:
  - `agents/planner_agent.py` → `ai-services/app/agents/dsa_planner.py`
  - `agents/recommender_agent.py` → `ai-services/app/agents/problem_recommender.py`
  - `agents/evaluator_agent.py` → `ai-services/app/agents/progress_evaluator.py`

**DSA Endpoints:**
- `/api/dsa/generate-roadmap` - Personalized roadmap
- `/api/dsa/recommend-problems` - Problem recommendations
- `/api/dsa/track-progress` - Progress tracking

### 6. AI Interview → Interview Arena
**Source:** `C:\Users\anish\OneDrive\College\Projects\AI Mock Interview Platform UI\`
- Create new interview module:
  - `/api/interview/generate-questions` - Question generation
  - `/api/interview/evaluate-answer` - Answer evaluation
  - `/api/interview/mock-session` - Full mock interview

### 7. Smart Resume Analyzer → ATS Engine
**Source:** `C:\Users\anish\OneDrive\College\Projects\Smart Resume Analyzer\`
- Add keyword matching logic to `/api/ats/analyze`

### 8. Interview-Prep/cs-notes → Prep Hub
**Source:** `Interview-Prep/cs-notes` (if exists locally)
- Import notes as knowledge base documents
- Add to `/api/knowledge` endpoints

## Migration Commands

### Copy Backend Code
```powershell
# From Smart Placement Management System
Copy-Item "Smart Placement_Management_System\backend\src\main\java\com\placement\*.java" "AI-CareerOS\backend\src\main\java\com\careeros\" -Recurse

# From ResumeIQ
Copy-Item "ResumeIQ\resumeai\backend\agents\*.js" "AI-CareerOS\ai-services\app\agents\"
```

### Copy Frontend Code
```powershell
# From ResumeBuilder
Copy-Item "ResumeBuilder\RB\screens\*.js" "AI-CareerOS\frontend\src\screens\"
Copy-Item "ResumeBuilder\RB\components\*.js" "AI-CareerOS\frontend\src\components\"
```

## Database Migration

Run the unified schema:
```sql
mysql -u root -p < backend/src/main/resources/schema.sql
```

## Environment Variables

Create `.env` files:

### backend/.env
```
DATABASE_URL=jdbc:mysql://localhost:3306/careeros
JWT_SECRET=your-secret-key
OPENROUTER_API_KEY=sk-...
```

### ai-services/.env
```
OPENAI_API_KEY=sk-...
OPENROUTER_API_KEY=sk-...
CHROMA_DB_DIR=./chroma_db
UPLOAD_DIR=./uploads
```

## Running the Platform

1. Start MySQL: `mysql -u root -p`
2. Run schema: `mysql < backend/src/main/resources/schema.sql`
3. Start backend: `cd backend && ./mvnw spring-boot:run`
4. Start AI services: `cd ai-services && uvicorn app.main:app --reload`
5. Start frontend: `cd frontend && npm run dev`

## API Gateway Configuration

Configure NGINX to route:
- `/api/auth/*` → backend:8080
- `/api/placement/*` → backend:8080
- `/api/resume/*` → backend:8080
- `/api/interview/*` → ai-services:8000
- `/api/ats/*` → ai-services:8000
- `/api/dsa/*` → ai-services:8000
- `/api/knowledge/*` → ai-services:8000