# VAYRO Docker Setup

This directory contains the Docker configuration for VAYRO.

## Prerequisites
- Docker
- Docker Compose

## Quick Start
1. Copy `.env.docker.example` to `.env`
2. Run `docker-compose up -d` to start Postgres and Redis.
3. Run `docker-compose up --build web` to build and start the Next.js app.

## Services
- **Postgres**: v15, Port 5432
- **Redis**: v7, Port 6379
- **Web**: Next.js App, Port 3000

## Development
For local development, you can run `npm run dev` locally while keeping Postgres and Redis running in Docker:
```bash
docker-compose up -d postgres redis
npm run dev
```

## Migration & Seeding
To run migrations inside the container:
```bash
docker-compose exec web npx prisma migrate deploy
```
