# AI CareerOS — Unified AI Career Ecosystem

AI CareerOS (also known as **CareerPilot-AI**) is a unified, intelligent career preparation and placement ecosystem. Instead of relying on disconnected tools, the platform consolidates placement management, automated resume auditing, mock interview simulation, DSA roadmapping, and document RAG-based study assistants into a single unified product.

Designed with a high-performance microservices blueprint, it is built to demonstrate startup-level system design and software architecture.

---

## 🏗️ System Architecture

The platform uses a decoupled backend design: an enterprise-level Spring Boot gateway that manages relational data and role authentication, alongside a Python FastAPI microservice that drives all LLM, RAG, and vector operations.

```mermaid
graph TD
    User([User: Student / Admin / Recruiter]) -->|React SPA| Frontend[Frontend: React + Vite + Tailwind]
    Frontend -->|HTTP / JSON / JWT| API_Gateway[API Gateway / Spring Boot]
    
    subgraph Spring_Boot_Gateway ["Spring Boot Gateway Service (Port 9999)"]
        API_Gateway --> AuthServ[Auth & Profile Management]
        API_Gateway --> PlacementServ[Placement Drives & Job Postings]
        API_Gateway --> ProxyServ[AiController: API Router]
    end
    
    ProxyServ -->|REST Proxy / JSON| FastAPI[AI Core: Python FastAPI (Port 8000)]
    
    subgraph Python_FastAPI ["FastAPI AI Services Core"]
        FastAPI --> ATS[Resume ATS Engine]
        FastAPI --> RAG[RAG Knowledge Assistant]
        FastAPI --> Interview[Mock Interview Simulator]
        FastAPI --> DSA[AlgoMentor DSA Planner]
    end
    
    Spring_Boot_Gateway -->|SQL| MySQL[(MySQL Database)]
    Python_FastAPI -->|Vector Retrieval| VectorDB[(Chroma Vector DB)]
```

---

## 🛠️ Technology Stack

| Layer | Technology | Key Capabilities |
| --- | --- | --- |
| **Frontend** | React (Vite), Tailwind CSS, Lucide Icons, Recharts | Dynamic dashboards, responsive controls, visual analytics, charts |
| **Primary Backend** | Spring Boot, Hibernate / JPA, Spring Security | Role-based authorization, JWT generation, placement tracking |
| **Relational Database** | MySQL | Relational data, user authentication, application logging |
| **AI Services Core** | Python FastAPI, Uvicorn | High-performance async API, LangChain integration |
| **Vector Database** | ChromaDB, Sentence Transformers | Semantic document embeddings, RAG retrieval |
| **AI Integrations** | OpenRouter API, LangChain Orchestration | Multi-LLM model failovers, local heuristic fallback engines |
| **Document Utilities** | python-docx, pdfplumber, Web Speech API | Parsing PDFs, compiling structured `.docx` files, voice inputs |

---

## 📂 Database Design

The relational database is managed by MySQL. The system initializes automatically from the [schema.sql](file:///C:/Users/anish/OneDrive/College/Projects/AI-CareerOS/backend/src/main/resources/schema.sql) on startup.

### Relational Schema Layout
* **`users`**: Unified accounts storing name, email, credentials, and account roles (`STUDENT`, `ADMIN`, `RECRUITER`).
* **`students`**: Detailed profiles tracking CGPA, branches, active backlogs, skills, education, and resume metrics.
* **`companies`**: Details of corporate recruiters and partner organizations.
* **`drives`**: Placement drives detailing target roles, salary packages (LPA), eligibility limits (CGPA), and dates.
* **`applications`**: Application tracking linking students to drives with status stages (`APPLIED`, `SHORTLISTED`, `TEST`, `INTERVIEW`, `SELECTED`, `REJECTED`).
* **`interviews`**: Corporate interviewer schedules, rounds, feedback notes, and scores.
* **`resumes`**: Structured template and configuration JSON arrays for students.
* **`resume_analyses`**: Historical ATS scores, keywords found, missing terms, and feedback suggestions.
* **`dsa_topics`**: Problem metadata containing categories, difficulty, and LeetCode link keys.
* **`dsa_roadmaps`**: Personalized roadmaps containing daily goals, timelines, and weak area focus arrays.
* **`dsa_progress`**: Solution logs tracking problems solved per topic and confidence levels.
* **`mock_interviews`**: Log of mock interview questions, user transcripts, and detailed evaluation matrices.
* **`documents`**: Track uploaded study files, text chunks, and storage references for the RAG chatbot.
* **`query_logs`**: Conversational chat history logs linked to user files.
* **`notifications`**: Real-time read/unread notifications for placement rounds and updates.

---

## 🌟 Core Modules & Features

### 1. Smart Placement Management Backbone
* **Student Dashboard**: View personal CGPA eligibility, active job applications, and recommended campus drives.
* **Admin Controls**: Manage campus postings, company requirements, student backlogs, and review real-time placement funnel funnels.
* **Job Board**: Query local postings and search live external job listings (filtered to India) powered by the JSearch API.

### 2. AI Resume ATS Auditor
* **ATS Score Meter**: Evaluates resumes in real time, scoring overall rating, content relevance, format readability, and keyword density.
* **Visual Audit Checklist**: Displays clear indicators (Passed ✅ / Warning ⚠️ / Critical ❌) checklisting formatting compatibility, email/phone header parameters, and standard layout sections.
* **Target Gap Analysis**: Displays a keyword match heatmap comparing user resume skills against industry standards, highlighting critical missing tools.
* **Interactive Section Rewriter**: Rewrites weak bullets (e.g. *"I worked on a Java site"*) into impact-driven sentences using action verbs and the STAR methodology (e.g. *"Architected and deployed a scalable Java microservice, reducing response times by 30%"*).
* **Resume Chatbot (Career GPT)**: Conversational RAG assistant to answer resume questions, suggest phrasing, and offer template adjustments.
* **Professional DOCX Exporter**: Converts parsed resumes into formatted Microsoft Word (`.docx`) files with modern design elements, layout tables, and styled border lines.
* **Local Heuristic Fallback Engine**: If OpenRouter free tier keys hit daily rate limits, the FastAPI backend automatically triggers an offline regex parser. It evaluates contact headers, counts metrics, identifies standard skills, and outputs a realistic diagnostic scorecard.

### 3. AI Mock Interview Arena
* **Custom Round Selection**: Select target roles, topics (system design, coding, general, behavioral), experience limits, and specific tech stacks.
* **Interviewer Simulator**: Dynamic text and voice interview environment powered by the browser's Web Speech API. Includes a simulated recording display and user camera preview to prepare candidates for live webcam settings.
* **Smart Evaluation Report**: Scores sessions based on technical accuracy, language flow, and confidence, outputting constructive weaknesses and improvement steps.

### 4. AlgoMentor DSA Planner
* **Dynamic Roadmaps**: Generates custom roadmaps matching target timelines, skill levels, and target tier companies (FAANG, product, service).
* **Milestone Progress**: Tracks daily challenges, solves progress, and registers confidence levels.

### 5. Career Knowledge Assistant (Document RAG)
* **Study RAG Chatbot**: Upload prep notes, PDFs, or slides. Students can query complex concepts and get verified replies citing their files.
* **Auto-Summarizer**: Generates single-page summaries and flashcards from large documents.
* **Quiz Generator**: Builds auto-generated testing modules to evaluate conceptual understanding.

---

## 🚀 Local Installation & Setup

### Prerequisites
* Java JDK 17+
* Python 3.10+
* MySQL Server (running on port 3306)
* Node.js (v18+)

---

### Step 1: Clone and Database Setup
1. Clone the repository.
2. In MySQL, create a database named `careeros`:
   ```sql
   CREATE DATABASE careeros;
   ```
3. The database schema, initial admin user, and sample placement data will seed automatically on backend startup using `schema.sql`.

---

### Step 2: Configure and Run Python AI Services
1. Navigate to the `ai-services` folder:
   ```bash
   cd ai-services
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   venv\Scripts\activate  # On macOS/Linux: source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Create a `.env` file in the `ai-services` directory:
   ```env
   OPENROUTER_API_KEY=your_openrouter_api_key_here
   OPENROUTER_MODEL=google/gemma-4-31b-it:free
   CHROMA_DB_DIR=./chroma_db
   UPLOAD_DIR=./uploads
   ALLOWED_ORIGINS=["http://localhost:5173"]
   ```
5. Start the FastAPI server on port `8000`:
   ```bash
   python -m uvicorn app.main:app --port 8000 --host 0.0.0.0
   ```

---

### Step 3: Configure and Run Spring Boot Gateway
1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Open `src/main/resources/application.properties` and configure your database credentials, OpenRouter key, and RapidAPI credentials:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/careeros
   spring.datasource.username=your_mysql_username
   spring.datasource.password=your_mysql_password
   
   openrouter.api.key=your_openrouter_key
   jsearch.api.key=your_rapidapi_jsearch_key
   ```
3. Compile and launch the Spring Boot application using Maven:
   ```bash
   mvn compile
   mvn spring-boot:run
   ```
   The gateway backend will start on port `9999`.

---

### Step 4: Run the React Frontend
1. Navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Access the web dashboard at `http://localhost:5173`.

---

## 👥 About the Author

* **Author Name**: Anisha Paturi
* **Role**: Primary System Architect & Full-Stack AI Developer
* **Affiliation**: College Major Capstone Project

Anisha Paturi is a computer science undergraduate passionate about full-stack engineering, cloud services, and AI agent integration. CareerPilot-AI represents the capstone major project to unify placement coordination and intelligent candidate preparation.

---

## 📅 Project Development Timeline

The ecosystem was designed, developed, and integrated in structured sprints over a **20-week timeline**:

| Sprints | Phase & Focus Area | Major Milestones Achieved |
| --- | --- | --- |
| **Weeks 1 - 4** | **Database & Authentication Backbone** | Designed unified MySQL tables; configured Spring Boot Gateway and JWT security tokens. |
| **Weeks 5 - 8** | **ATS Resume Engine & Diagnostics** | Built PDF text extraction; created ATS sub-scoring checklists and matching heatmaps; created styled Word (`.docx`) template exporter. |
| **Weeks 9 - 12**| **AI Mock Interview Arena** | Developed Speech-to-Text dynamic scripts (Web Speech API), camera feed mock panels, and automatic evaluator metrics. |
| **Weeks 13 - 16**| **Knowledge Base (RAG) & AlgoMentor**| Configured ChromaDB vector stores; added PDF chat, quiz engines, and adaptive DSA study roadmaps. |
| **Weeks 17 - 20**| **Integration, Testing & Failovers** | Implemented robust local heuristic fallbacks for API rate limits; completed end-to-end user-testing. |
