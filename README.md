# AI CareerOS — Unified AI Career Ecosystem

<div align="center">

[![Stars](https://img.shields.io/github/stars/AnishaPaturi/CareerPilot-AI?style=for-the-badge&color=ffd700&labelColor=20232a&logo=github)](https://github.com/AnishaPaturi/CareerPilot-AI/stargazers)
[![Forks](https://img.shields.io/github/forks/AnishaPaturi/CareerPilot-AI?style=for-the-badge&color=1f425f&labelColor=20232a&logo=github)](https://github.com/AnishaPaturi/CareerPilot-AI/network/members)
[![Issues](https://img.shields.io/github/issues/AnishaPaturi/CareerPilot-AI?style=for-the-badge&color=e05d44&labelColor=20232a)](https://github.com/AnishaPaturi/CareerPilot-AI/issues)
[![Pull Requests](https://img.shields.io/github/issues-pr/AnishaPaturi/CareerPilot-AI?style=for-the-badge&color=44cc11&labelColor=20232a)](https://github.com/AnishaPaturi/CareerPilot-AI/pulls)

</div>

<div align="center">

[![Java](https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)](https://spring.io/projects/spring-boot)
[![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![MySQL](https://img.shields.io/badge/MySQL-00758F?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)

</div>

AI CareerOS (also known as **CareerPilot-AI**) is a unified, intelligent career preparation and placement ecosystem. Instead of relying on disconnected tools, the platform consolidates placement management, automated resume auditing, mock interview simulation, DSA roadmapping, and document RAG-based study assistants into a single unified product.

Designed with a high-performance microservices blueprint, it is built to demonstrate startup-level system design and software architecture.

---

## 🏗️ System Architecture

The platform uses a decoupled backend design: an enterprise-level Spring Boot gateway that manages relational data and role authentication, alongside a Python FastAPI microservice that drives all LLM, RAG, and vector operations.

![System Architecture](assets/System_architecture.png)

---

## 🔄 System Workflow

![System Workflow](assets/workflow.png)

---

## 🛠️ Technology Stack

![Technology Stack](assets/Tech%20Stack.png)

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

The relational database is managed by MySQL. The schema initializes automatically on backend startup from the [schema.sql](file:///C:/Users/anish/OneDrive/College/Projects/AI-CareerOS/backend/src/main/resources/schema.sql) file.

### 📐 Entity-Relationship (ER) Diagram

```mermaid
erDiagram
    users {
        int id PK
        string email UK
        string password
        string name
        enum role
    }
    students {
        int id PK
        string email UK
        decimal cgpa
        string branch
        int active_backlogs
        text skills
    }
    companies {
        int id PK
        string name
    }
    drives {
        int id PK
        int company_id FK
        string role
        decimal package_lpa
    }
    applications {
        int id PK
        int student_id FK
        int drive_id FK
        enum status
    }
    interviews {
        int id PK
        int student_id FK
        int drive_id FK
        string round
        enum status
    }
    resumes {
        int id PK
        int student_id FK
        json resume_data
    }
    resume_analyses {
        int id PK
        int student_id FK
        int ats_score
    }
    dsa_topics {
        int id PK
        string name
        enum difficulty
    }
    dsa_roadmaps {
        int id PK
        int student_id FK
        json daily_goals
    }
    dsa_progress {
        int id PK
        int student_id FK
        int topic_id FK
        int problems_solved
    }
    mock_interviews {
        int id PK
        int student_id FK
        enum interview_type
    }
    documents {
        int id PK
        int user_id FK
        string filename
    }
    query_logs {
        int id PK
        int user_id FK
        int document_id FK
    }
    notifications {
        int id PK
        int user_id FK
        boolean is_read
    }

    users ||--o{ documents : "owns"
    users ||--o{ query_logs : "queries"
    users ||--o{ notifications : "receives"
    companies ||--o{ drives : "sponsors"
    drives ||--o{ applications : "tracks"
    drives ||--o{ interviews : "schedules"
    students ||--o{ applications : "applies"
    students ||--o{ interviews : "attends"
    students ||--o{ resumes : "creates"
    students ||--o{ resume_analyses : "receives"
    students ||--o{ dsa_roadmaps : "assigned"
    students ||--o{ dsa_progress : "logs"
    students ||--o{ mock_interviews : "takes"
    dsa_topics ||--o{ dsa_progress : "links"
    documents ||--o{ query_logs : "references"
```

### 🗄️ Relational Schema Layout (Modular Grouping)

#### 🔑 Core Accounts & Profiles
| Table | Description | Primary / Foreign Keys |
| :--- | :--- | :--- |
| **`users`** | Central login accounts supporting Student, Admin, and Recruiter credentials. | `id` (PK) |
| **`students`**| Detailed profiles tracking CGPA, branch, backlogs, skills, education, and experience. | `id` (PK) |

#### 💼 Placement Drive System
| Table | Description | Primary / Foreign Keys |
| :--- | :--- | :--- |
| **`companies`**| Profiles of corporate recruiters and partner organizations. | `id` (PK) |
| **`jobs`** | Indexed postings from internal sources and JSearch API feeds. | `id` (PK), `company_id` (FK) |
| **`drives`** | Active campus recruitment drives listing target CTC/LPA and criteria. | `id` (PK), `company_id` (FK) |
| **`applications`**| Track state changes (`APPLIED`, `SHORTLISTED`, `SELECTED`, `REJECTED`). | `id` (PK), `student_id` (FK), `drive_id` (FK) |
| **`interviews`**| Chronological corporate interview rounds, scores, and feedback remarks. | `id` (PK), `student_id` (FK), `drive_id` (FK) |

#### 🤖 Resume Builder & AI Analytics
| Table | Description | Primary / Foreign Keys |
| :--- | :--- | :--- |
| **`resumes`** | Structured JSON layouts storing template styles and user resume texts. | `id` (PK), `student_id` (FK) |
| **`resume_analyses`**| Historical logs capturing ATS scores, missing keywords, and layout critiques. | `id` (PK), `student_id` (FK) |
| **`mock_interviews`**| Simulation transcripts, parsed questions, and technical/HR evaluation matrices. | `id` (PK), `student_id` (FK) |

#### 📈 AlgoMentor DSA Tracker
| Table | Description | Primary / Foreign Keys |
| :--- | :--- | :--- |
| **`dsa_topics`**| LeetCode problem titles, difficulty levels (Easy/Med/Hard), and category tags. | `id` (PK) |
| **`dsa_roadmaps`**| Custom generated daily milestones matching tier goals. | `id` (PK), `student_id` (FK) |
| **`dsa_progress`**| Solution metrics logging problems completed and student confidence. | `id` (PK), `student_id` (FK), `topic_id` (FK) |

#### 📂 Document RAG & Communications
| Table | Description | Primary / Foreign Keys |
| :--- | :--- | :--- |
| **`documents`**| Meta index for uploaded study files, chunk counts, and storage locations. | `id` (PK), `user_id` (FK) |
| **`query_logs`**| Semantic history linking student questions to retrieved contexts. | `id` (PK), `user_id` (FK), `document_id` (FK) |
| **`notifications`**| Real-time alerts for interview schedules and shortlists. | `id` (PK), `user_id` (FK) |

---

## 🌟 Core Modules & Features

### 1. Smart Placement Management Backbone
The central system coordinating all placement drives, company profiles, job application funnels, and student credentials.

**Stack:** `Spring Boot` `Hibernate / JPA` `MySQL` `React` `JWT Security`

* **Student Placement Center**: Displays active, eligible campus drives dynamically using [EligibilityEngine.java](file:///C:/Users/anish/OneDrive/College/Projects/AI-CareerOS/backend/src/main/java/com/careeros/service/EligibilityEngine.java). Checks student qualifications like CGPA cutoff criteria and branch exclusions, allowing seamless applications and real-time status tracking.
* **Admin Control Center**: Empowers administrators to manage partner corporate registry profiles, publish active job/placement listings, configure application filters, set backlog status caps, and inspect analytical funnel dashboards.
* **Live Job Board Feed**: Features a client-side integrated search engine powered by [CareerNestClient.java](file:///C:/Users/anish/OneDrive/College/Projects/AI-CareerOS/backend/src/main/java/com/careeros/service/careernest/CareerNestClient.java) that queries the live `https://careernest.cloud/api/feed` endpoint (exclusively targeting India opportunities), featuring in-memory caching to avoid upstream rate limits.
* **Application Lifecycle Tracker**: Transitions application records through a structured lifecycle: `APPLIED` ➔ `SHORTLISTED` ➔ `TEST` ➔ `INTERVIEW` ➔ `SELECTED` ➔ `REJECTED`, utilizing [ApplicationController.java](file:///C:/Users/anish/OneDrive/College/Projects/AI-CareerOS/backend/src/main/java/com/careeros/controller/ApplicationController.java) and [ShortlistingAlgorithm.java](file:///C:/Users/anish/OneDrive/College/Projects/AI-CareerOS/backend/src/main/java/com/careeros/service/ShortlistingAlgorithm.java).
* **Robust Relational Models**: Connects key entities like [User.java](file:///C:/Users/anish/OneDrive/College/Projects/AI-CareerOS/backend/src/main/java/com/careeros/model/User.java), [Student.java](file:///C:/Users/anish/OneDrive/College/Projects/AI-CareerOS/backend/src/main/java/com/careeros/model/Student.java), [Company.java](file:///C:/Users/anish/OneDrive/College/Projects/AI-CareerOS/backend/src/main/java/com/careeros/model/Company.java), [Job.java](file:///C:/Users/anish/OneDrive/College/Projects/AI-CareerOS/backend/src/main/java/com/careeros/model/Job.java), and [Drive.java](file:///C:/Users/anish/OneDrive/College/Projects/AI-CareerOS/backend/src/main/java/com/careeros/model/Drive.java) using JPA/Hibernate mappings seeded by [schema.sql](file:///C:/Users/anish/OneDrive/College/Projects/AI-CareerOS/backend/src/main/resources/schema.sql).

> [!NOTE]
> All student data, active backlogs, CGPA benchmarks, and drive details are managed strictly under roles `STUDENT` and `ADMIN` using Spring Security's unified JWT token authentication filters.

---

### 2. AI Resume ATS Auditor & Studio
Integrates resume creation, structural audit, and intelligent tailoring to match professional Applicant Tracking System (ATS) criteria.

**Stack:** `Python FastAPI` `OpenRouter API` `python-docx` `React` `Regex Engine`

* **ATS Score Meter**: Integrates with [ats.py](file:///C:/Users/anish/OneDrive/College/Projects/AI-CareerOS/ai-services/app/routers/ats.py) to parse uploaded PDFs, outputting an overall score out of 100 based on formatting, keyword density, section readability, and metric inclusion.
* **Visual Audit Checklist**: Evaluates documents on formatting criteria and displays visual diagnostics:
  * **Passed ✅**: Proper heading structures, clear contact details (email/phone), and standard resume layouts.
  * **Warning ⚠️**: Short description lengths, lack of quantitative achievements, or vague timeline listings.
  * **Critical ❌**: Missing critical skill blocks, unparseable graphic blocks, or corrupted text contents.
* **AI Resume Tailor & Rewriter**: Accessible via [ResumeRewriter.jsx](file:///C:/Users/anish/OneDrive/College/Projects/AI-CareerOS/frontend/src/components/ResumeRewriter.jsx) and backed by [AiService.java](file:///C:/Users/anish/OneDrive/College/Projects/AI-CareerOS/backend/src/main/java/com/careeros/service/AiService.java):
  * **Improve Existing Resume**: Refines bullet points by framing achievements using the STAR methodology (Situation, Task, Action, Result) with strong action verbs.
  * **Build Resume from Scratch**: Inputs a target job description to synthesize an optimized, structured resume layout.
* **Skills Gap Heatmap**: Identifies missing technologies or core frameworks by comparing resume text against target job descriptions.
* **Career GPT Chat Assistant**: Allows conversational, context-aware querying of the resume to customize word choices and verify technical syntax.
* **Premium Exporter & Local Fallback**:
  * **Word/DOCX Exporter**: Deployed through [ResumeProcessingService.java](file:///C:/Users/anish/OneDrive/College/Projects/AI-CareerOS/backend/src/main/java/com/careeros/service/ResumeProcessingService.java) to export resume data as fully formatted Microsoft Word `.docx` documents.
  * **Offline Heuristic Parser**: Triggers a local regex backup scanner in [ats.py](file:///C:/Users/anish/OneDrive/College/Projects/AI-CareerOS/ai-services/app/routers/ats.py) when API rate limits are reached, ensuring users always receive basic structural reports.

---

### 3. AI Mock Interview Arena
Provides immersive, real-time verbal and behavioral interview simulations.

**Stack:** `Python FastAPI` `Web Speech API` `React` `MySQL`

* **Configuration Panel**: Customizes mock sessions using [InterviewSetup.jsx](file:///C:/Users/anish/OneDrive/College/Projects/AI-CareerOS/frontend/src/pages/Interview/InterviewSetup.jsx) by specifying target job roles (Technical: Frontend/Backend/Fullstack/ML/DevOps, or General: HR/Behavioral), tech stacks, and experience tiers.
* **Interviewer Simulator**: Conducts speech-based interviews using the browser's native **Web Speech API** for voice-to-text. Features live recording indicators and an optional user webcam display to help candidates practice eye contact and posture in [InterviewRoom.jsx](file:///C:/Users/anish/OneDrive/College/Projects/AI-CareerOS/frontend/src/pages/Interview/InterviewRoom.jsx).
* **Intelligent Evaluation & Metrics**: Provides detailed feedback reports using [interview.py](file:///C:/Users/anish/OneDrive/College/Projects/AI-CareerOS/ai-services/app/routers/interview.py). Evaluates sessions for technical accuracy, grammar, fluency, and answer confidence, saving logs to [MockInterview.java](file:///C:/Users/anish/OneDrive/College/Projects/AI-CareerOS/backend/src/main/java/com/careeros/model/MockInterview.java).
* **Engagement & Analytics**: Gamifies preparation using [InterviewDashboard.jsx](file:///C:/Users/anish/OneDrive/College/Projects/AI-CareerOS/frontend/src/pages/Interview/InterviewDashboard.jsx) with history trackers, performance leaderboards, and merit badges to incentivize consistent preparation.

---

### 4. AlgoMentor DSA Planner
An intelligent planner and logger that helps students build structured algorithmic problem-solving habits.

**Stack:** `Python FastAPI` `React` `MySQL`

* **Adaptive Roadmaps**: Creates day-by-day learning schedules via [dsa_planner.py](file:///C:/Users/anish/OneDrive/College/Projects/AI-CareerOS/ai-services/app/routers/dsa_planner.py) matching availability (hours/day), current level (Beginner/Intermediate/Advanced), target companies (e.g., Tier-1 MAANG), and weak areas. Roadmaps are stored in [DsaRoadmap.java](file:///C:/Users/anish/OneDrive/College/Projects/AI-CareerOS/backend/src/main/java/com/careeros/model/DsaRoadmap.java).
* **Progress & Confidence Tracker**: Logs completed problems across categories (Arrays, Graphs, Dynamic Programming) and difficulties (`EASY`, `MEDIUM`, `HARD`) using [DSAPlanner.jsx](file:///C:/Users/anish/OneDrive/College/Projects/AI-CareerOS/frontend/src/components/DSAPlanner.jsx). Saves progress metrics to [DsaProgress.java](file:///C:/Users/anish/OneDrive/College/Projects/AI-CareerOS/backend/src/main/java/com/careeros/model/DsaProgress.java) to dynamically focus on low-confidence topics.

---

### 5. Career Knowledge Assistant (Document RAG) & Prep Hub
A centralized learning platform with semantic file searching, notes management, and computer science references.

**Stack:** `Python FastAPI` `ChromaDB` `Sentence Transformers` `LangChain` `React` `react-pdf`

* **ChromaDB Vector Store**: Converts uploaded PDF study materials into semantic vector embeddings stored in a local vector directory. Mapped on the backend via [Document.java](file:///C:/Users/anish/OneDrive/College/Projects/AI-CareerOS/backend/src/main/java/com/careeros/model/Document.java).
* **Context-Aware Semantic Chat**: Uses retrieval-augmented generation (RAG) to query uploaded files and produce conceptual answers backed by actual text references, with chat query history logged in [QueryLog.java](file:///C:/Users/anish/OneDrive/College/Projects/AI-CareerOS/backend/src/main/java/com/careeros/model/QueryLog.java).
* **Conceptual Quizzing Engine**: Scans notes and dynamically compiles multi-choice quizzes to test student comprehension.
* **Smart Summarizer**: Generates single-page summaries and flashcard decks to help candidates study before placement tests.
* **Integrated PDF & Note Viewer**: Provides a clean dual-pane view with a PDF rendering library (`react-pdf`) and a markdown note-taking board in [StudyMaterials.jsx](file:///C:/Users/anish/OneDrive/College/Projects/AI-CareerOS/frontend/src/components/StudyMaterials.jsx) to allow students to read, edit, and summarize materials concurrently.
* **Interactive CS Notes Hub**: Deployed in [CSNotes.jsx](file:///C:/Users/anish/OneDrive/College/Projects/AI-CareerOS/frontend/src/components/CSNotes.jsx) to serve interactive reference sheets for subjects like Operating Systems, DBMS, SQL, OOP, and Networks. Features a search tool and syntax-highlighted code blocks.

## 🚀 Local Installation & Setup

Before running the application, ensure your environment meets the prerequisites below. You can verify each dependency by running its corresponding check command in your terminal.

### 📋 Prerequisites & Verification

| Dependency | Required Version | Verification Command | Purpose |
| :--- | :--- | :--- | :--- |
| **Java JDK** | 17+ | `java -version` | Primary backend execution environment (Spring Boot) |
| **Python** | 3.10+ | `python --version` | AI microservices host (FastAPI) |
| **Node.js** | v18+ | `node -v` | UI frontend build & dev tools (React Vite) |
| **MySQL Server** | 8.0+ | `mysql --version` | Relational database (user info, drives, progress logs) |
| **Docker Engine** | 20.10+ | `docker --version` | Container runtime (Redis, RabbitMQ, telemetry, Search) |

---

### 🐳 Step 1: Spin Up Infrastructure Services (Docker)
The ecosystem uses containerized services for caching, asynchronous processing, full-text search, and observability.

1. Ensure **Docker Desktop** is running.
2. Open a terminal and navigate to the Docker deployment directory:
   ```bash
   cd deployment/docker
   ```
3. Boot up all service containers in detached mode:
   ```bash
   docker compose up -d
   ```
4. Verify that all 6 services are active and running:
   ```bash
   docker ps
   ```

#### 🖥️ Infrastructure Control Panel URLs & Credentials

| Service | Host Port | Web UI / Dashboard URL | Default Credentials | Platform Function |
| :--- | :--- | :--- | :--- | :--- |
| **RabbitMQ** | `5672` / `15672` | [http://localhost:15672](http://localhost:15672) | User: `guest`<br>Pass: `guest` | Async task message broker for resume parsing & evaluations |
| **Grafana** | `3000` | [http://localhost:3000](http://localhost:3000) | User: `admin`<br>Pass: `admin` | Telemetry visualization dashboard |
| **Prometheus** | `9090` | [http://localhost:9090](http://localhost:9090) | *None* | Actuator JVM & HTTP metrics scraping |
| **Elasticsearch**| `9200` | [http://localhost:9200](http://localhost:9200) | *None (Security Disabled)* | Full-text indexing for candidates & job boards |
| **Redis Server** | `6379` | *Internal Connection Only* | *None* | Caching layer for API listings & roadmaps |
| **Loki Engine**  | `3100` | [http://localhost:3100](http://localhost:3100) | *None* | Logs aggregator engine |

---

### 🗄️ Step 2: MySQL Database Setup
1. Log in to your local MySQL server (using CLI or a tool like MySQL Workbench / DBeaver).
2. Create a fresh schema for the platform:
   ```sql
   CREATE DATABASE careeros;
   ```
3. > [!NOTE]
   > You do not need to manually import database tables. On Spring Boot backend startup, Hibernate will read [schema.sql](file:///C:/Users/anish/OneDrive/College/Projects/AI-CareerOS/backend/src/main/resources/schema.sql) and automatically seed all tables, indexes, sample company entries, mock placement drives, and the default admin user.

---

### 🐍 Step 3: Configure and Run Python AI Services
The AI microservice performs resume scanning, RAG operations, mock interview evaluation, and roadmap planning.

1. Open your terminal and navigate to the AI service directory:
   ```bash
   cd ai-services
   ```
2. Create a local virtual environment:
   ```bash
   python -m venv venv
   ```
3. Activate the virtual environment:
   * **Windows (PowerShell)**:
     ```powershell
     venv\Scripts\Activate.ps1
     ```
   * **Windows (CMD)**:
     ```cmd
     venv\Scripts\activate.bat
     ```
   * **macOS / Linux**:
     ```bash
     source venv/bin/activate
     ```
4. Upgrade `pip` and install the package dependencies:
   ```bash
   python -m pip install --upgrade pip
   pip install -r requirements.txt
   ```
5. Create a local environment variables file `.env` inside the `ai-services` root folder:
   ```env
   # API Keys & LLM Settings
   OPENROUTER_API_KEY=your_openrouter_api_key_here
   OPENROUTER_MODEL=google/gemma-2-9b-it:free

   # Directories & Storage Config
   CHROMA_DB_DIR=./chroma_db
   UPLOAD_DIR=./uploads

   # CORS Security Config
   ALLOWED_ORIGINS=["http://localhost:5173"]
   ```
6. Launch the FastAPI server using Uvicorn:
   ```bash
   python -m uvicorn app.main:app --port 8000 --host 0.0.0.0
   ```
   > [!TIP]
   > The API documentation will be accessible at [http://localhost:8000/docs](http://localhost:8000/docs).

---

### 🍃 Step 4: Configure and Run Spring Boot Gateway
The gateway manages credentials, processes student placements, runs algorithms, and handles user authentication.

1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Open the property file [application.properties](file:///C:/Users/anish/OneDrive/College/Projects/AI-CareerOS/backend/src/main/resources/application.properties) and configure credentials:
   ```properties
   # Relational DB Credentials
   spring.datasource.url=jdbc:mysql://localhost:3306/careeros
   spring.datasource.username=your_mysql_username
   spring.datasource.password=your_mysql_password

   # Infrastructure Connections
   spring.rabbitmq.host=localhost
   spring.rabbitmq.port=5672
   spring.rabbitmq.username=guest
   spring.rabbitmq.password=guest

   spring.data.redis.host=localhost
   spring.data.redis.port=6379

   # AI Services Integrations
   openrouter.api.key=your_openrouter_api_key_here
   jsearch.api.key=your_rapidapi_jsearch_key_here
   ```
3. Compile the application and resolve Maven dependencies:
   ```bash
   mvn clean compile
   ```
4. Run the Spring Boot application:
   ```bash
   mvn spring-boot:run
   ```
   The primary backend gateway will initialize and listen on port `9999`.

---

### 💻 Step 5: Configure and Run React Frontend
1. Open a terminal and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Verify node installation, and install the modules:
   ```bash
   npm install
   ```
3. Boot up the local React development server:
   ```bash
   npm run dev
   ```
4. Open your web browser and navigate to the dashboard at:
   [http://localhost:5173](http://localhost:5173)

---

## 📡 Telemetry, Caching & Message Broker Infrastructure

To ensure enterprise-level scale, performance, and monitoring, the platform integrates a distributed infrastructure layer:

### 1. High-Performance Caching (Redis)
All slow-running operations, third-party integrations, and LLM requests are cached in **Redis** via Spring Boot's caching abstraction (`@Cacheable`) and Python's caching handlers.
* **Cached Endpoints**: External JSearch jobs, generated DSA roadmaps, AI quizzes, and problem recommendations.
* **Result**: Decreases subsequent load times for the student dashboard from **~5-8 seconds** (LLM latency) to **< 50 milliseconds**.

### 2. Event-Driven Asynchronous Task Queues (RabbitMQ)
Heavy operations like resume parsing are fully decoupled from HTTP threads:
1. **Request Submission**: When a student uploads a resume, the backend writes the file to temporary storage and publishes a `ResumeParseTask` message containing the file metadata to RabbitMQ's `resume-parsing-queue`.
2. **Fast Acknowledge**: The user instantly receives a `200 OK` acceptance response so the UI remains fluid.
3. **Background Processing**: A dedicated `RabbitMQConsumer` worker consumes the task, loads the bytes, makes the AI API request, stores the parsing metrics to MySQL, and deletes the temporary file.

### 3. Production Telemetry Stack (Prometheus, Loki & Grafana)
* **Prometheus**: Automatically scrapes JVM statistics, CPU utilization, HTTP requests throughput, and latency from Spring Boot Actuator and Python's metrics endpoints.
* **Loki**: Pushes application standard log stdout directly to a central log server.
* **Grafana**: Aggregates all metrics and logs, serving dashboards for real-time monitoring.

---

## ☁️ Production Cloud Deployment (PaaS Split)

The platform is designed to deploy seamlessly on a multi-service architecture using free/low-cost PaaS providers. Follow these steps to put the system into production:

### 1. Provision Managed Databases & Services
Before deploying the code services, provision these free-tier cloud resources:
* **Managed MySQL**: Create a database on [Aiven.io](https://aiven.io/) or [Clever Cloud](https://www.clever-cloud.com/). Copy the connection string.
* **Serverless Redis**: Set up a free cache on [Upstash.com](https://upstash.com/). Note the Redis host, port, and password.
* **Cloud RabbitMQ**: Create a free queue broker on [CloudAMQP.com](https://www.cloudamqp.com/). Copy the `amqps://...` connection URL.

### 2. Environment Variables Configuration

To run successfully in the cloud, configure the following environment variables in your deployment dashboards:

#### Spring Boot Backend (Render / Railway)
| Environment Variable | Description / Recommended Value |
| :--- | :--- |
| `SPRING_DATASOURCE_URL` | MySQL connection string: `jdbc:mysql://[HOST]:[PORT]/[DB_NAME]` |
| `SPRING_DATASOURCE_USERNAME`| Database username |
| `SPRING_DATASOURCE_PASSWORD`| Database password |
| `SPRING_REDIS_HOST` | Upstash Redis Host name |
| `SPRING_REDIS_PORT` | Upstash Redis Port (usually `6379`) |
| `SPRING_REDIS_PASSWORD` | Upstash Redis Connection Password |
| `SPRING_RABBITMQ_ADDRESSES` | CloudAMQP connection string: `amqps://...` |
| `OPENROUTER_API_KEY` | OpenRouter API Key |
| `AI_SERVICE_BASE_URL` | Production URL of your deployed Python FastAPI service (e.g. `https://api.yourdomain.com/api/ai`) |
| `JWT_SECRET` | Strong secret phrase for JWT signing |

#### Python FastAPI Core (Render / Railway)
| Environment Variable | Description / Recommended Value |
| :--- | :--- |
| `OPENROUTER_API_KEY` | OpenRouter API Key |
| `OPENROUTER_MODEL` | E.g., `google/gemma-4-31b-it:free` |
| `CHROMA_DB_DIR` | `/data/chroma_db` (using persistent disk storage if on Render) |

#### React Frontend (Vercel)
| Environment Variable | Description / Recommended Value |
| :--- | :--- |
| `VITE_API_BASE_URL` | Production URL of your Spring Boot Backend (e.g. `https://your-backend.railway.app`) |
| `VITE_AI_BASE_URL_DIRECT`| Production URL of your FastAPI Backend (e.g. `https://your-ai.render.com`) |

---

## 👥 About the Author

* **Author Name**: Anisha Paturi
* **Role**: Primary System Architect & Full-Stack AI Developer


Anisha Paturi is a computer science undergraduate passionate about full-stack engineering, cloud services, and AI agent integration. CareerPilot-AI represents the capstone major project to unify placement coordination and intelligent candidate preparation.

---

## 📅 Project Development Timeline

The ecosystem was designed, developed, and integrated in structured sprints over a **20-week timeline**:

![Project Development Timeline](assets/Timeline.png)
