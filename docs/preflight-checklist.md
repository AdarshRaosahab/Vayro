# VAYRO Preflight Checklist

Before committing code or deploying to production, ensure all items in this checklist are verified.

## 1. Project Folder Validation
- [ ] `/components` exists and contains UI components.
- [ ] `/lib` contains `db.ts` and `auth.ts`.
- [ ] `/pages` contains `index.tsx`, `_app.tsx`, `_document.tsx`.
- [ ] `/pages/api` contains backend routes.
- [ ] `/public` contains static assets.
- [ ] `/styles` contains `globals.css`.
- [ ] `/prisma` contains `schema.prisma` and `seed.ts`.
- [ ] `/VAYRO-Brand` contains brand assets.

## 2. Environment Variables
- [ ] `.env` is created (from `.env.local.example` or `.env.production.example`).
- [ ] `DATABASE_URL` is set correctly.
- [ ] `NEXT_PUBLIC_BASE_URL` matches the environment.
- [ ] Secrets (`SESSION_SECRET`, `JWT_SECRET`) are strong and random.
- [ ] `.env` is included in `.gitignore`.

## 3. Dev Tools
- [ ] Node.js v18+ is installed (`node -v`).
- [ ] npm v9+ is installed (`npm -v`).
- [ ] Docker is running (if using Docker workflow).

## 4. Database Setup
- [ ] Migrations are applied (`npx prisma migrate dev` or `deploy`).
- [ ] Database is seeded (`npm run db:seed`) for development.
- [ ] Prisma Client is generated (`npx prisma generate`).

## 5. API Endpoint Smoke Test
- [ ] `POST /api/shorten` returns 200 OK.
- [ ] `GET /api/links` returns list of links.
- [ ] `POST /api/auth/login` handles credentials.

## 6. UI Pages Load Test
- [ ] Landing page (`/`) loads without errors.
- [ ] Dashboard (`/dashboard`) loads and fetches data.
- [ ] Playground (`/playground`) renders all components correctly.

## 7. Docker Build Test
- [ ] `docker-compose build` completes without error.
- [ ] Containers start successfully (`docker-compose up`).

## 8. Vercel Deployment Test
- [ ] Build command `npm run build` passes locally.
- [ ] Environment variables are configured in Vercel project settings.

## 9. GitHub Actions CI
- [ ] Push to branch triggers `VAYRO CI`.
- [ ] Linting and Type Checking pass.

## 10. Brand Kit
- [ ] Logos are present in `/VAYRO-Brand`.
- [ ] Favicons are generated in `/VAYRO-Brand/Favicon`.

## 11. Coding Style
- [ ] No `console.log` in production code.
- [ ] No `any` types in TypeScript (unless necessary).
- [ ] Components use Tailwind utility classes.

## 12. Security Sanity Checks
- [ ] No secrets committed to Git.
- [ ] API routes validate input.
- [ ] Headers (CSP, X-Frame-Options) are configured in `next.config.js` or `vercel.json`.

## 13. Before Pushing to Main
- [ ] Run `npm run lint`.
- [ ] Run `npm run build` to check for build errors.
- [ ] Verify `preview.yml` passes on PR.

## 14. Before Deploying
- [ ] specific production secrets are set in the deployment platform.
- [ ] Database backup strategy is in place.
