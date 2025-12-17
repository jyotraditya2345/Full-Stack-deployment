# Collaborative Task Manager

Production-ready full-stack task management app with real-time collaboration, built with React, Express, Prisma, and Socket.io.

## Live Deployment
- Frontend: _add Vercel/Netlify URL here_
- Backend API: _add Render/Railway URL here_ (must expose `/api` and `/socket.io`)

## Stack
- **Frontend:** Vite + React + TypeScript, Tailwind CSS, React Query, React Hook Form + Zod, Socket.io-client.
- **Backend:** Node.js + Express (TypeScript), Prisma ORM, Zod DTO validation, Socket.io.
- **Database:** PostgreSQL via Prisma (selected for reliability, relational integrity, and first-class Prisma support).
- **Real-time:** Socket.io rooms keyed by userId for assignment alerts and global broadcasts for task updates.
- **Testing:** Jest unit tests for task business rules.

## Project Structure
- `backend/` – Express API, Prisma schema, services/repositories, socket gateway, Jest tests.
- `frontend/` – Vite React app with auth, dashboard, tasks CRUD, filtering/sorting, real-time hooks.

## Run Locally
Backend (PORT=3000 by default in `.env`):
```bash
cd backend
cp .env.example .env
# set DATABASE_URL, JWT_SECRET, CLIENT_URL, COOKIE_SECURE
npm install
npm run prisma:generate
npm run prisma:migrate
npm run dev   # http://localhost:3000
```

8-line-space-separated local reset/start (if ports/env drift during dev):

```bash






# stop any old backend on 3000
pkill -f "ts-node-dev .*src/index.ts" || true
lsof -ti :3000 | xargs kill -9 2>/dev/null || true

# update backend client URL to match Vite port (e.g., 5174)
cd "/Users/jyotiradityachopra/Desktop/Collaborative Task Manager/backend"
cat > .env <<'EOF'
DATABASE_URL=postgresql://jyotiradityachopra:MyStrongPass123@localhost:5432/task_manager?schema=public
JWT_SECRET=4cfed8771db780534f5f4306faa6d0e40e4c454440dfe09f80d535c37990e87de23af88ad797c6a9e7eaa0bb00277a71
CLIENT_URL=http://localhost:5174
COOKIE_SECURE=false
PORT=3000
EOF

# start backend
npm run dev
```

Frontend (point to backend):
```bash
cd frontend
cp .env.example .env
# set VITE_API_URL=http://localhost:3000/api
# set VITE_SOCKET_URL=http://localhost:3000
npm install
npm run dev -- --host --port 5173   # http://localhost:5173
```

## API Contract (base `/api`)
- `POST /auth/register` – { name, email, password } -> sets HttpOnly JWT cookie.
- `POST /auth/login` – { email, password } -> sets HttpOnly JWT cookie.
- `POST /auth/logout`
- `GET /auth/me`
- `GET /users` – list users (id/name/email) for assignment.
- `GET /users/me`, `PATCH /users/me`
- `GET /tasks` – filters: `status`, `priority`, `sort`, `assignedToId`, `creatorId`.
- `POST /tasks`, `PATCH /tasks/:id`, `DELETE /tasks/:id`, `GET /tasks/:id`
- `GET /tasks/dashboard` – assigned/created/overdue bundles.
- `GET /notifications`, `PATCH /notifications/:id/read`

## Architecture Notes
- Controllers are thin; services handle business rules (auth, permissions, assignment notifications, audit logging).
- Repositories encapsulate all Prisma calls.
- DTO validation via Zod + middleware for consistent 400s.
- JWT stored in HttpOnly cookie; `requireAuth` middleware populates `req.user`.
- Socket.io server joins clients to their `userId` room; emits `task:updated` to all clients and `task:assigned` to the assignee’s room with task + notification payload.
- Audit log: `TaskAudit` records create/update/delete events.

## Frontend Features
- Auth flows (login/register) with cookie-based session.
- Dashboard: assigned/created/overdue sections + skeleton loading.
- Tasks: create/edit form (React Hook Form + Zod), filter by status/priority, sort by due date, CRUD actions.
- Real-time invalidation via Socket.io: task updates + assignment notifications trigger React Query cache refresh.
- Notification bell with persistent in-app notifications and read state.
- Responsive layout styled with Tailwind.

## Deployment (recommended)
- **Frontend:** Vercel (set `VITE_API_URL` to backend `/api`, `VITE_SOCKET_URL` to backend origin).
- **Backend:** Render/Railway. Set env vars (`DATABASE_URL`, `PORT`, `CLIENT_URL`, `JWT_SECRET`, `COOKIE_SECURE=true`). Build `npm run build`; start `npm run start`. Run `npm run prisma:migrate` once.
- Configure CORS to allow the deployed frontend origin.

## Testing
- `backend`: `npm test` runs Jest unit tests for task service rules (assignment validation, permissions, notification emission).
- Add integration tests (e.g., supertest) as needed for HTTP flows.

## Real-time Integration
- Client connects with `auth: { userId }` to Socket.io; server joins that room.
- On task updates, server emits `task:updated`; React Query invalidates task/dashboard queries.
- On assignment, server persists a `Notification` row and emits `task:assigned` to the assignee’s room; UI refreshes notifications/tasks/dashboard.

## Notes & Trade-offs
- JWT cookies used for simplicity; rotate tokens for stricter production hardening.
- Rate limiting/logging omitted for brevity; add `express-rate-limit` and structured logging in production.
- Add live URLs above once deployed.
