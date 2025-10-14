# Military Asset Management System

This repository is a monorepo for a fullstack application with a React + Tailwind frontend and a Node.js + Express + MongoDB backend.

## Structure

```
military-asset-management/
│
├── client/                # React + Tailwind Frontend
│
├── server/                # Node.js + Express + MongoDB Backend
│
├── .env                   # Environment variables (JWT secret, DB URI, etc.)
├── package.json           # (optional if managing both client & server together)
├── README.md
└── .gitignore
```

## Next Steps

- Initialize the frontend in `client` (e.g., Vite React + Tailwind).
- Initialize the backend in `server` (Express + MongoDB connection).
- Wire up scripts in the root `package.json` to run both.