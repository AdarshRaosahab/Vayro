# VAYRO Developer Onboarding Guide

## 1. Introduction
Welcome to **VAYRO**, the premium SaaS solution for modern link management and analytics. This guide ensures a smooth setup and consistent development workflow.

## 2. System Requirements
- **Node.js**: v18.0.0 or higher
- **Package Manager**: npm (v9+)
- **Database**: SQLite (Local), Postgres (Production)
- **Docker**: Optional, for local production simulation

## 3. Project Structure
- **/pages**: Next.js routes and API endpoints.
- **/components**: Reusable UI components (Atomic design principles).
- **/lib**: Shared utilities, DB clients, and auth helpers.
- **/prisma**: Database schema and seed scripts.
- **/styles**: Global CSS and Tailwind configuration.
- **/VAYRO-Brand**: Official brand assets and guidelines.

## 4. Installing Dependencies
Clone the repository and install dependencies:
```bash
npm install
```

## 5. Running Development Mode
Start the local development server:
```bash
npm run dev
```
Access the app at `http://localhost:3000`.

## 6. Environment Variables
Copy the example environment file to set up your local secrets:
```bash
cp .env.local.example .env
```
Ensure `DATABASE_URL` is set to `"file:./dev.db"` for local SQLite development.

## 7. Local Database Setup
We use **Prisma** with **SQLite** for a zero-config local experience.

1.  **Run Migrations**: Create the local database file.
    ```bash
    npx prisma migrate dev --name init
    ```
2.  **Seed Data**: Populate with mock users and analytics.
    ```bash
    npm run db:seed
    ```

## 8. Running Docker
To simulate the production stack (Postgres + Redis):
```bash
docker-compose up -d
```
This spins up Postgres on port `5432` and Redis on `6379`.

## 9. API Development Flow
- API routes are located in `/pages/api`.
- Use `NextApiRequest` and `NextApiResponse` types.
- Keep handlers lightweight; delegate logic to `/lib` functions.
- Always return JSON responses with `{ ok: boolean, ... }`.

## 10. UI Development Flow
- **Styling**: Use Tailwind CSS utility classes.
- **Components**: Build reusable components in `/components`.
- **Playground**: Test components in isolation at `/pages/playground.tsx`.
- **Fonts**: Use `font-heading` (Montserrat) for titles and `font-sans` (Open Sans) for body text.

## 11. Brand Assets Integration
- **Source of Truth**: `/VAYRO-Brand` contains all approved logos and favicons.
- **Usage**: Import assets from `/public` or reference `/VAYRO-Brand` for design work.
- **Do Not**: Do not modify original logo files or generate new variations without approval.

## 12. Code Style Guidelines
- **TypeScript**: Strict mode enabled. No `any` types unless absolutely necessary.
- **React**: Functional components with hooks.
- **Formatting**: Prettier is configured; run `npm run lint` before committing.

## 13. Branching & Commit Guidelines
- **Branches**: `feature/feature-name`, `fix/bug-description`.
- **Commits**: Conventional Commits (e.g., `feat: add analytics card`, `fix: login redirect`).

## 14. Future Expansion
- **Teams**: Schema support for multi-user workspaces.
- **Analytics**: Migration path to ClickHouse for high-volume event ingestion.
- **Billing**: Stripe integration via webhooks.

## 15. Support
For questions or access issues, refer to the `README.md` or contact the lead developer.
