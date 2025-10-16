# Military Asset Management System

A full-stack application to manage military assets across bases, including purchases, transfers, assignments, and expenditures, with role-based access control and a responsive dashboard.

**Frontend**: React + Vite + Tailwind CSS
**Backend**: Node.js + Express + MongoDB (Mongoose)

## Features
- Authentication using JWT; client stores token in `localStorage` and attaches it via Axios interceptor
- Role-based access control on routes: `Admin`, `BaseCommander`, `LogisticsOfficer`, `Viewer`
- Asset lifecycle management:
  - Purchases, Transfers, Assignments, Expenditures
  - Dashboard summarizing opening/closing balances, net movement, and in-range assigned/expended
- Modern UI: Tailwind components, translucent “glassy” auth forms, global footer, background imagery
- CORS configured via environment variable allowing local development and deployed client

## Tech Stack
- Frontend: `react`, `react-router-dom`, `vite`, `tailwindcss`
- Backend: `express`, `mongoose`, `jsonwebtoken`, `bcrypt`, `cors`, `dotenv`
- Node: `20.x` (see `.nvmrc`)
- Deployment (backend): Render (`render.yaml` included)

## Project Structure
```
military-asset-management/
├── client/                 # React + Tailwind frontend
│   ├── public/             # Static assets (favicon, background image)
│   └── src/
│       ├── components/     # Navbar, Sidebar, Footer, Layout, etc.
│       ├── context/        # AuthContext (JWT handling)
│       ├── pages/          # Dashboard, Purchases, Transfers, Assignments, Expenditures, Login, Register
│       ├── services/       # Axios instance with interceptors
│       └── utils/          # Roles, storage
└── server/                 # Node + Express + MongoDB backend
    ├── config/             # DB connection
    ├── middleware/         # Auth and role guard
    ├── models/             # Mongoose models
    └── routes/             # REST API routes
```

## Getting Started

### Prerequisites
- `Node.js 20.x`
- A running `MongoDB` instance (local or cloud)

### Environment Variables

Backend (`server/.env`):
- `PORT` — default `5000`
- `MONGO_URI` — your MongoDB connection string
- `JWT_SECRET` — secret key for signing JWTs
- `CORS_ORIGIN` — comma-separated allowed origins, e.g. `http://localhost:5173` (and any deployed client URL)
- `SERVE_CLIENT` — optional `true` to serve built client from `server` in production

Frontend (`client/.env`):
- `VITE_API_BASE_URL` — default `http://localhost:5000/api`

### Install Dependencies
- Root repo uses workspaces for `client` and `server`, but each has its own dependencies.
- Install separately:
  - `cd server && npm install`
  - `cd client && npm install`

### Run in Development
- Start backend: `cd server && npm start`
- Start frontend: `cd client && npm run dev`
- Open the client at the Vite dev URL (default `http://localhost:5173/`).

### Build and Preview Frontend
- `cd client && npm run build`
- Preview built assets: `npm run preview`

## Authentication & Roles
- Login (`POST /api/auth/login`) returns `{ token, user }` where `user` includes `id, name, email, role`.
- Client stores the token and user in `localStorage` via `AuthContext`.
- Roles (server enum and client constants):
  - `Admin`, `BaseCommander`, `LogisticsOfficer`, `Viewer`
- Route guards in the client ensure only allowed roles can access certain pages.

## API Overview

Base URL: `http://localhost:5000/api`

- `POST /auth/register` — create a user
- `POST /auth/login` — authenticate and receive JWT
- `GET /bases` — list bases; CRUD under `/bases/:id`
- `GET /assets` — list assets; CRUD under `/assets/:id`
- `GET /purchases` — list purchases; CRUD under `/purchases/:id`
- `GET /transfers` — list transfers; CRUD under `/transfers/:id`
- `GET /assignments` — list assignments; CRUD under `/assignments/:id`
- `GET /expenditures` — list expenditures; CRUD under `/expenditures/:id`
- `GET /dashboard` — aggregated metrics (supports filters like base, type, date range)

All protected endpoints require `Authorization: Bearer <JWT>`. The client automatically attaches this header if a token is present.

### Example: Register
Request:
```
POST /api/auth/register
Content-Type: application/json

{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "secret123",
  "role": "LogisticsOfficer"
}
```

### Example: Purchases (list)
```
GET /api/purchases?base=Alpha&date=2024-07-01
Authorization: Bearer <JWT>
```

## Data Models (Server)
- `User` — name, email (unique), password (hashed), role (enum: above), base (optional)
- `Base` — name (unique), location
- `Asset` — name, type (enum), base, quantity
- `Purchase` — asset, base, quantity, purchaseDate, addedBy
- `Transfer` — asset, fromBase, toBase, quantity, transferDate, initiatedBy
- `Assignment` — asset, base, quantity, assignedTo, assignmentDate, createdBy
- `Expenditure` — asset, base, quantity, reason, dateExpended, createdBy

## Frontend Pages
- `Login` / `Register` — translucent form UI, background image, global footer
- `Dashboard` — filters for base, equipment type, date range and summary cards
- `Purchases` / `Transfers` / `Assignments` / `Expenditures` — forms and tables for CRUD/list operations

## CORS & Deployment
- CORS origins are controlled via `CORS_ORIGIN` in server `.env`.
- Backend deployment example uses Render (`render.yaml`).
  - Ensure `MONGO_URI` is set as a secret.
  - Configure `CORS_ORIGIN` to include your deployed client URL.
  - Health check path: `/health`.

## Error Handling & Auth Interceptor
- Client Axios interceptor clears storage and redirects to `/login` on `401` responses.
- Server uses centralized auth middleware to validate `Authorization` header and decode JWT.

## Troubleshooting
- Role validation errors: ensure client submits valid enum values (e.g., `BaseCommander`, not `Base Commander`).
- `401 Unauthorized`: token missing or expired; login again.
- MongoDB connection issues: verify `MONGO_URI` and network access.

## Development Notes
- Node version pinned via `.nvmrc` (20).
- Client and server are separate apps; deploy independently or have the server serve built client (`SERVE_CLIENT=true`).

---
Made for the with ❤️ by Snehit