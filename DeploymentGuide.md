# CareerPilot-AI — Deployment Guide
## Vercel (Frontend) + Render (Spring Boot + FastAPI + MySQL)

---

## Overview

| Service | Platform | What it hosts |
|---|---|---|
| React frontend | Vercel | Static build via Vite |
| Spring Boot backend | Render (Web Service) | Port 9999, Java 21 |
| FastAPI AI service | Render (Web Service) | Port 8000, Python 3.11 |
| MySQL database | Render (Managed DB) or PlanetScale | Relational data |

> **Note on ChromaDB:** ChromaDB writes files to disk (`./chroma_db`). Render's free tier has ephemeral storage — data resets on redeploy. For production, persist ChromaDB to a volume (Render paid) or swap to a hosted vector DB (Pinecone free tier).

---

## Step 1 — Prepare your repository

Your repo must have this layout for Render to detect each service independently:

```
CareerPilot-AI/
├── frontend/          ← Vercel deploys this
├── backend/           ← Render Web Service #1
├── ai-services/       ← Render Web Service #2
└── ...
```

This is already the case — no restructuring needed.

---

## Step 2 — Add missing config files

### 2a. Add `mvnw` to the backend

The backend has no Maven wrapper. Add one so Render can build without a local Maven install:

```bash
# Run this once inside the backend/ folder on your machine
cd backend
mvn wrapper:wrapper
git add mvnw mvnw.cmd .mvn/
git commit -m "Add Maven wrapper"
```

Then make it executable:
```bash
chmod +x backend/mvnw
git add backend/mvnw
git commit -m "Make mvnw executable"
```

### 2b. Add `application.properties` to the backend

Create `backend/src/main/resources/application.properties`:

```properties
# Server
server.port=${PORT:9999}

# Database — values come from Render environment variables
spring.datasource.url=${DB_URL}
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false

# JWT
jwt.secret=${JWT_SECRET}
jwt.expiration=86400000

# Mail (optional — add only if EmailService is wired up)
spring.mail.host=${MAIL_HOST:smtp.gmail.com}
spring.mail.port=${MAIL_PORT:587}
spring.mail.username=${MAIL_USERNAME:}
spring.mail.password=${MAIL_PASSWORD:}
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true

# CORS — allow frontend origin
app.cors.allowed-origins=${ALLOWED_ORIGINS:http://localhost:5173}
```

### 2c. Add `.env.example` for AI services

Create `ai-services/.env.example` (commit this, not the real `.env`):

```env
OPENROUTER_API_KEY=your_key_here
OPENROUTER_MODEL=google/gemini-flash-1.5
OPENAI_API_KEY=
CHROMA_DB_DIR=./chroma_db
UPLOAD_DIR=./uploads
ALLOWED_ORIGINS=["https://your-frontend.vercel.app"]
```

### 2d. Add a `Procfile` for the AI service (optional but cleaner)

Create `ai-services/Procfile`:

```
web: uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

---

## Step 3 — Deploy MySQL on Render

1. Go to [render.com](https://render.com) → **New → PostgreSQL** — wait, Render doesn't offer managed MySQL. Use one of these instead:

   **Option A — PlanetScale (recommended free MySQL):**
   - Sign up at [planetscale.com](https://planetscale.com)
   - Create a database → create a branch (`main`)
   - Go to **Connect** → select **Java / MySQL** → copy the connection string
   - It looks like: `mysql://user:pass@host/db?ssl-mode=VERIFY_IDENTITY`
   - For Spring Boot, use: `jdbc:mysql://host/db?sslMode=VERIFY_IDENTITY&serverSslCert=/etc/ssl/certs/ca-certificates.crt`

   **Option B — Render's PostgreSQL + change the driver:**
   - Requires changing `mysql-connector-j` → `postgresql` driver and updating queries. More work.

   **Option C — Aiven free MySQL tier:**
   - Sign up at [aiven.io](https://aiven.io), create a MySQL 8 service, get connection details.

   Save these values — you'll paste them as env vars shortly:
   ```
   DB_URL=jdbc:mysql://<host>:<port>/<dbname>?useSSL=true&requireSSL=true
   DB_USERNAME=<user>
   DB_PASSWORD=<password>
   ```

---

## Step 4 — Deploy the Spring Boot backend on Render

1. **New → Web Service** on Render
2. Connect your GitHub repo
3. Set **Root Directory** to `backend`
4. Configure the build:

   | Field | Value |
   |---|---|
   | **Environment** | Java |
   | **Build Command** | `./mvnw clean package -DskipTests` |
   | **Start Command** | `java -jar target/careeros-backend-1.0.0.jar` |
   | **Instance Type** | Free (512 MB RAM — enough for Spring Boot) |

5. Add **Environment Variables**:

   | Key | Value |
   |---|---|
   | `DB_URL` | Your MySQL JDBC URL |
   | `DB_USERNAME` | DB user |
   | `DB_PASSWORD` | DB password |
   | `JWT_SECRET` | Any long random string (32+ chars) |
   | `ALLOWED_ORIGINS` | `https://your-app.vercel.app` (add after Vercel deploy) |
   | `PORT` | `9999` |

6. Click **Deploy**. First build takes ~5 minutes.

7. After deploy, copy the Render URL: `https://careeros-backend.onrender.com`

> **Free tier note:** Render free services spin down after 15 minutes of inactivity and take ~30s to wake. For demos, keep it awake with a cron ping or upgrade to the $7/month starter.

---

## Step 5 — Deploy the FastAPI AI service on Render

1. **New → Web Service** on Render
2. Connect same GitHub repo
3. Set **Root Directory** to `ai-services`
4. Configure:

   | Field | Value |
   |---|---|
   | **Environment** | Python 3 |
   | **Build Command** | `pip install -r requirements.txt` |
   | **Start Command** | `uvicorn app.main:app --host 0.0.0.0 --port $PORT` |
   | **Instance Type** | Free or Starter ($7) — `sentence-transformers` needs ~700 MB RAM |

5. Add **Environment Variables**:

   | Key | Value |
   |---|---|
   | `OPENROUTER_API_KEY` | Your OpenRouter key |
   | `OPENROUTER_MODEL` | `google/gemini-flash-1.5` |
   | `ALLOWED_ORIGINS` | `["https://your-app.vercel.app"]` |
   | `CHROMA_DB_DIR` | `./chroma_db` |
   | `UPLOAD_DIR` | `./uploads` |
   | `PORT` | `8000` |

6. Click **Deploy**. First build is slow (~8 min) because `sentence-transformers` downloads model weights.

7. After deploy, copy the URL: `https://careeros-ai.onrender.com`

> **RAM warning:** `sentence-transformers` + `chromadb` together use ~700–900 MB. Free tier (512 MB) will OOM. You need the **Starter ($7/month)** instance at minimum for the AI service.

---

## Step 6 — Deploy the React frontend on Vercel

1. Go to [vercel.com](https://vercel.com) → **New Project**
2. Import your GitHub repo
3. Set **Root Directory** to `frontend`
4. Vercel auto-detects Vite — framework preset will be set to **Vite** automatically

5. Add **Environment Variables** (in Vercel dashboard → Settings → Environment Variables):

   | Key | Value |
   |---|---|
   | `VITE_API_BASE_URL` | `https://careeros-backend.onrender.com` |
   | `VITE_AI_BASE_URL_DIRECT` | `https://careeros-ai.onrender.com` |

6. Click **Deploy**. Build takes ~1 minute.

7. Your app is live at `https://your-project.vercel.app`

---

## Step 7 — Update CORS after all services are live

Now that you have all three URLs, go back and update:

**On the Spring Boot Render service:**
```
ALLOWED_ORIGINS = https://your-project.vercel.app
```

**On the FastAPI Render service:**
```
ALLOWED_ORIGINS = ["https://your-project.vercel.app"]
```

Trigger a redeploy on both (Render → Manual Deploy).

---

## Step 8 — Initialize the database schema

The Spring Boot app has `schema.sql` under resources. With `spring.jpa.hibernate.ddl-auto=update`, Hibernate auto-creates tables on first boot.

If tables don't appear, run the schema manually:
1. In PlanetScale/Aiven console, open the SQL editor
2. Paste the contents of `backend/src/main/resources/schema.sql`
3. Run it

---

## Step 9 — Verify everything works

Test each service independently:

```bash
# Backend health
curl https://careeros-backend.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"wrong"}' 
# Should return 401 (not 502) — means backend is alive

# AI service health
curl https://careeros-ai.onrender.com/health
# Should return: {"status":"healthy","service":"AI-CareerOS AI Services"}

# Frontend
# Open https://your-project.vercel.app in browser — login page should load
```

---

## Common Issues & Fixes

| Problem | Cause | Fix |
|---|---|---|
| Backend 502 on first request | Free tier cold start | Wait 30s, retry |
| `No 'Access-Control-Allow-Origin'` error | CORS not updated after deploy | Update `ALLOWED_ORIGINS` env var + redeploy |
| AI service OOM crash | `sentence-transformers` RAM | Upgrade to Render Starter ($7/mo) |
| ChromaDB data lost on redeploy | Ephemeral disk | Add Render Disk ($1/mo) mounted at `/app/chroma_db` |
| MySQL SSL error | PlanetScale requires SSL | Add `?sslMode=VERIFY_IDENTITY` to JDBC URL |
| `mvnw: not found` | Wrapper not committed | Run `mvn wrapper:wrapper` locally and commit |
| Vite build fails | Missing env vars | Add `VITE_*` vars in Vercel before deploying |

---

## Summary of all URLs after deployment

| Service | URL |
|---|---|
| Frontend | `https://your-project.vercel.app` |
| Spring Boot API | `https://careeros-backend.onrender.com` |
| FastAPI AI | `https://careeros-ai.onrender.com` |
| AI Health check | `https://careeros-ai.onrender.com/health` |
| AI API docs | `https://careeros-ai.onrender.com/docs` |

---

## Cost summary (free tier limits)

| Service | Free | Paid |
|---|---|---|
| Vercel | ✅ Free forever for static sites | — |
| Render Spring Boot | ✅ Free (sleeps after 15 min) | $7/mo (always on) |
| Render FastAPI | ⚠️ Needs Starter for RAM | $7/mo |
| PlanetScale MySQL | ✅ Free (5 GB, 1 billion row reads/mo) | — |
| Render Disk (ChromaDB) | ❌ Not on free | $1/mo |

Minimum viable paid setup: **~$8/month** (Starter for AI service + $1 disk).