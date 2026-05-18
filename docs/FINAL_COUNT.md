# AI-CareerOS - Final File Count

## Copied from Existing Projects

### Backend (Java - Spring Boot)
- **Source:** Smart Placement Management System
- **Files:** 23 Java files in `backend/src/main/java/com/careeros/`
  - Models: User, Student, Job, Company, Drive, Interview, Application, Admin, ResumeAnalysis
  - Controllers: Auth, Student, Job, Company, Drive, Interview, Application, Analytics, Ai, PasswordReset, Round

### AI Services (Python - FastAPI)
- **Sources:** AI-pdf-chatbot, ResumeIQ, AlgoMentor
- **Files:** 15 Python files in `ai-services/app/`

**From AI-pdf-chatbot:**
- database.py, auth.py, models.py (core modules)
- knowledge_original.py (RAG chatbot)

**From ResumeIQ:**  
- parserAgent.js, scoringAgent.js, advisorAgent.js, matcherAgent.js
- Converted: parser.py, scoring.py

**From AlgoMentor:**
- planner_agent.py, recommender_agent.py, evaluator_agent.py

**New AI Services:**
- interview.py, ats.py, dsa_planner.py, knowledge.py

### Frontend (React)
- **Sources:** ResumeBuilder, ResumeIQ
- **Files:** 15 JSX files in `frontend/src/`

**From ResumeBuilder:**
- HomeScreen.js, FormScreen.jsx, PreviewScreen.jsx
- ResumePreview.jsx

**From ResumeIQ:**
- App.jsx, Dashboard.jsx, Login.jsx, Signup.jsx, Report.jsx
- ProtectedRoute.jsx, AuthContext.jsx, AppLayout.jsx