# Brevity

Brevity is a full-stack slang dictionary that lets users search for definitions, register/login, and contribute new terms. It pairs a React + Vite frontend with a Node/Express + Prisma backend, plus PostgreSQL and Redis/Valkey for data and caching.

## Features
- Search for slang terms with definitions, context, and origin.
- User registration, login, email verification, and password reset flows.
- Authenticated contributions of new slang terms.
- Redis-backed caching and rate-limited API endpoints.

## Project Structure
- `backend/`: Express API, Prisma schema, and auth/email utilities.
- `frontend/`: Vite-powered React client.

## Local Development

### Prerequisites
- Node.js 18+
- PostgreSQL
- Redis (or Valkey)

### Backend Setup
```bash
cd backend
npm install
```

Create `backend/.env` with the following values:
```bash
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DB_NAME
JWT_SECRET_KEY=replace-with-secure-secret
REDIS_URI=redis://HOST:PORT
GMAIL_ACCOUNT=you@example.com
GMAIL_PASSWORD=app-password-or-token
PORT=3000
```

Run migrations and start the API:
```bash
npm run migrate
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

> **Note:** The frontend currently calls the API at `http://localhost:3000`. If you run the backend on a different port, update the API URLs in the frontend components accordingly.

## API Overview
- `GET /?requestedTerm=term` — fetch a slang term by query.
- `POST /contribute` — add a new slang term (requires auth cookie).
- `POST /register` — register a new user (sends verification email).
- `GET /verify-email?token=...` — verify a user email.
- `POST /login` — authenticate and set auth cookie.
- `POST /reset-request` — send a password reset email.
- `PUT /reset-password?token=...` — reset password.

## Scripts
### Backend
- `npm run dev` — start the API with Nodemon.
- `npm run build` — compile TypeScript.
- `npm run start` — run the compiled server.
- `npm run migrate` — run Prisma migrations.

### Frontend
- `npm run dev` — start the Vite dev server.
- `npm run build` — build for production.
- `npm run preview` — preview the production build.
- `npm run lint` — run ESLint.
