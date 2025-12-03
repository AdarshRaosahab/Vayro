# Docker Deployment Guide

## Prerequisites
- Docker & Docker Compose installed on the host.
- A reverse proxy (Nginx/Traefik) for SSL termination (Docker container runs on HTTP).

## Build & Run

1.  **Build the Image**
    ```bash
    docker build -t vayro:latest .
    ```

2.  **Run with Compose**
    Create a `docker-compose.yml`:
    ```yaml
    version: '3'
    services:
      web:
        image: vayro:latest
        ports:
          - "3000:3000"
        env_file:
          - .env.production
        restart: always
    ```

3.  **Start**
    ```bash
    docker-compose up -d
    ```

## Environment Variables (`.env.production`)
Ensure all variables from `docs/release-checklist.md` are present.
**Important**: `DATABASE_URL` must be accessible from within the container (use host IP or cloud DB URL).

## Volumes
- If using SQLite (not recommended for multi-container prod), mount the db file:
    ```yaml
    volumes:
      - ./prisma/dev.db:/app/prisma/dev.db
    ```

## Production Best Practices
- **Multi-stage Build**: Ensure `Dockerfile` uses multi-stage builds to keep image size small (only `node_modules` required for production).
- **User**: Run container as non-root user (Next.js Dockerfile usually handles this).
- **Healthcheck**: Implement a healthcheck in `docker-compose.yml`.
