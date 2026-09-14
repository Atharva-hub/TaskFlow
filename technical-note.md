# TaskFlow — Technical Note

## Architecture decisions

The backend follows a strict layered architecture — routes, middleware, controllers, services — so that each layer has exactly one responsibility. Services never import Express types and know nothing about HTTP; they're plain async functions that take and return domain data. This was a deliberate choice: it means the same service functions are directly callable from automated tests (via Supertest against the app) without needing to mock the database, and it means swapping the data layer (in-memory array → Prisma + PostgreSQL, done in an early iteration of this project) required changing only the service files, with zero changes to routes or controllers.

## Database relationships

Three models: `User`, `Project`, `Task`. `User` 1—N `Project` via `ownerId`, `Project` 1—N `Task` via `projectId`, both enforced as real foreign keys with referential integrity at the database level. `TaskStatus`, `TaskPriority`, and `ProjectStatus` are Postgres enums rather than free-text strings, closing the gap between a TypeScript union type (compile-time only) and what the database will actually accept (runtime-enforced). Indexes exist on both foreign key columns and on `Task.status`, since project-scoped task lookups and status filtering are the most frequent queries the API performs.

## Authentication approach

JWT-based, stateless authentication. Passwords are hashed with bcrypt (10 salt rounds) — never stored or logged in plaintext. On login, a token containing only `{ userId }` is signed and returned; the payload is deliberately minimal since JWTs are readable (not encrypted) by design, and anything additional would be dead weight carried on every request. `authMiddleware` verifies the token's signature and expiry on every protected route, attaching the decoded payload to `req.user` via a TypeScript declaration merge on the Express `Request` type.

Authentication (is this a valid, logged-in user?) is deliberately separated from authorization (is this specific user allowed to touch this specific resource?). The former is handled once, centrally, in middleware; the latter is checked per-resource in controllers by comparing `resource.ownerId` against `req.user.userId`, returning `403` rather than `401` when it fails — a distinction enforced consistently and covered by automated tests using two separate real user accounts.

## Key trade-offs

- **Runtime request validation with zod, layered on top of TypeScript's compile-time types.** TypeScript types are a build-time promise, not a runtime guarantee — they don't protect against malformed data arriving over HTTP. zod schemas are the single source of truth for both the runtime check and the derived TypeScript type (via `z.infer`), avoiding the two from drifting apart.
- **Integration tests over unit tests with mocked Prisma.** The test suite runs against a real, disposable PostgreSQL database rather than mocking the ORM. This is slower and requires more setup, but it's the only way to genuinely verify foreign key constraints, ownership filtering, and validation actually work end-to-end — which matters more for a full-stack assessment than isolated unit coverage would.
- **No refresh token flow.** A fixed 1-hour JWT expiry was chosen over building token refresh, as an intentional scope trade-off appropriate to this assignment's size, documented rather than silently omitted.

## Notable constraints

Built under a fixed short deadline; prioritized functional completeness and correctness of the required stack over additional features (e.g. rate limiting, pagination) not explicitly required by the brief. See README "Known limitations" for the current, up-to-date list.

## Frontend architecture

The frontend mirrors the backend's layered discipline: a typed API client (`src/api/`) wraps every backend endpoint behind a single generic `apiRequest<T>` function; custom hooks (`useProjects`, `useTasks`, `useDashboardStats`) own data-fetching and local state, keeping page components focused purely on layout and user interaction. `AuthContext` centralizes login state and JWT storage so any component can read `user`/`token` without prop drilling, and `ProtectedRoute` mirrors the backend's `authMiddleware` — same responsibility, same branching logic, expressed as a routing guard instead of Express middleware.

Frontend tests use React Testing Library with mocked auth/API responses rather than hitting the real backend, unlike the backend's own integration tests against a real database. This is a deliberate, opposite trade-off to the backend's: component tests are verifying rendering and event-handling logic, which doesn't need real network or database state, and keeping them independent of a running backend keeps them fast and reliable to run in isolation.