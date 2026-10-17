# Architecture

## Current MVP
- `frontend`: React + TypeScript single-page responsive UI.
- `backend`: Java 21 + Spring Boot REST API.
- `database`: PostgreSQL, schema managed by Flyway.
- `AI`: backend-only provider integration; local demo mode works without a key.
- `deployment`: Docker for API, Render Blueprint for API + static site + PostgreSQL.

## Request flow
Browser → React → `/api/...` → Spring controller → service/repository → PostgreSQL or AI provider → JSON response → React.

## Security boundaries
- AI keys remain server-side.
- Request bodies have validation and size limits.
- Database access uses JPA parameterization rather than hand-built SQL.
- CORS should be restricted to the exact deployed frontend origin before public launch.
- AI output is untrusted content; render it as text unless a safe markdown renderer is added.
- A code runner must be a separate, hardened sandbox. This repository does not execute user code.

## Next production milestones
1. Authentication with secure session/JWT lifecycle and role-based authorization.
2. Enrollment, lesson progress, quizzes and attempts persisted per user.
3. Course/lesson admin workflow with audit log.
4. AI request rate limits, quotas, timeouts, retries, prompt injection defenses, retrieval and evaluations.
5. Rate limiting, dependency scanning, CSP/security headers, backups, monitoring and privacy controls.
6. Full end-to-end tests and load tests.
