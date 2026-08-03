# QuickHire Frontend

React SPA for the QuickHire job portal — public job search, job details with an apply flow, and role-based dashboards for candidates, recruiters, and admins.

## Tech Stack

- React 19 + TypeScript
- Vite + Tailwind CSS v4
- TanStack React Query (server state), Zustand (auth, saved jobs)
- React Hook Form + Zod (forms & validation)
- React Router 7, Recharts, Framer Motion, sonner (toasts), lucide-react

## Getting Started

```bash
npm install
npm run dev     # http://localhost:5173
```

Set `VITE_API_BASE_URL` in `.env` (default `http://localhost:5000/api`). Demo quick-fill login values come from `VITE_DEMO_*`.

Scripts:

- `npm run dev` — start dev server
- `npm run build` — typecheck + production build (`dist/`)
- `npm run lint` — ESLint
- `npm run preview` — preview the production build

## Structure

- `src/pages/` — public pages (home, job search, job details, auth)
- `src/features/` — per-role modules: `landing`, `jobs`, `candidate`, `recruiter`, `admin`
- `src/components/` — shared layout & UI components
- `src/services/` — HTTP client, mappers, API services
- `src/store/` — Zustand stores (auth, saved jobs)
- `src/routes/` — route definitions with protected, role-based routing

## Demo Accounts

| Role      | Email                    | Password      |
| --------- | ------------------------ | ------------- |
| Admin     | `admin@quickhire.app`    | `password123` |
| Recruiter | `recruiter@quickhire.app`| `password123` |
| Candidate | `candidate@quickhire.app`| `password123` |

The login page has quick-fill buttons for each role (values from `frontend/.env`). Start the backend first — see `../backend/README.md`.
