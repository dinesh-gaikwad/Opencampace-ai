# OpenCampus AI

A responsive, Java-centric learning platform starter: React + TypeScript frontend, Java 21 + Spring Boot backend, PostgreSQL, AI tutor integration, Docker, and Render deployment blueprint.

## What is included
- Responsive React UI designed for phones, tablets, laptops, and desktop screens
- Course catalogue and course detail experience
- Java Spring Boot REST API
- PostgreSQL + Flyway schema
- AI tutor endpoint: uses OpenAI when `OPENAI_API_KEY` is configured; otherwise a clearly labelled local demo tutor responds
- Health endpoint, request validation, structured error handling, and basic tests
- Dockerfile for the backend, Docker Compose for local development, Render Blueprint
- Accessible controls, reduced-motion support, and PWA manifest

## Important reality check
This is a professional starter/MVP, not a finished competitor to W3Schools. It does not yet include production-grade account management, a secure arbitrary-code execution sandbox, a full content library, billing, or institutional administration. Do not claim those features until implemented and tested. No project can guarantee a salary or outperform another platform without evidence.

## Requirements
- Java 21+
- Node.js 20+
- Docker Desktop (optional but easiest for PostgreSQL)

## Run locally

### 1. Start PostgreSQL
From the repository root:
```bash
docker compose up -d db
```

### 2. Start the Java backend
```bash
cd backend
./mvnw spring-boot:run
```
On Windows:
```powershell
.\mvnw.cmd spring-boot:run
```
Backend: `http://localhost:8080`
Health: `http://localhost:8080/api/health`
Courses: `http://localhost:8080/api/courses`

If Maven Wrapper files are not present in your environment, install Maven 3.9+ and run `mvn spring-boot:run`.

### 3. Start React
In a second terminal:
```bash
cd frontend
npm install
npm run dev
```
Open the Vite URL shown in the terminal (normally `http://localhost:5173`).

### 4. Optional AI provider
Set `OPENAI_API_KEY` in the backend environment to enable the OpenAI Chat Completions API. Never put this key in frontend `.env` files or commit it to Git.
Without a key, the endpoint uses a local demo response and labels it as demo mode.

## Render deployment
1. Push this repository to a GitHub repository.
2. In Render, choose **New + → Blueprint** and select the repository.
3. Review `render.yaml`, then deploy.
4. Set `OPENAI_API_KEY` privately in the backend service environment if you want live AI.
5. After deployment, test `/api/health`, `/api/courses`, and the frontend.

Render free-tier availability, sleep behaviour, database limits, and pricing can change. Check the current plan details before deploying. A free tier is not a promise of permanent zero-cost hosting.

## Environment variables
Backend:
- `PORT` (Render supplies this)
- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`
- `CORS_ALLOWED_ORIGINS` (comma-separated origins)
- `OPENAI_API_KEY` (optional)
- `OPENAI_MODEL` (default `gpt-4o-mini`)

Frontend:
- `VITE_API_BASE_URL` (blank for local Vite proxy; set to deployed backend URL + `/api` in production)

## Before real users
- Add a complete authentication/session flow and authorization policies.
- Add rate limiting, abuse protection, AI cost limits, data retention controls, privacy policy, and terms.
- Use managed secrets; rotate exposed credentials immediately.
- Never execute user-submitted code inside the main backend. Use an isolated sandbox with CPU, memory, network, and time limits.
- Add end-to-end tests, monitoring, backups, and accessibility testing with real users.
