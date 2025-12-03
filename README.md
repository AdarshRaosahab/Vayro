# VAYRO

**The Premium SaaS Solution.**
VAYRO is a high-performance, design-centric URL shortener and analytics platform built for modern brands.

---

## Brand Identity

**Colors**
- **Ivory**: `#FAF8F2` (Backgrounds)
- **Deep Navy**: `#0A1A2F` (Primary Text, UI Elements)
- **Gold**: `#D7B56D` (Accents, Highlights)
- **Slate Gray**: `#4C566A` (Secondary Text)

**Typography**
- **Headings**: Montserrat
- **Body**: Open Sans

---

## Tech Stack

- **Frontend**: Next.js (React), TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: SQLite (Local Dev), Postgres (Production)
- **Caching**: Redis (Production)
- **ORM**: Prisma

---

## Folder Structure

```
/components   # Reusable UI components (Buttons, Cards, Layout)
/lib          # Utilities (DB connection, Auth helpers)
/pages        # Next.js Pages & API Routes
  /api        # Backend endpoints
/prisma       # Database schema & seed scripts
/public       # Static assets
/styles       # Global CSS & Tailwind directives
/VAYRO-Brand  # Brand assets & guidelines
```

---

## Local Development

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Environment Setup**
    Copy `.env.local.example` to `.env`:
    ```bash
    cp .env.local.example .env
    ```

3.  **Database Setup**
    Initialize the local SQLite database and seed with mock data:
    ```bash
    npx prisma migrate dev --name init
    npm run db:seed
    ```

4.  **Run Development Server**
    ```bash
    npm run dev
    ```
    Visit `http://localhost:3000` to view the app.
    Visit `http://localhost:3000/playground` to view the UI component library.

---

## Environment Setup

- Detailed guide on managing secrets and configurations: [Environment Setup Guide](docs/env-setup.md).

---

## Preflight Checklist

- Ensure your project is ready for launch: [Preflight Checklist](docs/preflight-checklist.md).

---

## API Overview

- **POST /api/shorten**: Create a short link.
  - Body: `{ longUrl, customAlias? }`
- **POST /api/auth/login**: Mock login.
  - Body: `{ email, password }`
- **GET /api/links**: Fetch user links.
- **GET /api/analytics/:id**: Fetch analytics for a specific link.

### Dashboard API
- **GET /api/auth/me**: Get current user session.
- **GET /api/links/list**: List all user links with stats.
- **POST /api/links/update**: Update link target or alias.
- **POST /api/links/delete**: Delete a link.
- **POST /api/analytics/summary**: Get aggregated analytics for a link.

---

## Docker Guide

For a production-like environment with Postgres and Redis:

1.  **Setup Environment**
    Copy `.env.docker.example` to `.env`.

2.  **Start Services**
    ```bash
    docker-compose up -d
    ```

3.  **Run Migrations**
    ```bash
    docker-compose exec web npx prisma migrate deploy
    ```

---

## Deployment

- **Vercel**: Recommended for frontend/API. See [Vercel Deployment Guide](docs/vercel-deploy.md).
- **Docker**: Use the provided `Dockerfile` to build a standalone image for any container orchestration platform (AWS ECS, DigitalOcean App Platform, etc.).

---

## CI/CD

- Automated quality checks and builds via GitHub Actions. See [CI/CD Notes](docs/ci-cd-notes.md).

---

## Brand Assets

All brand assets, including logos and the brand guide, are located in the `VAYRO-Brand/` directory.
- **Logos**: Horizontal, Square, Monogram (Light/Dark)
- **Favicons**: Generated in `VAYRO-Brand/Favicon/`

---

## 🚀 Preparing for Production

VAYRO is ready for deployment. Please refer to the following documentation:

- **[Release Checklist](docs/release-checklist.md)**: Pre-flight checks for environment, security, and performance.
- **[V1 Release Notes](docs/release-notes-v1.md)**: Features, limitations, and roadmap.
- **[Deployment Guides](docs/deploy-vercel.md)**: Instructions for Vercel and Docker.

To verify the codebase before release, run:
```bash
npm run release:check
```

## License

Copyright © 2023 VAYRO. All rights reserved.
