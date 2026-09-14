## Frontend setup

### 1. Install
```bash
cd frontend
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
```
`VITE_API_URL` should point at your running backend (default `http://localhost:3000/api/v1`).

### 3. Run
```bash
npm run dev
```
Opens at `http://localhost:5173`. The backend must be running separately (see above) — the frontend makes real API calls to it.

### Running frontend tests
```bash
npm test
```

### Production build
```bash
npm run build
```
# TaskFlow

A full stack task and project management platform for small teams, built as a technical assessment for Genpact (Applicant ID: GP-FS-26147).

## Tech stack

| Layer          | Technology                                   |
|----------------|-----------------------------------------------|
| Frontend       | React + TypeScript (Vite)                    |
| Backend        | Node.js + Express + TypeScript (ESM)         |
| Database       | PostgreSQL via Prisma ORM                    |
| Authentication | JWT (bcrypt-hashed passwords)                |
| Validation     | zod                                           |
| Testing        | Vitest + Supertest                           |

## Project structure

taskflow/
├── backend/ — Express API, Prisma schema, tests
├── frontend/ — React SPA
└── README.md


## Architecture overview

Three-tier architecture: a React SPA communicates with an Express REST API over HTTPS with JWT-based auth; the API is the only component with database access, reaching PostgreSQL exclusively through Prisma's parameterized queries.

Inside the API, every request flows through a fixed layer chain:
`routes → auth middleware → validation middleware → controller → service → Prisma → PostgreSQL`

- **Routes** map HTTP method + path to a handler — no logic.
- **Middleware** (`authMiddleware`, `validateBody`/`validateQuery`) handles cross-cutting concerns — identity and input shape — before a request ever reaches business logic.
- **Controllers** translate between HTTP and plain function calls: read the request, call a service, shape the response.
- **Services** hold all business logic and are the only layer that talks to Prisma. They have no knowledge of HTTP, which is what makes them directly testable and reusable.

## Setup instructions

### Prerequisites
- Node.js 20+
- Docker (for PostgreSQL)

### 1. Clone and install
```bash
git clone <your-repo-url>
cd taskflow/backend
npm install
```

### 2. Start PostgreSQL
```bash
docker run --name taskflow-db \
  -e POSTGRES_USER=taskflow \
  -e POSTGRES_PASSWORD=taskflow_dev_password \
  -e POSTGRES_DB=taskflow \
  -p 5432:5432 \
  -d postgres:16
```

### 3. Configure environment variables
```bash
cp .env.example .env
```
Then fill in `.env` — see the [Environment variables](#environment-variables) table below for what each one means. `DATABASE_URL` should already match the Docker command above if you used it as-is.

### 4. Run migrations and seed data
```bash
npx prisma migrate deploy
npx prisma db seed
```
This creates the schema and adds a demo user, project, and two tasks so the app isn't empty on first run. Demo login: `demo@taskflow.dev` / `DemoPass123!`.

### 5. Start the server
```bash
npm run dev
```
API is now running at `http://localhost:3000`. Confirm with:
```bash
curl http://localhost:3000/api/v1/health
```

### Running tests
```bash
# create a separate test database first (one-time setup)
docker exec -it taskflow-db psql -U taskflow -c "CREATE DATABASE taskflow_test;"
cp .env.test.example .env.test   # fill in DATABASE_URL pointing at taskflow_test

DATABASE_URL="<your test db url>" npx prisma migrate deploy
npm test
```

### Production build
```bash
npm run build
npm start
```

## Environment variables

| Variable         | Description                                      | Example                                                    |
|-------------------|--------------------------------------------------|--------------------------------------------------------------|
| `PORT`            | Port the server listens on                       | `3000`                                                        |
| `NODE_ENV`        | Runtime environment                               | `development`                                                 |
| `DATABASE_URL`    | PostgreSQL connection string                      | `postgresql://user:pass@localhost:5432/taskflow?schema=public`|
| `JWT_SECRET`      | Secret used to sign auth tokens (generate a long random string, never reuse the example) | — |
| `JWT_EXPIRES_IN`  | How long a token stays valid                      | `1h`                                                           |
| `CORS_ORIGIN`     | Origin allowed to call the API (the frontend's URL) | `http://localhost:5173`                                      |

## API summary

Base URL: `/api/v1`. All routes except `/auth/register` and `/auth/login` require `Authorization: Bearer <token>`.

| Method | Endpoint                | Description                              |
|--------|---------------------------|-------------------------------------------|
| POST   | `/auth/register`          | Create a new user account                 |
| POST   | `/auth/login`              | Log in, receive a JWT                     |
| GET    | `/projects`                 | List the authenticated user's projects    |
| POST   | `/projects`                 | Create a project                          |
| GET    | `/projects/:id`             | Get a single project                      |
| PUT    | `/projects/:id`             | Update a project                          |
| DELETE | `/projects/:id`             | Delete a project                          |
| GET    | `/tasks`                     | List tasks (supports `?status=`, `?priority=`, `?sortBy=`, `?order=`) |
| POST   | `/tasks`                     | Create a task                             |
| GET    | `/tasks/:id`                 | Get a single task                         |
| PUT    | `/tasks/:id`                 | Update a task                             |
| DELETE | `/tasks/:id`                 | Delete a task                             |
| GET    | `/dashboard`                 | Task/project statistics for the authenticated user |

Full request/response examples: import `backend/docs/postman_collection.json` and `backend/docs/postman_environment.json` into Postman.

## Known limitations

- **No refresh tokens.** JWTs expire after 1 hour (`JWT_EXPIRES_IN`) with no renewal flow — users must log in again after expiry. A reasonable, explicit trade-off for this assignment's scope rather than an oversight.
- **No rate limiting** on auth endpoints (e.g. brute-force login attempts). Would add `express-rate-limit` in a production system.
- **No pagination** on `GET /projects` or `GET /tasks` — acceptable at small-team scale, but would need `?page=`/`?limit=` for larger datasets.
- **JWT stored in localStorage**, not an httpOnly cookie — simpler to implement given the timeline, but means the token is readable by any JavaScript running on the page. A production system would use httpOnly cookies to mitigate XSS-based token theft.
- **Project detail view groups tasks by project client-side** rather than via a dedicated `?projectId=` query param — acceptable at small-team task volumes.